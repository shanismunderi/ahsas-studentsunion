import { PublicLayout } from "@/components/layout/PublicLayout";
import { HeroSection } from "@/components/home/HeroSection";
import { AboutPreview } from "@/components/home/AboutPreview";
import { EventsPreview } from "@/components/home/EventsPreview";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { NewsletterSection } from "@/components/home/NewsletterSection";
import { CTASection } from "@/components/home/CTASection";
import { ScrollToTop } from "@/components/ScrollToTop";

const Index = () => {
  return (
    <PublicLayout>
      <HeroSection />
      <AboutPreview />
      <EventsPreview />
      <TestimonialsSection />
      <NewsletterSection />
      <CTASection />
      <ScrollToTop />
    </PublicLayout>
  );
};

export default Index;
