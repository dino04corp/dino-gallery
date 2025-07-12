import { useState } from "react";
import { Link, useNavigate } from "react-router";
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
      const token = response?.data?.data?.accessToken;
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
          <form onSubmit={form.handleSubmit} className="flex flex-col gap-6">
            <form.Field name="username">
              {(field) => (
                <div className="grid gap-2">
                  <Label htmlFor={field.name}>Username</Label>
                  <Input
                    id={field.name}
                    type="text"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    autoComplete="username"
                    disabled={loading}
                    required
                  />
                </div>
              )}
            </form.Field>

            <form.Field name="password">
              {(field) => (
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor={field.name}>Password</Label>
                    <a href="#" className="ml-auto inline-block text-sm underline-offset-4 hover:underline">
                      Forgot your password?
                    </a>
                  </div>
                  <Input
                    id={field.name}
                    type="password"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    autoComplete="current-password"
                    disabled={loading}
                    required
                  />
                </div>
              )}
            </form.Field>

            {errorMessage && <div className="text-red-500 text-sm -mt-2">{errorMessage}</div>}

            <Button type="submit" className="w-full" disabled={loading}>
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
