// pages/auth-redirect.tsx
import { useEffect } from "react";
import { useRouter } from "next/router";
import { useUser } from "@clerk/nextjs";

export default function AuthRedirect() {
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) return;
    if (!isSignedIn) {
      router.replace("/sign-in");
      return;
    }

    // If a 'dest' query param exists, go there; otherwise go back to landing for explicit role choice
    const dest =
      typeof router.query.dest === "string" ? router.query.dest : undefined;
    if (dest) {
      router.replace(dest);
      return;
    }

    // No explicit destination: go to landing to choose a role
    router.replace("/");
  }, [isLoaded, isSignedIn, user, router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      Redirecting…
    </div>
  );
}
