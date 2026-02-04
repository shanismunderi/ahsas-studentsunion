import { motion } from "framer-motion";
import { ArrowRight, Users, Trophy, Calendar, Star, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import hero_bg from "@/assets/hero_bg.png";

const stats = [
  { icon: Users, value: "500+", label: "Active Members" },
  { icon: Trophy, value: "150+", label: "Achievements" },
  { icon: Calendar, value: "50+", label: "Annual Events" },
  { icon: Star, value: "10+", label: "Years Legacy" },
];

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background */}
      {/* Background with parallax/fixed effect */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-fixed"
        style={{ backgroundImage: `url(${hero_bg})` }}
      >
        {/* Dark overlay with grain texture */}
        <div className="absolute inset-0 bg-background/90" />
        <div className="absolute inset-0 gradient-mesh opacity-50" />
      </div>

      {/* Animated gradient orbs */}
      <div className="absolute top-1/4 right-10 w-32 md:w-96 h-32 md:h-96 bg-foreground/5 rounded-full blur-3xl animate-pulse-slow hidden sm:block" />
      <div className="absolute bottom-1/4 left-10 w-24 md:w-64 h-24 md:h-64 bg-foreground/3 rounded-full blur-3xl animate-pulse-slow hidden sm:block" />

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 pattern-dots opacity-30" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-24 sm:pt-32 pb-16 sm:pb-20">
        <div className="max-w-4xl">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-6 sm:mt-8 text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-bold text-foreground leading-[1.1] tracking-tight"
          >
            Empowering Students,{" "}
            <span className="text-muted-foreground">Building Leaders</span>
          </motion.h1>

          {/* Elegant divider line */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-6 sm:mt-8 h-px w-32 bg-gradient-to-r from-foreground/50 to-transparent"
          />

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-4 sm:mt-6 text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed"
          >
            Join a vibrant community of passionate students dedicated to excellence,
            leadership, and making a difference. Ahsas is more than an association —
            it's a family.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-8 sm:mt-10 flex flex-col sm:flex-row gap-3 sm:gap-4"
          >
            <Link to="/about" className="w-full sm:w-auto">
              <Button variant="default" size="lg" className="w-full sm:w-auto h-12 sm:h-14 text-base sm:text-lg group">
                Discover Ahsas
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link to="/login" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full sm:w-auto h-12 sm:h-14 text-base sm:text-lg border-primary/20 hover:border-primary/40 hover:bg-primary/5 transition-all duration-300 rounded-xl">
                Sign In
              </Button>
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-16 sm:mt-24 grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                className="group relative"
              >
                <div className="absolute inset-0 bg-foreground/5 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative p-4 sm:p-6 border border-border/50 rounded-2xl bg-card/50 backdrop-blur-sm hover:border-foreground/20 transition-all duration-300">
                  <stat.icon className="w-5 h-5 sm:w-6 sm:h-6 text-foreground/60 mb-3 sm:mb-4" />
                  <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground tracking-tight">
                    {stat.value}
                  </div>
                  <div className="text-xs sm:text-sm text-muted-foreground mt-1">
                    {stat.label}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.6 }}
        className="absolute bottom-8 sm:bottom-12 left-1/2 -translate-x-1/2 hidden sm:block"
      >
        <div className="flex flex-col items-center gap-2">
          <span className="text-xs text-muted-foreground uppercase tracking-widest">Scroll</span>
          <div className="w-px h-12 bg-gradient-to-b from-foreground/30 to-transparent" />
        </div>
      </motion.div>
    </section>
  );
}
