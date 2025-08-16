import ContactSection from "@/components/contact/contact-session";
import Hero from "@/components/home/banner";

// Force dynamic rendering due to parent layout using cookies
export const dynamic = 'force-dynamic'

export default function ContactPage() {
  return (
    <div className="min-h-dvh">
      <Hero />
      <ContactSection />
    </div>
  );
}