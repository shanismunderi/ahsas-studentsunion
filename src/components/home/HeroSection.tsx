import { motion } from "framer-motion";
import { ArrowRight, Users, Trophy, Calendar, Star, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import heroBg from "@/assets/hero-bg.jpg";

const stats = [
  { icon: Users, value: "400+", label: "Active Students" },
  { icon: Trophy, value: "350+", label: "Achievements" },
  { icon: Calendar, value: "50+", label: "Annual Events" },
  { icon: Star, value: "10+", label: "Years Legacy" },
];

// Floating particles component
const FloatingParticles = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-primary/30 rounded-full"
          initial={{
            x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
            y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800),
          }}
          animate={{
            y: [null, -100, (typeof window !== 'undefined' ? window.innerHeight : 800) + 100],
            opacity: [0, 0.8, 0],
          }}
          transition={{
            duration: Math.random() * 15 + 10,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
};

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background with parallax effect */}
      <motion.div
        className="absolute inset-0"
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      >
        <img
          src={heroBg}
          alt="Hero background"
          className="w-full h-full object-cover"
        />
        {/* Enhanced overlay with gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-background/90 via-background/85 to-background/80" />
        <div className="absolute inset-0 gradient-mesh opacity-40" />
      </motion.div>

      {/* Floating particles */}
      <FloatingParticles />

      {/* Enhanced animated gradient orbs */}
      <motion.div
        className="absolute top-1/4 right-10 w-96 h-96 rounded-full blur-[120px] opacity-30"
        style={{ background: 'radial-gradient(circle, hsl(var(--primary) / 0.4) 0%, transparent 70%)' }}
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 30, 0],
          y: [0, -20, 0],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-1/4 left-10 w-64 h-64 rounded-full blur-[100px] opacity-25"
        style={{ background: 'radial-gradient(circle, hsl(var(--accent) / 0.3) 0%, transparent 70%)' }}
        animate={{
          scale: [1.2, 1, 1.2],
          x: [0, -20, 0],
          y: [0, 30, 0],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-24 sm:pt-32 pb-16 sm:pb-20">
        <div className="max-w-5xl">
          {/* Enhanced Badge with glow */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative inline-block"
          >
            <motion.div
              className="absolute inset-0 bg-primary/20 rounded-full blur-xl"
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="relative inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-primary/10 text-foreground border border-primary/30 text-xs sm:text-sm font-semibold backdrop-blur-sm">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
              </motion.div>
              Al Hasanath Students Association
            </span>
          </motion.div>

          {/* Enhanced Heading with gradient text */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-8 sm:mt-10 text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-bold leading-[1.1] tracking-tight"
          >
            <motion.span
              className="inline-block bg-gradient-to-r from-foreground via-foreground to-foreground/80 bg-clip-text text-transparent"
              animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
              transition={{ duration: 5, repeat: Infinity }}
              style={{ backgroundSize: "200% auto" }}
            >
              Empowering Students,
            </motion.span>
            <br />
            <motion.span
              className="inline-block bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent"
              animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
              transition={{ duration: 5, repeat: Infinity, delay: 0.5 }}
              style={{ backgroundSize: "200% auto" }}
            >
              Building Leaders
            </motion.span>
          </motion.h1>

          {/* Enhanced divider with animation */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-8 sm:mt-10 h-0.5 w-40 bg-gradient-to-r from-primary via-accent to-transparent rounded-full"
          />

          {/* Enhanced Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 sm:mt-8 text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed"
          >
            Join a vibrant community of passionate students dedicated to excellence,
            leadership, and making a difference. <span className="text-foreground font-semibold">Ahsas</span> is more than an association —
            it's a family.
          </motion.p>

          {/* Enhanced CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10 sm:mt-12 flex flex-col sm:flex-row gap-4 sm:gap-5"
          >
            <Link to="/about" className="w-full sm:w-auto">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="relative"
              >
                <motion.div
                  className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-2xl blur opacity-30"
                  animate={{ opacity: [0.3, 0.5, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <Button variant="default" size="lg" className="relative w-full sm:w-auto h-14 sm:h-16 text-base sm:text-lg px-8 sm:px-10 group rounded-xl">
                  Discover Ahsas
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </motion.div>
            </Link>
            <Link to="/login" className="w-full sm:w-auto">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button variant="outline" size="lg" className="w-full sm:w-auto h-14 sm:h-16 text-base sm:text-lg px-8 sm:px-10 rounded-xl border-2">
                  Member Portal
                </Button>
              </motion.div>
            </Link>
          </motion.div>

          {/* Enhanced Stats with premium cards */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-20 sm:mt-28 grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                whileHover={{ y: -5 }}
                className="group relative"
              >
                {/* Glow effect on hover */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                />

                {/* Card */}
                <div className="relative p-5 sm:p-7 border border-border/50 rounded-2xl bg-card/60 backdrop-blur-md hover:border-primary/30 hover:bg-card/80 transition-all duration-300 overflow-hidden">
                  {/* Animated background gradient */}
                  <motion.div
                    className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500"
                    style={{
                      background: 'linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--accent)) 100%)',
                    }}
                  />

                  {/* Icon with animation */}
                  <motion.div
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                  >
                    <stat.icon className="w-6 h-6 sm:w-7 sm:h-7 text-primary mb-4 sm:mb-5" />
                  </motion.div>

                  {/* Value with gradient */}
                  <div className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent tracking-tight mb-2">
                    {stat.value}
                  </div>

                  {/* Label */}
                  <div className="text-xs sm:text-sm text-muted-foreground font-medium">
                    {stat.label}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Enhanced Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="absolute bottom-10 sm:bottom-14 left-1/2 -translate-x-1/2 hidden sm:block"
      >
        <motion.div
          className="flex flex-col items-center gap-3"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <span className="text-xs text-muted-foreground uppercase tracking-[0.2em] font-semibold">Scroll</span>
          <div className="relative w-px h-16">
            <div className="absolute inset-0 bg-gradient-to-b from-primary/50 via-accent/30 to-transparent" />
            <motion.div
              className="absolute top-0 w-px h-8 bg-gradient-to-b from-primary to-accent"
              animate={{ y: [0, 32, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
