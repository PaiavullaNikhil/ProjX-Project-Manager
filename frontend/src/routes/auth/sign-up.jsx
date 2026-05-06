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
import { useSignUpMutation } from "@/hooks/use-auth";
import { signUpSchema } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

const SignUp = () => {
  const navigate = useNavigate();
  const form = useForm({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
      confirmPassword: "",
    },
  });

  const { mutate, isPending } = useSignUpMutation();

  const handleOnSubmit = (values) => {
    mutate(values, {
      onSuccess: () => {
        toast.success("Verification Required", {
          description: "Check your email for the verification link.",
        });
        form.reset();
        navigate("/sign-in");
      },
      onError: (error) => {
        const errorMessage = error.response?.data?.message || "An error occurred";
        toast.error(errorMessage);
      },
    });
  };

  return (
    <div className="w-full max-w-sm">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight">Create Account</h1>
        <p className="text-muted-foreground mt-2 font-medium">Join ProjX and start managing your team</p>
      </div>

      <Card className="border-primary/10 shadow-2xl glass overflow-hidden">
        <CardContent className="pt-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleOnSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold uppercase tracking-wider opacity-70">Full Name</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="John Doe" 
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-bold uppercase tracking-wider opacity-70">Password</FormLabel>
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
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-bold uppercase tracking-wider opacity-70">Confirm</FormLabel>
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
              </div>
              <Button type="submit" className="w-full h-11 text-base font-semibold shadow-lg shadow-primary/25 transition-all hover:scale-[1.02] active:scale-[0.98] mt-2" disabled={isPending}>
                {isPending ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col items-center justify-center pb-8 pt-0">
          <div className="w-full h-px bg-gradient-to-r from-transparent via-primary/10 to-transparent mb-6" />
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/sign-in" className="font-bold text-foreground hover:text-primary transition-colors">
              Sign In instead
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SignUp;
