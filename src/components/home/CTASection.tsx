import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function CTASection() {
  return (
    <section className="py-24 sm:py-32 relative overflow-hidden bg-foreground">
      {/* Subtle patterns */}
      <div className="absolute inset-0 pattern-dots opacity-5" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-background/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-background/3 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center"
        >
          {/* Badge */}
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-background/10 text-background border border-background/20 text-sm font-medium mb-8"
          >
            <Sparkles className="w-4 h-4" />
            Become Part of Our Family
          </motion.div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-background tracking-tight">
            Ready to Begin Your{" "}
            <span className="text-background/60">Journey</span>?
          </h2>

          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mt-8 h-px w-32 bg-background/30 mx-auto"
          />

          <p className="mt-6 text-lg sm:text-xl text-background/70 max-w-xl mx-auto">
            Join hundreds of students who have found their second home at Ahsas. 
            Connect, grow, and make memories that last a lifetime.
          </p>

          <div className="mt-10 sm:mt-12 flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/contact" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto h-14 bg-background text-foreground hover:bg-background/90 group">
                Join Ahsas Today
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link to="/gallery" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full sm:w-auto h-14 border-background/30 text-background hover:bg-background/10">
                Explore Gallery
              </Button>
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="mt-16 sm:mt-20 grid grid-cols-3 gap-8 sm:gap-16 max-w-2xl mx-auto">
            {[
              { value: "500+", label: "Happy Members" },
              { value: "50+", label: "Events Per Year" },
              { value: "100%", label: "Community Support" },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl sm:text-4xl font-bold text-background">{stat.value}</div>
                <div className="text-sm text-background/50 mt-2">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
