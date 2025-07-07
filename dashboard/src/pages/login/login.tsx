import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router";
import { useMutation } from "@tanstack/react-query";
import { login } from "@/services/api/AuthService";
import { LoaderCircle } from "lucide-react";
import { useAuthStore } from "@/store";
// import { getActions } from '@/store';

export default function LoginPage() {
  const navigate = useNavigate();
  // const { setAccessToken, setRefreshToken } = getActions();
  const { setAccessToken } = useAuthStore();

  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  // Mutations
  const mutation = useMutation({
    mutationFn: login,
    onSuccess: (response) => {
      // @ts-expect-error: response.data có kiểu unknown, cần ép kiểu
      const { data } = response.data;
      setAccessToken(data.accessToken);
      // setRefreshToken(data.refreshToken);

      navigate("/dashboard");
    },
  });

  const handleLoginSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const username = usernameRef.current?.value;
    const password = passwordRef.current?.value;

    // Process form data
    console.log("Form Data:", { username, password });

    if (!username || !password) {
      return alert("Please enter username and password!");
    }

    mutation.mutate({ username, password });
  };

  return (
    <section className="flex justify-center items-center h-screen">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your username below to login to your account. <br />
            {mutation.isError && (
              <span className="text-red-500 text-sm">
                {(() => {
                  const err = mutation.error as any;
                  return err?.response?.data?.error || err?.message || "Something went wrong";
                })()}
              </span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLoginSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="username">Username</Label>
                <Input id="username" type="username" placeholder="username" ref={usernameRef} required />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <a href="#" className="ml-auto inline-block text-sm underline-offset-4 hover:underline">
                    Forgot your password?
                  </a>
                </div>
                <Input id="password" type="password" ref={passwordRef} required />
              </div>
              <Button type="submit" className="w-full" disabled={mutation.isPending}>
                {mutation.isPending && <LoaderCircle className="animate-spin" />}
                <span>Login</span>
              </Button>
              <Button variant="outline" className="w-full" disabled={mutation.isPending}>
                Login with Google
              </Button>
            </div>
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
