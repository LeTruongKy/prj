"use client";

import { useAuthStore } from "@/stores/authStore";
import { NotPermitted } from "./not-permitted";
import { useAppRouter } from "@/hooks/useAppRouter";
import { useEffect } from "react";
import { Loading } from "../shared/loading";

// Allows all authenticated users â€” role-based page access handled at component level
export const RoleBaseRoute = ({ children }: { children: React.ReactNode }) => {
  const { authUser } = useAuthStore();

  // Deny access for plain STUDENT role (non-admin)
  if (authUser.role === "STUDENT") {
    return <NotPermitted />;
  }

  return <>{children}</>;
};

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuthStore();
  const { goLogin } = useAppRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      goLogin();
    }
  }, [isLoading]);

  return (
    <>
      {isLoading === true ? (
        <>
          <Loading />
        </>
      ) : (
        <>
          {isAuthenticated === true ? (
            <>
              <RoleBaseRoute>{children}</RoleBaseRoute>
            </>
          ) : null}
        </>
      )}
    </>
  );
};
