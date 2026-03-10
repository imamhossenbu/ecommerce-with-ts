import JoinCommunity from "@/components/JoinCommunity";
import Bestsellers from "./_components/BestSeller";
import CategorySection from "./_components/CategorySection";
import Hero from "./_components/Hero";
import NewArrivals from "./_components/NewArrivals";
import Philosophy from "./_components/Philosophy";
import Testimonials from "./_components/Testimonials";


export default function Home() {
  return (
    <div>
    <Hero/>
    <Bestsellers/>
    <CategorySection/>
    <NewArrivals/>
    <Philosophy/>
    <Testimonials/>
    <JoinCommunity/>
    </div>
  );
}
