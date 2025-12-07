import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function CTASection() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 gradient-hero" />
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-teal/20 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
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
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/20 text-accent border border-accent/30 text-sm font-medium mb-8"
          >
            <Sparkles className="w-4 h-4" />
            Become Part of Our Family
          </motion.div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground">
            Ready to Begin Your{" "}
            <span className="text-accent">Journey</span>?
          </h2>

          <p className="mt-6 text-lg text-primary-foreground/80 max-w-xl mx-auto">
            Join hundreds of students who have found their second home at Ahsas. 
            Connect, grow, and make memories that last a lifetime.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link to="/contact">
              <Button variant="hero" size="xl">
                Join Ahsas Today
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link to="/gallery">
              <Button variant="hero-outline" size="xl">
                Explore Gallery
              </Button>
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="mt-16 flex flex-wrap justify-center gap-8 md:gap-16">
            <div className="text-center">
              <div className="text-3xl font-bold text-accent">500+</div>
              <div className="text-sm text-primary-foreground/70 mt-1">Happy Members</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-accent">50+</div>
              <div className="text-sm text-primary-foreground/70 mt-1">Events Per Year</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-accent">100%</div>
              <div className="text-sm text-primary-foreground/70 mt-1">Community Support</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
