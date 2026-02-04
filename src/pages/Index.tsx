import { PublicLayout } from "@/components/layout/PublicLayout";
import { HeroSection } from "@/components/home/HeroSection";
import { AboutPreview } from "@/components/home/AboutPreview";
import { EventsPreview } from "@/components/home/EventsPreview";
import { MediaSection } from "@/components/home/MediaSection";
import { LeaderboardSection } from "@/components/home/LeaderboardSection";
import { ScrollToTop } from "@/components/ScrollToTop";

const Index = () => {
  return (
    <PublicLayout>
      <HeroSection />
      <AboutPreview />
      <EventsPreview />
      <LeaderboardSection />
      <MediaSection />
      <ScrollToTop />
    </PublicLayout>
  );
};

export default Index;
