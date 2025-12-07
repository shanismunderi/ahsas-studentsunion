import { PublicLayout } from "@/components/layout/PublicLayout";
import { HeroSection } from "@/components/home/HeroSection";
import { AboutPreview } from "@/components/home/AboutPreview";
import { EventsPreview } from "@/components/home/EventsPreview";
import { CTASection } from "@/components/home/CTASection";

const Index = () => {
  return (
    <PublicLayout>
      <HeroSection />
      <AboutPreview />
      <EventsPreview />
      <CTASection />
    </PublicLayout>
  );
};

export default Index;
