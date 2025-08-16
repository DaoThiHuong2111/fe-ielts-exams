// Force dynamic rendering due to parent layout using cookies
export const dynamic = 'force-dynamic'

import RegisterPage from "@/components/register";

export default function Register() {
  return (
    <div className="min-h-dvh">
      <RegisterPage />
    </div>
  );
}