import Hero from "@/components/home/banner";
import SupportFormSection from "@/components/home/contact";
import FAQSection from "@/components/home/fqa";
import AboutUsSection from "@/components/introduce/about-session";
import BenefitsSection from "@/components/introduce/benefit-session";

// Force dynamic rendering due to parent layout using cookies
export const dynamic = 'force-dynamic'

export default function IntroducePage() {
  return (
    <div className="min-h-dvh">
      <Hero />
      <AboutUsSection />
      <BenefitsSection />
      <FAQSection />
      <SupportFormSection />
    </div>
  );
}