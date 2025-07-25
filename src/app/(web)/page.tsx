import About from "@/components/home/about";
import Hero from "@/components/home/banner";
import Contact from "@/components/home/contact";
import FeaturedRooms from "@/components/home/feature-rooms";

export default function Home() {
  return (
    <div className="min-h-dvh">
      <Hero />
      <FeaturedRooms />
      <About />
      <Contact />
    </div>
  );
}
