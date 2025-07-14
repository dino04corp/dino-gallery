import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LoaderCircle } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { useField, useForm } from "@tanstack/react-form";
import { useAuthStore } from "@/store";
import { login } from "@/api/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function LoginPage() {
  const navigate = useNavigate();
  const { setAccessToken } = useAuthStore();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: login,
    onSuccess: (response) => {
      console.log(response);
      const token = response?.data?.accessToken;
      if (!token) return setErrorMessage("Invalid token");
      setAccessToken(token);

      navigate("/dashboard");
    },
    onError: (error: any) => {
      console.error("Login error", error);
      const msg = error?.response?.data?.error || error?.response?.data?.message || error?.message || "Something went wrong";
      setErrorMessage(msg);
    },
  });

  const form = useForm({
    defaultValues: {
      username: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      console.log(value);

      setErrorMessage(null);
      mutation.mutate(value);
    },
  });

  const loading = mutation.isPending || form.state.isSubmitting;

  return (
    <section className="flex justify-center items-center h-screen">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your username below to login to your account. <br />
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            className="flex flex-col gap-6"
          >
            <form.Field
              name="username"
              validators={{
                onChangeAsyncDebounceMs: 500,
                onChangeAsync: ({ value }) => {
                  if (value.length < 3) {
                    return "Username must be least 3 characters long";
                  }
                },
              }}
              children={(field) => (
                <div className="grid gap-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    type="text"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    autoComplete="username"
                    disabled={loading}
                    required
                  />
                  {field.state.meta.errors && <div className="text-red-500 text-sm">{field.state.meta.errors}</div>}
                </div>
              )}
            />
            <form.Field
              name="password"
              validators={{
                onChangeAsyncDebounceMs: 500,
                onChangeAsync: ({ value }) => {
                  if (value.length < 6) {
                    return "Password must be least 6 characters long";
                  }
                  // if (!/[A-Z]/.test(value)) {
                  //   return "Password must contain at least one uppercase letter";
                  // }
                  // if (!/[a-z]/.test(value)) {
                  //   return "Password must contain at least one lowercase letter";
                  // }
                  // if (!/[0-9]/.test(value)) {
                  //   return "Password must contain at least one number";
                  // }
                },
              }}
              children={(field) => (
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="text"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    autoComplete="password"
                    disabled={loading}
                    required
                  />
                  {field.state.meta.errors && <div className="text-red-500 text-sm">{field.state.meta.errors}</div>}
                </div>
              )}
            />
            {/* <div className="grid gap-2">
              <Label htmlFor={usernameField.name}>Username</Label>
              <Input
                id={usernameField.name}
                type="text"
                value={usernameField.state.value}
                onChange={(e) => usernameField.handleChange(e.target.value)}
                autoComplete="username"
                disabled={loading}
                required
              />
            </div> */}

            {/* <div className="grid gap-2">
              <Label htmlFor={passwordField.name}>Password</Label>
              <Input
                id={passwordField.name}
                type="password"
                value={passwordField.state.value}
                onChange={(e) => passwordField.handleChange(e.target.value)}
                autoComplete="current-password"
                disabled={loading}
                required
              />
            </div> */}

            {errorMessage && <div className="text-red-500 text-sm -mt-2">{errorMessage}</div>}

            <div className="flex items-center">
              <a href="#" className="ml-auto inline-block text-sm underline-offset-4 hover:underline">
                Forgot your password?
              </a>
            </div>

            <Button type="submit" className="w-full" onClick={form.handleSubmit} disabled={loading}>
              {loading ? (
                <>
                  <LoaderCircle className="animate-spin mr-2 w-4 h-4" />
                  Logging in...
                </>
              ) : (
                "Login"
              )}
            </Button>

            <Button variant="outline" className="w-full" disabled={loading}>
              Login with Google
            </Button>

            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link to={"/auth/register"} className="underline underline-offset-4">
                Sign up
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </section>
  );
}
