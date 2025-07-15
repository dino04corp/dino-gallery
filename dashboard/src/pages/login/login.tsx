import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LoaderCircle } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "@tanstack/react-form";
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
      console.log("Token from API:", token);
      if (!token) return setErrorMessage("Invalid token");
      setAccessToken(token);

      navigate("/dashboard");
    },
    onError: (error: any) => {
      console.log("Login error", error);
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
              form.handleSubmit(e); // <-- truyền event vào!
            }}
            className="flex flex-col gap-6"
            aria-busy={loading}
            noValidate
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
                },
              }}
              children={(field) => (
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    autoComplete="current-password"
                    disabled={loading}
                    required
                  />
                  {field.state.meta.errors && <div className="text-red-500 text-sm">{field.state.meta.errors}</div>}
                </div>
              )}
            />

            {errorMessage && <div className="text-red-500 text-sm -mt-2 text-center">{errorMessage}</div>}

            <div className="flex items-center mb-2">
              <a href="#" className="ml-auto text-sm underline-offset-4 hover:underline">
                Forgot your password?
              </a>
            </div>

            <Button type="submit" className="w-full" disabled={loading} aria-busy={loading}>
              {loading ? (
                <>
                  <LoaderCircle className="animate-spin mr-2 w-4 h-4" />
                  Logging in...
                </>
              ) : (
                "Login"
              )}
            </Button>

            <div className="flex items-center my-2">
              <div className="flex-grow border-t border-gray-200" />
              <span className="mx-2 text-xs text-gray-400">or</span>
              <div className="flex-grow border-t border-gray-200" />
            </div>

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
