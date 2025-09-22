import { SignIn } from "@clerk/nextjs";
import { useRouter } from "next/router";

export default function SignInPage() {
  const router = useRouter();
  const dest =
    typeof router.query.dest === "string" ? router.query.dest : undefined;
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-[420px]">
        <SignIn
          routing="hash"
          signUpUrl={
            dest ? `/sign-up?dest=${encodeURIComponent(dest)}` : "/sign-up"
          }
          redirectUrl={dest || "/auth-redirect"}
        />
      </div>
    </div>
  );
}
