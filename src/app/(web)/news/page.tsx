import Hero from "@/components/home/banner";
import NewsGrid from "@/components/news/all-news";
import FeaturedNewsSlider from "@/components/news/top-news";

// Force dynamic rendering due to parent layout using cookies
export const dynamic = 'force-dynamic'

export default function NewsPage() {
  return (
    <div className="min-h-dvh">
      <Hero />
      <FeaturedNewsSlider />
      <NewsGrid />
    </div>
  );
}