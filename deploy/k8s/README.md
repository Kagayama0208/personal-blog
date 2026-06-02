# オンプレ K8s デプロイ (Payload blog)

Postgres = CloudNativePG / メディア = AWS S3 / 公開 = 既存共有 Cloudflare Tunnel / マニフェスト = Kustomize。
設計の背景は `/home/vscode/.claude/plans/k8s-groovy-sparkle.md` を参照。

> **公開について**: cloudflared は別の `cloudflare` namespace で稼働中の共有トンネルを使う（本プロジェクト管理外）。
> このプロジェクトは ClusterIP Service を出すだけで、ルートは Cloudflare ダッシュボードで追加する。

## 構成

```
deploy/k8s/
  infra/cnpg-cluster.yaml          # CloudNativePG Cluster（クラスタに一度だけ）
  base/                            # アプリ本体の共通マニフェスト
    namespace / configmap / deployment / service
    migrate-job / networkpolicy / hpa / pdb / kustomization
  overlays/production/             # 本番値（image タグ・ドメイン・Secret テンプレ）
```

## 前提（クラスタ側、一度だけ）

- **CloudNativePG operator** を導入
- 任意: **metrics-server**（HPA を使う場合）
- AWS への **egress 443** を許可（メディア S3）
- **共有 Cloudflare Tunnel**（`cloudflare` ns）が稼働済み。リモート管理（ダッシュボード）方式。
- default-deny NetworkPolicy 採用 → `base/networkpolicy.yaml` で `cloudflare` ns からの ingress を許可（CNI に応じて probe 用ノード CIDR / egress を調整）

## 1. イメージのビルド & push

ドメインはビルド時に焼き込まれるため `--build-arg` 必須。アプリ用と migrate 用の2タグを作る。

```bash
SHA=$(git rev-parse --short HEAD)
REG=registry.example.internal/payload-blog

# アプリ（standalone runner）
docker build \
  --build-arg NEXT_PUBLIC_SERVER_URL=https://kousuke.dev \
  -t $REG:$SHA .

# migrate（payload CLI + full node_modules を持つ migrator ステージ）
docker build --target migrator \
  --build-arg NEXT_PUBLIC_SERVER_URL=https://kousuke.dev \
  -t $REG:$SHA-migrate .

docker push $REG:$SHA
docker push $REG:$SHA-migrate
```

`overlays/production/kustomization.yaml` の `newTag` を `$SHA` / `$SHA-migrate` に更新。

## 2. Secret 類（リポジトリ外で投入）

`overlays/production/secret.example.yaml` のキー一覧に従い、実値は **SealedSecrets / External Secrets** で投入:

- `payload-blog-secrets`（PAYLOAD_SECRET, CRON_SECRET, PREVIEW_SECRET, S3_ACCESS_KEY_ID, S3_SECRET_ACCESS_KEY）
- `regcred`（private registry の pull secret）
- `payload-pg-app` は **CNPG が自動生成**（手動作成しない）
- cloudflared トークンは**不要**（共有トンネル側で管理）

```bash
kubectl create secret docker-registry regcred \
  --docker-server=registry.example.internal \
  --docker-username=<user> --docker-password=<pass> -n payload-blog
```

## 3. 適用順序

```bash
# 3-1. namespace（infra が参照するので先に）
kubectl apply -f base/namespace.yaml

# 3-2. CNPG クラスタ → healthy & payload-pg-app Secret 生成を待つ
kubectl apply -f infra/cnpg-cluster.yaml
kubectl wait --for=condition=Ready cluster/payload-pg -n payload-blog --timeout=300s

# 3-3. Secret 類を投入（手順2）

# 3-4. マイグレーション Job を先行実行して完了を待つ
kubectl apply -k overlays/production --dry-run=client -o yaml \
  | yq 'select(.kind=="Job")' | kubectl apply -f -    # Job だけ先に
kubectl wait --for=condition=complete job/payload-migrate -n payload-blog --timeout=300s

# 3-5. 残り（Deployment / Service / NetworkPolicy / HPA / PDB）
kubectl apply -k overlays/production

# 3-6. 共有トンネルにルート追加（Cloudflare Zero Trust ダッシュボード）:
#      Public Hostname: kousuke.dev
#      Service:         http://payload-blog.payload-blog.svc.cluster.local:80
#      → K8s 側の追加作業は不要（このプロジェクトは Service を出すだけ）
```

> 初回ブートストラップでは `kubectl apply -k overlays/production` 一発でも可。アプリ起動と
> migrate Job が並走するが、`/health` は DB フリーで応答し、migrate 完了後に DB 依存ページが
> 正常化する。アップグレードで新しいマイグレーションがある場合は、完了済み（または TTL 失効済み）の
> Job を消してから新 image の Job を先行適用すること。

## 4. スモークテスト

```bash
kubectl rollout status deploy/payload-blog -n payload-blog
kubectl run curl --rm -it --image=curlimages/curl -- \
  curl -s http://payload-blog.payload-blog.svc.cluster.local/health   # {"status":"ok"}
```

- `https://kousuke.dev/health` が Cloudflare 経由で 200
- `/admin` で初回管理ユーザー作成 → ログイン
- 画像アップロード → AWS S3 バケットに原本 + 7サイズ（thumbnail/square/small/medium/large/xlarge/og）
- replicas:2 で連続リロードしても全 Pod で画像表示（= S3 共有）

## メモ

- `NEXT_PUBLIC_SERVER_URL` は **ビルド arg と configmap で必ず同値**（不一致だと画像最適化 400 や CORS/SEO 不整合）
- ステージング等でドメインが変わる場合は **別 image** をビルドし、別 overlay で参照する
