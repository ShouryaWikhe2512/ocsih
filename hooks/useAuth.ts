import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/router";
import { useEffect } from "react";

export function useAuth(requiredRole?: string) {
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) return;

    if (!isSignedIn) {
      router.replace("/sign-in");
      return;
    }

    if (requiredRole && user) {
      const userRole = user.publicMetadata?.role;
      if (userRole !== requiredRole) {
        router.replace("/auth-redirect");
        return;
      }
    }
  }, [isLoaded, isSignedIn, user, router, requiredRole]);

  return {
    isLoaded,
    isSignedIn,
    user,
    isLoading: !isLoaded,
    shouldRedirect: isLoaded && !isSignedIn,
  };
}
