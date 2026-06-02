// Liveness/readiness probe endpoint for Kubernetes (GET /health).
// Intentionally DB-free: a transient Postgres blip must not fail liveness and
// trigger pod restarts. DB readiness is gated by the migrate Job running before
// the app Deployment (see deploy/k8s). Lives outside the Payload `(payload)/api`
// catch-all so it cannot collide with `/api/[...slug]`.
export const dynamic = 'force-dynamic'
export const revalidate = 0

export function GET() {
  return Response.json({ status: 'ok' })
}
