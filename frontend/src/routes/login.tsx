import { useAppForm } from "@/components/forms";
import { loginValidation } from "@/types/validation";
import {
  Link,
  createFileRoute,
  redirect,
  useNavigate,
  useRouter,
} from "@tanstack/react-router";
import { fallback, zodSearchValidator } from "@tanstack/router-zod-adapter";
import { z } from "zod";
import { postLogin, userQueryOptions } from "@/lib/api";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useQueryClient } from "@tanstack/react-query";

const loginSearchSchema = z.object({
  redirect: fallback(z.string(), "/").default("/"),
});

export const Route = createFileRoute("/login")({
  component: () => <LoginComponent />,
  validateSearch: zodSearchValidator(loginSearchSchema),
  beforeLoad: async ({ context, search }) => {
    const user = await context.queryClient.ensureQueryData(userQueryOptions());
    if (user) {
      throw redirect({ to: search.redirect });
    }
  },
});

function LoginComponent() {
  const search = Route.useSearch();
  const navigate = useNavigate();
  const router = useRouter();
  const queryClient = useQueryClient();

  const form = useAppForm({
    defaultValues: {
      username: "",
      password: "",
    },
    validators: {
      onChange: loginValidation,
    },
    onSubmit: async ({ value }) => {
      const res = await postLogin(value.username, value.password);

      if (res.success) {
        await queryClient.invalidateQueries({ queryKey: ["user"] });
        router.invalidate();
        await navigate({ to: search.redirect });
        return null;
      } else {
        if (!res.isFormError) {
          toast.error("Register failed", { description: res.error });
        } else {
          toast.error("Error", {
            description: res.isFormError ? res.error : null,
          });
        }
      }
    },
  });

  return (
    <div className="w-full">
      <Card className="mx-auto mt-12 max-w-sm border-border/25">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          <CardHeader>
            <CardTitle className="text-center text-2xl">Login</CardTitle>
            <CardDescription>
              Enter your details below to login an account!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <form.AppField
                name="username"
                children={(field: any) => <field.TextField label="Username" />}
              />
              <form.AppField
                name="password"
                children={(field: any) => (
                  <field.TextField type="password" label="Password" />
                )}
              />

              <form.AppForm>
                <form.SubmitButton>Submit</form.SubmitButton>
              </form.AppForm>
            </div>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link to="/register" className="underline">
                Register
              </Link>
            </div>
          </CardContent>
        </form>
      </Card>
    </div>
  );
}
