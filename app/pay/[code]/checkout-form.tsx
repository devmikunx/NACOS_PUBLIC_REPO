"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { z } from "zod";
import { useForm, useWatch, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertTriangleIcon,
  ArrowLeft,
  ShieldCheck,
  FileCheck,
  Clock,
  HelpCircle,
  UserCheck,
} from "lucide-react";

import { STUDENT_LEVELS, type PublicTenant } from "@/lib/types";
import {
  useInitializePayment,
  useMaintenanceStatus,
} from "@/hooks/use-payments";
import { ApiClientError } from "@/lib/api/errors";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { FormField } from "@/components/shared/form-field";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { PaymentMaintenanceNotice } from "@/components/public/payment-maintenance-notice";
import { FullScreenLoadingOverlay } from "@/components/shared/full-screen-loading-overlay";
import {
  PaymentConfirmationModal,
  type PaymentConfirmationDetails,
} from "./payment-confirmation-modal";

const checkoutSchema = z.object({
  studentName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(10, "Invalid phone number"),
  matricNumber: z.string().min(5, "Matric number is required"),
  level: z.enum(STUDENT_LEVELS),
  studentStatus: z.enum(["new", "returning"]),
});

type CheckoutValues = z.infer<typeof checkoutSchema>;

export function CheckoutForm({ tenant }: { tenant: PublicTenant }) {
  const initializePayment = useInitializePayment();
  const { data: maintenanceStatus } = useMaintenanceStatus();
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [pendingValues, setPendingValues] =
    React.useState<CheckoutValues | null>(null);

  const isMaintenance = maintenanceStatus?.maintenanceMode ?? false;
  const isInactive = tenant.status !== "ACTIVE";
  const feesNotSet = !tenant.feesLocked;

  const form = useForm<CheckoutValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      studentName: "",
      email: "",
      phone: "",
      matricNumber: "",
      level: "100L",
      studentStatus: "new",
    },
  });

  // --- AUTO-DETECT STUDENT STATUS LOGIC ---
  const selectedLevel = useWatch({ control: form.control, name: "level" });

  React.useEffect(() => {
    const isNewStudent =
      selectedLevel === "100L" || selectedLevel === "200L(D.E)";
    form.setValue("studentStatus", isNewStudent ? "new" : "returning");
  }, [selectedLevel, form]);

  const studentStatus = useWatch({
    control: form.control,
    name: "studentStatus",
  });
  const fee =
    studentStatus === "new" ? tenant.newStudentFee : tenant.returningStudentFee;

  function openConfirmation(values: CheckoutValues) {
    setErrorMessage(null);
    setPendingValues(values);
    setConfirmOpen(true);
  }

  async function handleConfirm() {
    if (!pendingValues) return;
    setConfirmOpen(false);
    setErrorMessage(null);
    try {
      const result = await initializePayment.mutateAsync({
        tenantCode: tenant.code,
        ...pendingValues,
      });
      window.location.href = result.authorizationUrl;
    } catch (error) {
      setErrorMessage(
        error instanceof ApiClientError
          ? error.message
          : "Couldn't start payment. Try again.",
      );
    }
  }

  const confirmationDetails: PaymentConfirmationDetails | null = pendingValues
    ? {
        studentName: pendingValues.studentName,
        email: pendingValues.email,
        phone: pendingValues.phone,
        matricNumber: pendingValues.matricNumber,
        level: pendingValues.level,
        studentStatus: pendingValues.studentStatus,
        fee,
      }
    : null;

  const BrandHeader = (
    <div className="flex items-center gap-3 mb-6">
      {tenant.logoUrl ? (
        <div className="relative size-10 overflow-hidden rounded-lg border border-border">
          <Image
            src={tenant.logoUrl}
            alt={`${tenant.name} logo`}
            fill
            sizes="40px"
            className="object-cover"
          />
        </div>
      ) : (
        <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-md font-semibold text-primary">
          {tenant.name.slice(0, 1)}
        </div>
      )}
      <div>
        <p className="text-base font-bold leading-tight">{tenant.name}</p>
        <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">
          Official Payment Portal
        </p>
      </div>
    </div>
  );

  if (feesNotSet || isInactive) {
    return (
      <div className="max-w-md mx-auto pt-12 pb-20 px-4">
        {BrandHeader}
        <Alert
          variant="destructive"
          className="bg-amber-50 border-amber-200 text-amber-900 dark:bg-amber-950/20 dark:border-amber-900"
        >
          <AlertTriangleIcon className="size-4 !text-amber-600" />
          <AlertTitle className="font-semibold">Payment Unavailable</AlertTitle>
          <AlertDescription className="text-amber-800/80 dark:text-amber-400">
            Payment for this association is not available yet. Please check back
            later.
          </AlertDescription>
        </Alert>
        <Button asChild variant="outline" className="w-full mt-6">
          <Link href="/">
            <ArrowLeft className="mr-2 size-4" /> Go Back
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto pt-8 pb-24 px-4">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* LEFT SIDE: Header & Trust Carousel */}
        <div className="lg:col-span-5 space-y-8 lg:sticky lg:top-8">
          <div className="space-y-4">
            {BrandHeader}
            <h1 className="text-2xl lg:text-4xl font-extrabold tracking-tight text-foreground leading-tight">
              Pay Your {tenant.name} <br className="hidden lg:block" /> Dues
              Securely Online
            </h1>
            <p className="text-base lg:text-lg text-muted-foreground leading-relaxed max-w-md">
              Seamless payment experience — quick, safe, and automated.
            </p>
          </div>

          <div className="flex lg:flex-col gap-4 overflow-x-auto pb-4 lg:pb-0 snap-x snap-mandatory no-scrollbar -mx-4 px-4 lg:mx-0 lg:px-0">
            {[
              {
                icon: ShieldCheck,
                title: "Bank-Level Security",
                desc: "Encrypted and secure.",
              },
              {
                icon: FileCheck,
                title: "Instant Receipt",
                desc: "Download immediately.",
              },
              {
                icon: Clock,
                title: "24/7 Availability",
                desc: "Pay anytime, anywhere.",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="snap-center shrink-0 w-[280px] lg:w-full flex gap-4 p-4 lg:p-0 rounded-2xl bg-secondary/30 lg:bg-transparent border border-border lg:border-0"
              >
                <div className="flex-none flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <feature.icon className="size-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm lg:text-base text-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-xs lg:text-sm text-muted-foreground">
                    {feature.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="hidden lg:block">
            <HelpCard tenantName={tenant.name} />
          </div>
        </div>

        {/* RIGHT SIDE: The Form */}
        <div className="lg:col-span-7">
          <div className="space-y-6">
            {isMaintenance && (
              <PaymentMaintenanceNotice
                message={maintenanceStatus?.message ?? null}
              />
            )}

            <Card className="border-border shadow-xl lg:border-2 rounded-2xl overflow-hidden">
              <CardHeader className="bg-muted/30 pb-6">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">Student Details</CardTitle>
                </div>
                <CardDescription>
                  Enter your school records correctly to avoid receipt issues.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-8">
                <form
                  onSubmit={form.handleSubmit(openConfirmation)}
                  className="space-y-6"
                  noValidate
                >
                  <FormField
                    label="Full name"
                    htmlFor="studentName"
                    error={form.formState.errors.studentName?.message}
                  >
                    <Input
                      id="studentName"
                      {...form.register("studentName")}
                      placeholder="John Doe"
                      disabled={isMaintenance}
                      className="h-12 text-base"
                    />
                  </FormField>

                  <div className="grid gap-6 sm:grid-cols-2">
                    <FormField
                      label="Email address"
                      htmlFor="email"
                      error={form.formState.errors.email?.message}
                    >
                      <Input
                        id="email"
                        type="email"
                        {...form.register("email")}
                        placeholder="john@example.com"
                        disabled={isMaintenance}
                        className="h-12 text-base"
                      />
                    </FormField>
                    <FormField
                      label="Phone number"
                      htmlFor="phone"
                      error={form.formState.errors.phone?.message}
                    >
                      <Input
                        id="phone"
                        type="tel"
                        {...form.register("phone")}
                        placeholder="08012345678"
                        disabled={isMaintenance}
                        className="h-12 text-base"
                      />
                    </FormField>
                  </div>

                  <div className="grid gap-6 sm:grid-cols-2">
                    <FormField
                      label="Matric number"
                      htmlFor="matricNumber"
                      error={form.formState.errors.matricNumber?.message}
                    >
                      <Input
                        id="matricNumber"
                        {...form.register("matricNumber")}
                        placeholder="e.g. 20231234"
                        disabled={isMaintenance}
                        className="h-12 text-base"
                      />
                    </FormField>

                    <FormField
                      label="Level"
                      htmlFor="level"
                      error={form.formState.errors.level?.message}
                    >
                      <Controller
                        control={form.control}
                        name="level"
                        render={({ field }) => (
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                            disabled={isMaintenance}
                          >
                            <SelectTrigger
                              id="level"
                              className="h-12 text-base"
                            >
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {STUDENT_LEVELS.map((level) => (
                                <SelectItem key={level} value={level}>
                                  {level}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </FormField>
                  </div>

                  {/* Visual Indicator of Auto-detected Status */}
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-secondary/30 border border-border">
                    <div className="flex-none flex size-8 items-center justify-center rounded-full bg-background text-muted-foreground">
                      <UserCheck className="size-4" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">
                        Category Auto-Detected
                      </p>
                      <p className="text-sm font-semibold capitalize">
                        {studentStatus} Student
                      </p>
                    </div>
                  </div>

                  {errorMessage && (
                    <Alert variant="destructive">
                      <AlertDescription>{errorMessage}</AlertDescription>
                    </Alert>
                  )}

                  <div className="pt-2">
                    <Button
                      type="submit"
                      className="w-full h-14 text-lg font-bold shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"
                      size="lg"
                      disabled={isMaintenance || initializePayment.isPending}
                    >
                      {initializePayment.isPending
                        ? "Processing..."
                        : "Review & Pay Now"}
                    </Button>
                    <p className="mt-4 text-center text-[10px] text-muted-foreground uppercase tracking-widest flex items-center justify-center gap-2">
                      <span>Secured by Paystack</span>
                      <span className="size-1 bg-border rounded-full" />
                      <span>Powered by NACOS</span>
                    </p>
                  </div>
                </form>
              </CardContent>
            </Card>

            <div className="lg:hidden pt-4">
              <HelpCard tenantName={tenant.name} />
            </div>
          </div>
        </div>
      </div>

      <PaymentConfirmationModal
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        details={confirmationDetails}
        isSubmitting={initializePayment.isPending}
        onConfirm={handleConfirm}
      />

      {initializePayment.isPending && (
        <FullScreenLoadingOverlay
          title="Starting your payment…"
          description="Please wait while we take you to the secure payment page."
        />
      )}

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}

function HelpCard({ tenantName }: { tenantName: string }) {
  return (
    <Card className="bg-primary/5 border-primary/10 shadow-none rounded-2xl">
      <CardContent className="pt-6 space-y-4">
        <div className="flex items-center gap-2 text-primary">
          <HelpCircle className="size-5" />
          <h4 className="font-bold">Need Help?</h4>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Ensure your matric number follows the correct format (e.g., 20237171).
        </p>
        <div className="pt-2 text-xs border-t border-primary/10 mt-2">
          <p className="font-bold text-foreground">Technical Support:</p>
          <p className="text-muted-foreground">
            Contact your Financial Secretary or visit the {tenantName} office.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
