// Force dynamic rendering due to parent layout using cookies
export const dynamic = 'force-dynamic'

import ForgotPasswordForm from "@/components/forgot-password";

export default function ForgotPassword() {
  return (
    <div className="min-h-dvh">
      <ForgotPasswordForm />
    </div>
  );
}