import Hero from "@/components/home/banner";
import SupportFormSection from "@/components/home/contact";
import FeaturedRooms from "@/components/home/feature-rooms";
import FeatureTabs from "@/components/home/feature-tab";
import StudentFeedback from "@/components/home/feed-back";
import FAQSection from "@/components/home/fqa";
import WhyChooseSection from "@/components/home/why";

export default function Home() {
  return (
    <div className="min-h-dvh">
      <Hero />
      <FeaturedRooms />
      <WhyChooseSection />
      <FeatureTabs />
      <StudentFeedback />
      <FAQSection />
      <SupportFormSection />
    </div>
  );
}
