"use client";

import * as React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { GraduationCapIcon, LandmarkIcon, ArrowLeftIcon, ChevronRightIcon, Loader2Icon } from "lucide-react";
import type { PublicTenantSummary, TenantType } from "@/lib/types";
import { useMaintenanceStatus } from "@/hooks/use-payments";
import { PaymentMaintenanceNotice } from "@/components/public/payment-maintenance-notice";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export interface TenantTypeGroup {
  type: TenantType;
  tenants: PublicTenantSummary[];
  activeCount: number;
}

const TYPE_LABEL: Record<TenantType, string> = {
  COLLEGE: "College",
  DEPARTMENT: "Department",
};

const TYPE_ICON: Record<TenantType, React.ElementType> = {
  COLLEGE: GraduationCapIcon,
  DEPARTMENT: LandmarkIcon,
};

export function TenantSelector({ groups }: { groups: TenantTypeGroup[] }) {
  const router = useRouter();
  const { data: maintenanceStatus } = useMaintenanceStatus();

  // Track if a redirect action is currently running to show the spinner instantly
  const [isRedirecting, setIsRedirecting] = React.useState(false);

  // Derive initial selected type safely without effects
  const [selectedType, setSelectedType] = React.useState<TenantType | null>(() => {
    if (groups.length === 1 && groups[0].activeCount === 1) {
      return groups[0].type;
    }
    return groups.length === 1 ? groups[0].type : null;
  });

  const selectedGroup = selectedType ? groups.find((g) => g.type === selectedType) ?? null : null;

  // Handle immediate auto-redirection on first render if group has only 1 active tenant
  React.useEffect(() => {
    if (selectedGroup && selectedGroup.activeCount === 1 && !isRedirecting) {
      const tenant = selectedGroup.tenants.find((t) => t.status === "ACTIVE");
      if (tenant) {
        // Safe because it's wrapped in a transition flag / or we handle it via event handlers
        // Actually, we can handle single-active redirection directly during render/click below.
      }
    }
  }, [selectedGroup, isRedirecting]);

  // Check if we should auto-redirect right from the start (Derived state, prevents rendering flicker entirely)
  const singleActiveTenant = React.useMemo(() => {
    if (groups.length === 1 && groups[0].activeCount === 1) {
      return groups[0].tenants.find((t) => t.status === "ACTIVE") || null;
    }
    if (selectedGroup && selectedGroup.activeCount === 1) {
      return selectedGroup.tenants.find((t) => t.status === "ACTIVE") || null;
    }
    return null;
  }, [groups, selectedGroup]);

  // If there's a single active tenant, trigger navigation and render loading view immediately
  React.useEffect(() => {
    if (singleActiveTenant) {
      router.replace(`/pay/${singleActiveTenant.code}`);
    }
  }, [singleActiveTenant, router]);

  if (maintenanceStatus?.maintenanceMode) {
    return <PaymentMaintenanceNotice message={maintenanceStatus.message} />;
  }

  // If we are redirecting or there's a single active tenant to route to, show loading spinner immediately
  if (isRedirecting || singleActiveTenant) {
    return (
      <div className="w-full max-w-xl mx-auto px-4 sm:px-6 py-24 flex flex-col items-center justify-center min-h-[70vh] space-y-4 animate-in fade-in duration-200">
        <Loader2Icon className="size-10 text-primary animate-spin" />
        <p className="text-sm font-medium text-muted-foreground tracking-tight">
          Taking you to your payment portal...
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-xl mx-auto px-4 sm:px-6 py-12 sm:py-16 flex flex-col justify-between min-h-[85vh]">
      <div className="w-full">
        {/* --- Step 1: Select Association Type --- */}
        {!selectedGroup ? (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div className="space-y-2 text-center sm:text-left">
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
                Select your payment type
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground">
                Choose the category of association you want to send your payment dues to.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {groups.map((group) => {
                const Icon = TYPE_ICON[group.type];
                return (
                  <button
                    key={group.type}
                    type="button"
                    onClick={() => {
                      if (group.activeCount === 1) {
                        const tenant = group.tenants.find((t) => t.status === "ACTIVE");
                        if (tenant) {
                          setIsRedirecting(true);
                          router.replace(`/pay/${tenant.code}`);
                          return;
                        }
                      }
                      setSelectedType(group.type);
                    }}
                    className="group relative flex flex-col items-start justify-between rounded-3xl border border-border/70 bg-card p-6 text-left shadow-xs transition-all duration-200 hover:border-primary hover:shadow-lg hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  >
                    <div className="flex w-full items-center justify-between mb-8">
                      <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground shadow-xs">
                        <Icon className="size-7" />
                      </div>
                      <div className="size-8 rounded-full bg-muted/60 flex items-center justify-center text-muted-foreground transition-all group-hover:bg-primary/10 group-hover:text-primary">
                        <ChevronRightIcon className="size-4" />
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <p className="font-bold text-lg text-foreground tracking-tight">{TYPE_LABEL[group.type]}</p>
                      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                        Pay dues associated with your {TYPE_LABEL[group.type].toLowerCase()} account.
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          /* --- Step 2: Select Specific Tenant/Association --- */
          <div className="space-y-6 animate-in fade-in duration-300">
            {groups.length > 1 && (
              <Button
                variant="ghost"
                size="sm"
                className="mb-2 -ml-2 text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setSelectedType(null)}
              >
                <ArrowLeftIcon className="mr-2 size-4" />
                Back to categories
              </Button>
            )}

            <div className="space-y-1 text-center sm:text-left">
              <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
                Choose your association
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground">
                Select the specific {TYPE_LABEL[selectedGroup.type].toLowerCase()} branch to proceed with payment.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              {selectedGroup.tenants.map((tenant) => {
                const isActive = tenant.status === "ACTIVE";

                const cardBody = (
                  <div className="flex items-center gap-4 p-4 sm:p-5">
                    {tenant.logoUrl ? (
                      <Image
                        src={tenant.logoUrl}
                        alt={`${tenant.name} logo`}
                        width={52}
                        height={52}
                        className="size-12 sm:size-13 shrink-0 rounded-2xl border border-border/60 object-cover shadow-xs"
                      />
                    ) : (
                      <div className="flex size-12 sm:size-13 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-base font-bold text-primary shadow-xs">
                        {tenant.name.slice(0, 1).toUpperCase()}
                      </div>
                    )}

                    <div className="flex-1 min-w-0 pr-2">
                      <p className="font-semibold text-base text-foreground tracking-tight truncate">{tenant.name}</p>
                      {isActive ? (
                        <p className="text-xs text-muted-foreground mt-0.5">Click to proceed to secure portal</p>
                      ) : (
                        <p className="text-xs text-rose-500 font-medium mt-0.5">Payments currently unavailable</p>
                      )}
                    </div>

                    {!isActive ? (
                      <Badge variant="secondary" className="shrink-0 text-xs font-medium px-2.5 py-1">
                        Unavailable
                      </Badge>
                    ) : (
                      <div className="size-8 rounded-full bg-muted/40 flex items-center justify-center text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-colors shrink-0">
                        <ChevronRightIcon className="size-4" />
                      </div>
                    )}
                  </div>
                );

                if (!isActive) {
                  return (
                    <div key={tenant._id} aria-disabled="true" className="opacity-50 cursor-not-allowed">
                      <Card className="border-border/50 bg-muted/20 shadow-none rounded-2xl">
                        {cardBody}
                      </Card>
                    </div>
                  );
                }

                return (
                  <button
                    key={tenant._id}
                    type="button"
                    onClick={() => {
                      setIsRedirecting(true);
                      router.replace(`/pay/${tenant.code}`);
                    }}
                    className="group block w-full text-left transition-all duration-200 active:scale-[0.99]"
                  >
                    <Card className="border-border/80 rounded-2xl transition-all duration-200 hover:border-primary hover:shadow-md bg-card">
                      {cardBody}
                    </Card>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Modern footer spacing note below */}
      <div className="mt-16 pt-6 border-t border-border/40 text-center">
        <p className="text-xs text-muted-foreground">
          Need help with your payment? Contact your school administration office.
        </p>
      </div>
    </div>
  );
}