"use client";

import * as React from "react";
import { QueryClient } from "@tanstack/react-query";
import {
  PersistQueryClientProvider,
} from "@tanstack/react-query-persist-client";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import { Toaster } from "@/components/ui/sonner";
import { ApiClientError } from "@/lib/api/errors";

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30 * 1000,
        // Keep unused query data around for a full day instead of the
        // 5-minute default, so cached executives/news/etc. are still
        // there if the user navigates away and back, or the connection
        // drops for a while.
        gcTime: 24 * 60 * 60 * 1000,
        retry: (failureCount, error) => {
          if (error instanceof ApiClientError && error.status >= 400 && error.status < 500) {
            return false;
          }
          return failureCount < 2;
        },
        refetchOnWindowFocus: false,
      },
      mutations: {
        retry: false,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined;

function getQueryClient() {
  if (typeof window === "undefined") return makeQueryClient();
  if (!browserQueryClient) browserQueryClient = makeQueryClient();
  return browserQueryClient;
}

// A no-op storage so this can be constructed the same way on the server
// (where sessionStorage doesn't exist) and the client, without any
// window-check branching that could cause the provider tree to differ
// between the SSR pass and hydration.
const noopStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
};

// sessionStorage (not localStorage) is the deliberate choice here: it
// persists across page reloads and lost/flaky connections within the same
// tab, but is wiped automatically the moment the tab or browser closes —
// which is exactly the "forget it when the session ends" behavior asked
// for, with no manual cleanup code needed.
const persister = createSyncStoragePersister({
  storage: typeof window !== "undefined" ? window.sessionStorage : noopStorage,
  key: "nacos-query-cache",
});

export function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient();

  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        persister,
        // Safety net only — in practice sessionStorage clearing on tab
        // close is what actually bounds this, not this max age.
        maxAge: 24 * 60 * 60 * 1000,
        dehydrateOptions: {
          // Only ever persist queries that succeeded at least once, so we
          // never write an error/empty state to storage.
          shouldDehydrateQuery: (query) => query.state.status === "success",
        },
      }}
    >
      {children}
      <Toaster />
    </PersistQueryClientProvider>
  );
}
