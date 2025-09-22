import { SignUp } from "@clerk/nextjs";
import { useRouter } from "next/router";

export default function SignUpPage() {
  const router = useRouter();
  const dest =
    typeof router.query.dest === "string" ? router.query.dest : undefined;
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-[420px]">
        <SignUp
          routing="hash"
          signInUrl={
            dest ? `/sign-in?dest=${encodeURIComponent(dest)}` : "/sign-in"
          }
          redirectUrl={dest || "/auth-redirect"}
        />
      </div>
    </div>
  );
}
