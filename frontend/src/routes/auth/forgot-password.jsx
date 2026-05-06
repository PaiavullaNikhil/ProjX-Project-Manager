import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForgotPasswordMutation } from "@/hooks/use-auth";
import { forgotPasswordSchema } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, CheckCircle, Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { toast } from "sonner";

import { motion } from "framer-motion";

const ForgotPassword = () => {
  const [isSuccess, setIsSuccess] = useState(false);
  const { mutate: forgotPassword, isPending } = useForgotPasswordMutation();

  const form = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (data) => {
    forgotPassword(data, {
      onSuccess: () => {
        setIsSuccess(true);
      },
      onError: (error) => {
        const errorMessage = error?.response?.data?.message || "Something went wrong";
        toast.error(errorMessage);
      },
    });
  };

  return (
    <div className="w-full max-w-sm">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight">Recovery</h1>
        <p className="text-muted-foreground mt-2 font-medium">We'll help you get back into your account</p>
      </div>

      <Card className="border-primary/10 shadow-2xl glass overflow-hidden">
        <CardContent className="pt-8">
          {isSuccess ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-4 text-center"
            >
              <div className="size-16 rounded-full bg-green-500/10 flex items-center justify-center mb-4">
                <CheckCircle className="size-8 text-green-500" />
              </div>
              <h2 className="text-2xl font-bold">Email Sent!</h2>
              <p className="text-muted-foreground mt-2 px-4">
                Check your inbox at <span className="font-bold text-foreground">{form.getValues("email")}</span> for a link to reset your password.
              </p>
              <Button asChild variant="outline" className="mt-8">
                <Link to="/sign-in">Return to Sign In</Link>
              </Button>
            </motion.div>
          ) : (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  name="email"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-bold uppercase tracking-wider opacity-70">Email Address</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          placeholder="name@company.com" 
                          className="h-11 bg-secondary/30 border-primary/5 focus:border-primary/20 transition-all placeholder:text-muted-foreground/50"
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
                    "Send Reset Link"
                  )}
                </Button>

                <div className="flex items-center justify-center">
                  <Link to="/sign-in" className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors group">
                    <ArrowLeft className="size-4 group-hover:-translate-x-1 transition-transform" />
                    Back to Sign In
                  </Link>
                </div>
              </form>
            </Form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ForgotPassword;
