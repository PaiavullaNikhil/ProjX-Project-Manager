import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useLoginMutation } from "@/hooks/use-auth";
import { signInSchema } from "@/lib/schema";
import { useAuth } from "@/provider/auth-context";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const SignIn = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const form = useForm({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { mutate, isPending } = useLoginMutation();

  const handleOnSubmit = (values) => {
    mutate(values, {
      onSuccess: (data) => {
        login(data);
        toast.success("Login successful");
        navigate("/dashboard");
      },
      onError: (error) => {
        const errorMessage =
          error.response?.data?.message || "An error occurred";
        toast.error(errorMessage);
      },
    });
  };

  return (
    <div className="w-full max-w-sm">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight">Welcome Back</h1>
        <p className="text-muted-foreground mt-2 font-medium">Enter your credentials to access your dashboard</p>
      </div>

      <Card className="border-primary/10 shadow-2xl glass overflow-hidden">
        <CardContent className="pt-8">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleOnSubmit)}
              className="space-y-5"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold uppercase tracking-wider opacity-70">Email Address</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="name@company.com"
                        className="h-11 bg-secondary/30 border-primary/5 focus:border-primary/20 transition-all placeholder:text-muted-foreground/50"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel className="text-xs font-bold uppercase tracking-wider opacity-70">Password</FormLabel>
                      <Link
                        to="/forgot-password"
                        className="text-xs font-medium text-primary hover:underline underline-offset-4"
                      >
                        Forgot password?
                      </Link>
                    </div>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        className="h-11 bg-secondary/30 border-primary/5 focus:border-primary/20 transition-all placeholder:text-muted-foreground/50"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full h-11 text-base font-semibold shadow-lg shadow-primary/25 transition-all hover:scale-[1.02] active:scale-[0.98]" disabled={isPending}>
                {isPending ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  "Sign In to ProjX"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col items-center justify-center pb-8 pt-0">
          <div className="w-full h-px bg-gradient-to-r from-transparent via-primary/10 to-transparent mb-6" />
          <p className="text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link to="/sign-up" className="font-bold text-foreground hover:text-primary transition-colors">
              Create one for free
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SignIn;
