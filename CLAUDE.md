# Claude Code

This project uses the Payload CMS skill at `.claude/skills/payload/`.
Start with `.claude/skills/payload/SKILL.md` for a quick reference, then see `.claude/skills/payload/reference/` for detailed docs.

## コード規約

このプロジェクトは Payload CMS 公式ウェブサイトテンプレート（Next.js 16 App Router + React 19 + Payload 3.85 + Postgres）がベース。以下はリポジトリの実設定・既存コードから導いた規約。

### ツール & コマンド
- パッケージマネージャは **pnpm**（`engines`: pnpm 9/10）。`npm`/`yarn` は使わない。
- コミット前に必ず実行: `pnpm lint`（修正は `pnpm lint:fix`）。
- 型生成: コレクション/フィールド/グローバルを変更したら `pnpm generate:types`。コンポーネント追加時は `pnpm generate:importmap`。
- テスト: `pnpm test`（= int + e2e）。int=Vitest、e2e=Playwright。

### フォーマット（Prettier / EditorConfig — 設定済み、手で崩さない）
- **セミコロンなし**・**シングルクォート**・`trailingComma: all`・`printWidth: 100`。
- インデントは **2スペース**、改行 LF、末尾改行あり、末尾空白なし。

### TypeScript
- `strict: true`。`any` は ESLint で warn になる → 具体型 or `unknown` を使う。
- 型のみの import は `import type { ... }` で分離する（既存コードに準拠）。
- 未使用変数は `_` プレフィックスで許容（例: `_unused`, catch は `_` / `ignore`）。
- パスエイリアス `@/*` → `src/*`。トップレベルディレクトリをまたぐ import は `@/` を使う。コレクション等のフォルダ内では相対 import でよい（既存コードと統一）。

### 生成ファイル（手編集禁止）
- `src/payload-types.ts` と `src/payload-generated-schema.ts` は自動生成。直接編集せず、スキーマを変えて再生成する（lint/prettier の ignore 対象）。

### Payload 構成
- コレクションは `src/collections/<Name>/index.ts`、ブロック/グローバルは `<Name>/config.ts`。フックは同フォルダの `hooks/` に分離。
- `CollectionConfig<'slug'>` のようにスラグのジェネリクスを渡して型安全にする。
- アクセス制御は `src/access/` の小さな型付き関数（`authenticated` 等）を再利用する。
- 副作用（Next.js revalidate 等）は `afterChange`/`afterDelete` フックで行い、無限ループ防止に `req.context` を使う。
- 設計やAPIで迷ったら推測せず `.claude/skills/payload/` のスキルを参照する。

### フロントエンド（Next.js / React）
- App Router。デフォルトは **React Server Component**。`'use client'` はフック/イベント/ブラウザAPIが必要なときだけ先頭に付ける。
- コンポーネントは **named export**、`React.FC<{...}>` で props を型付け（既存コードに準拠）。
- クラス結合は `@/utilities/ui` の `cn()`、スタイルは Tailwind + shadcn/ui。UIプリミティブは `src/components/ui/`。
