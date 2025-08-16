import LoginPage from "@/components/login";

// Force dynamic rendering due to parent layout using cookies
export const dynamic = 'force-dynamic'

export default function LoginPage() {
  return (
    <div className="min-h-dvh">
      <LoginPage />
    </div>
  );
}