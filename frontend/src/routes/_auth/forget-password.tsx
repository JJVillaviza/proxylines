import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/forget-password')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_auth/forget-password"!</div>
}
