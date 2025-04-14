import {
  Link,
  createFileRoute,
  redirect,
  useNavigate,
  useRouter,
} from "@tanstack/react-router";
import { z } from "zod";
import { fallback, zodSearchValidator } from "@tanstack/router-zod-adapter";
import { registerValidation } from "@/types/validation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAppForm } from "@/components/forms";
import { postRegister, userQueryOptions } from "@/lib/api";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

const registerSearchSchema = z.object({
  redirect: fallback(z.string(), "/").default("/"),
});

export const Route = createFileRoute("/register")({
  component: () => <RegisterComponent />,
  validateSearch: zodSearchValidator(registerSearchSchema),
  beforeLoad: async ({ context, search }) => {
    const user = await context.queryClient.ensureQueryData(userQueryOptions());
    if (user) {
      throw redirect({ to: search.redirect });
    }
  },
});

function RegisterComponent() {
  const search = Route.useSearch();
  const navigate = useNavigate();
  const router = useRouter();
  const queryClient = useQueryClient();

  const form = useAppForm({
    defaultValues: {
      name: "",
      email: "",
      username: "",
      password: "",
    },
    validators: {
      onChange: registerValidation,
    },
    onSubmit: async ({ value, formApi: { setErrorMap } }) => {
      const res = await postRegister(
        value.name,
        value.email,
        value.username,
        value.password
      );

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
            <CardTitle className="text-center text-2xl">Register</CardTitle>
            <CardDescription>
              Enter your details below to create an account!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <form.AppField
                name="name"
                children={(field: any) => <field.TextField label="Name" />}
              />
              <form.AppField
                name="email"
                children={(field: any) => <field.TextField label="Email" />}
              />
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
              Already have an account?{" "}
              <Link to="/login" className="underline">
                Login
              </Link>
            </div>
          </CardContent>
        </form>
      </Card>
    </div>
  );
}
