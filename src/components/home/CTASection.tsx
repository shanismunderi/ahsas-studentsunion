import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function CTASection() {
  return (
    <section className="py-16 sm:py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 gradient-hero" />
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-48 sm:w-96 h-48 sm:h-96 bg-accent/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-32 sm:w-64 h-32 sm:h-64 bg-teal/20 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-accent/20 text-accent border border-accent/30 text-xs sm:text-sm font-medium mb-6 sm:mb-8"
          >
            <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
            Become Part of Our Family
          </motion.div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-primary-foreground">
            Ready to Begin Your{" "}
            <span className="text-accent">Journey</span>?
          </h2>

          <p className="mt-4 sm:mt-6 text-base sm:text-lg text-primary-foreground/80 max-w-xl mx-auto px-4">
            Join hundreds of students who have found their second home at Ahsas. 
            Connect, grow, and make memories that last a lifetime.
          </p>

          <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 px-4 sm:px-0">
            <Link to="/contact" className="w-full sm:w-auto">
              <Button variant="hero" size="lg" className="w-full sm:w-auto h-12 sm:h-14">
                Join Ahsas Today
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </Button>
            </Link>
            <Link to="/gallery" className="w-full sm:w-auto">
              <Button variant="hero-outline" size="lg" className="w-full sm:w-auto h-12 sm:h-14">
                Explore Gallery
              </Button>
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="mt-12 sm:mt-16 flex flex-wrap justify-center gap-6 sm:gap-8 md:gap-16">
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-accent">500+</div>
              <div className="text-xs sm:text-sm text-primary-foreground/70 mt-1">Happy Members</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-accent">50+</div>
              <div className="text-xs sm:text-sm text-primary-foreground/70 mt-1">Events Per Year</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-accent">100%</div>
              <div className="text-xs sm:text-sm text-primary-foreground/70 mt-1">Community Support</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
