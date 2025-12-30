import { motion } from "framer-motion";
import { ArrowRight, Users, Trophy, Calendar, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import heroBg from "@/assets/hero-bg.jpg";

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
      <div className="absolute inset-0">
        <img
          src={heroBg}
          alt="Hero background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 gradient-hero opacity-90" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/50 to-transparent" />
      </div>

      {/* Decorative Elements - Hidden on mobile for performance */}
      <div className="absolute top-1/4 right-10 w-32 md:w-64 h-32 md:h-64 bg-accent/20 rounded-full blur-3xl animate-pulse-slow hidden sm:block" />
      <div className="absolute bottom-1/4 left-10 w-24 md:w-48 h-24 md:h-48 bg-teal/20 rounded-full blur-3xl animate-pulse-slow hidden sm:block" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-24 sm:pt-32 pb-16 sm:pb-20">
        <div className="max-w-4xl">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-accent/20 text-accent border border-accent/30 text-xs sm:text-sm font-medium">
              <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-current" />
              Al Hasanath Students Association
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-6 sm:mt-8 text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-primary-foreground leading-tight"
          >
            Empowering Students,{" "}
            <span className="text-accent">Building Leaders</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-4 sm:mt-6 text-base sm:text-lg md:text-xl text-primary-foreground/80 max-w-2xl leading-relaxed"
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
              <Button variant="hero" size="lg" className="w-full sm:w-auto h-12 sm:h-14 text-base sm:text-lg">
                Discover Ahsas
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </Button>
            </Link>
            <Link to="/login" className="w-full sm:w-auto">
              <Button variant="hero-outline" size="lg" className="w-full sm:w-auto h-12 sm:h-14 text-base sm:text-lg">
                Member Portal
              </Button>
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-12 sm:mt-16 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                className="glass-dark rounded-xl sm:rounded-2xl p-3 sm:p-5 text-center"
              >
                <stat.icon className="w-6 h-6 sm:w-8 sm:h-8 text-accent mx-auto mb-2 sm:mb-3" />
                <div className="text-xl sm:text-2xl md:text-3xl font-bold text-primary-foreground">
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm text-primary-foreground/70 mt-0.5 sm:mt-1">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator - Hidden on mobile */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.6 }}
        className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 hidden sm:block"
      >
        <div className="w-6 h-10 rounded-full border-2 border-primary-foreground/30 flex items-start justify-center p-2">
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1.5 h-1.5 rounded-full bg-accent"
          />
        </div>
      </motion.div>
    </section>
  );
}
