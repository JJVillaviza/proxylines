import { AuthFooter } from "@/components/AuthFooter";
import { cn } from "@/lib/utils";
import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6">
      <div className="w-full max-w-sm md:max-w-3xl">
        <div className={cn("flex flex-col gap-6")}>
          <Outlet />
          <AuthFooter />
        </div>
      </div>
    </div>
  );
}
