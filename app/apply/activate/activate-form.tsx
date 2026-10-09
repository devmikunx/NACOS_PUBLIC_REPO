"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { CheckCircle2Icon } from "lucide-react";
import { activateFinanceDirector } from "@/lib/api/onboarding";
import { ApiClientError } from "@/lib/api/errors";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/shared/form-field";


const schema = z
  .object({
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((v) => v.newPassword === v.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });
type Values = z.infer<typeof schema>;

function ActivateForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [done, setDone] = React.useState(false);

  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { newPassword: "", confirmPassword: "" },
  });

  const activate = useMutation({
    mutationFn: (values: Values) => activateFinanceDirector(token as string, values.newPassword),
  });

  async function onSubmit(values: Values) {
    try {
      await activate.mutateAsync(values);
      setDone(true);
    } catch (error) {
      form.setError("root", {
        message: error instanceof ApiClientError ? error.message : "Couldn't activate your account.",
      });
    }
  }

  if (!token) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-3 py-10 text-center">
          <p className="text-sm font-medium">Missing activation link</p>
          <p className="max-w-xs text-sm text-muted-foreground">
            Use the activation link from your approval email.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (done) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-3 py-10 text-center">
          <CheckCircle2Icon className="size-8 text-primary" />
          <p className="text-sm font-medium">Account activated</p>
          <p className="max-w-xs text-sm text-muted-foreground">
            You can now sign in to the admin dashboard with your new password.
          </p>
          <a href="/admin/login" className="mt-2 text-sm text-primary hover:underline">
            Sign in
          </a>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Activate your account</CardTitle>
        <CardDescription>Choose a password to finish setting up your Finance Director account.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <FormField label="New password" htmlFor="newPassword" error={form.formState.errors.newPassword?.message}>
            <Input id="newPassword" type="password" {...form.register("newPassword")} />
          </FormField>
          <FormField
            label="Confirm password"
            htmlFor="confirmPassword"
            error={form.formState.errors.confirmPassword?.message}
          >
            <Input id="confirmPassword" type="password" {...form.register("confirmPassword")} />
          </FormField>
          {form.formState.errors.root && (
            <p className="text-sm font-medium text-destructive">{form.formState.errors.root.message}</p>
          )}
          <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Activating…" : "Activate account"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

export function ActivatePageClient() {
  return (
    <React.Suspense>
      <ActivateForm />
    </React.Suspense>
  );
}
