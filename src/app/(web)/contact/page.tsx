import ContactSection from "@/components/contact/contact-session";
import Hero from "@/components/home/banner";

export default function Home() {
  return (
    <div className="min-h-dvh">
      <Hero />
      <ContactSection />
    </div>
  );
}