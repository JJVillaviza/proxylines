import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: HomeComponent,
});

function HomeComponent() {
  throw new Error("test error");
  return (
    <div>
      <h3>Welcome Home!</h3>
    </div>
  );
}
