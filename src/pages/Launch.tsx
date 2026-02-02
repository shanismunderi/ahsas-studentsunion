import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Rocket, Users, Trophy, Heart, Star, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const slides = [
  {
    id: 1,
    icon: Sparkles,
    title: "Welcome to",
    highlight: "AHSAS",
    subtitle: "Al Hasanath Students Association",
    description: "Where dreams take flight and leaders are born",
    gradient: "from-primary via-accent to-primary",
  },
  {
    id: 2,
    icon: Users,
    title: "A Community of",
    highlight: "500+",
    subtitle: "Active Members",
    description: "United by passion, driven by purpose",
    gradient: "from-teal-500 via-emerald-500 to-teal-500",
  },
  {
    id: 3,
    icon: Trophy,
    title: "Celebrating",
    highlight: "150+",
    subtitle: "Achievements",
    description: "Excellence in academics, sports & arts",
    gradient: "from-amber-500 via-orange-500 to-amber-500",
  },
  {
    id: 4,
    icon: Heart,
    title: "Building",
    highlight: "Leaders",
    subtitle: "For Tomorrow",
    description: "Empowering students to make a difference",
    gradient: "from-rose-500 via-pink-500 to-rose-500",
  },
  {
    id: 5,
    icon: Star,
    title: "10+ Years of",
    highlight: "Legacy",
    subtitle: "And Counting",
    description: "A tradition of excellence continues",
    gradient: "from-violet-500 via-purple-500 to-violet-500",
  },
];

export default function Launch() {
  const [launched, setLaunched] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showEnter, setShowEnter] = useState(false);

  const handleLaunch = () => {
    setLaunched(true);
    // Auto-advance slides
    const interval = setInterval(() => {
      setCurrentSlide((prev) => {
        if (prev >= slides.length - 1) {
          clearInterval(interval);
          setTimeout(() => setShowEnter(true), 500);
          return prev;
        }
        return prev + 1;
      });
    }, 2500);
  };

  const handleEnter = () => {
    // Store that user has seen intro
    localStorage.setItem("ahsas_launched", "true");
    window.location.href = "/home";
  };

  const handleSkip = () => {
    localStorage.setItem("ahsas_launched", "true");
    window.location.href = "/home";
  };

  return (
    <div className="min-h-screen bg-background overflow-hidden relative">
      {/* Background pattern */}
      <div className="absolute inset-0 pattern-dots opacity-30" />
      <div className="absolute inset-0 gradient-mesh opacity-50" />

      {/* Animated orbs */}
      <motion.div
        className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 4, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-accent/10 rounded-full blur-3xl"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.5, 0.3, 0.5],
        }}
        transition={{ duration: 4, repeat: Infinity }}
      />

      <AnimatePresence mode="wait">
        {!launched ? (
          /* Initial Launch Screen */
          <motion.div
            key="launch"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen flex flex-col items-center justify-center px-4 relative z-10"
          >
            {/* Logo/Brand */}
            <motion.div
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-center mb-12"
            >
              <motion.div
                className="w-24 h-24 sm:w-32 sm:h-32 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-gold"
                animate={{
                  boxShadow: [
                    "0 0 20px hsl(var(--primary) / 0.3)",
                    "0 0 40px hsl(var(--primary) / 0.5)",
                    "0 0 20px hsl(var(--primary) / 0.3)",
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <span className="text-4xl sm:text-5xl font-bold text-primary-foreground">A</span>
              </motion.div>
              <h1 className="text-3xl sm:text-5xl font-bold text-foreground mb-2">AHSAS</h1>
              <p className="text-muted-foreground text-sm sm:text-base">Al Hasanath Students Association</p>
            </motion.div>

            {/* Launch Button */}
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <Button
                onClick={handleLaunch}
                size="lg"
                className="h-16 sm:h-20 px-8 sm:px-12 text-lg sm:text-xl rounded-2xl group relative overflow-hidden"
              >
                <motion.span
                  className="absolute inset-0 bg-gradient-to-r from-primary via-accent to-primary opacity-0 group-hover:opacity-100 transition-opacity"
                  animate={{
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                  style={{ backgroundSize: "200% 200%" }}
                />
                <span className="relative flex items-center gap-3">
                  <Rocket className="w-6 h-6 group-hover:animate-bounce" />
                  Launch Website
                </span>
              </Button>
            </motion.div>

            {/* Hint text */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="mt-8 text-muted-foreground text-sm"
            >
              Click to begin your journey
            </motion.p>
          </motion.div>
        ) : (
          /* Slideshow */
          <motion.div
            key="slideshow"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen flex flex-col items-center justify-center px-4 relative z-10"
          >
            {/* Skip button */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              onClick={handleSkip}
              className="absolute top-6 right-6 text-muted-foreground hover:text-foreground transition-colors text-sm"
            >
              Skip Intro →
            </motion.button>

            {/* Progress dots */}
            <div className="absolute top-6 left-1/2 -translate-x-1/2 flex gap-2">
              {slides.map((_, index) => (
                <motion.div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                    index <= currentSlide ? "bg-primary" : "bg-muted"
                  }`}
                  animate={index === currentSlide ? { scale: [1, 1.3, 1] } : {}}
                  transition={{ duration: 0.5 }}
                />
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -50, scale: 0.9 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="text-center max-w-2xl"
              >
                {/* Icon */}
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className={`w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-8 rounded-2xl bg-gradient-to-br ${slides[currentSlide].gradient} flex items-center justify-center shadow-lg`}
                >
                  {(() => {
                    const Icon = slides[currentSlide].icon;
                    return <Icon className="w-10 h-10 sm:w-12 sm:h-12 text-white" />;
                  })()}
                </motion.div>

                {/* Title */}
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-lg sm:text-xl text-muted-foreground mb-2"
                >
                  {slides[currentSlide].title}
                </motion.p>

                {/* Highlight */}
                <motion.h2
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4, type: "spring", stiffness: 150 }}
                  className={`text-5xl sm:text-7xl md:text-8xl font-bold mb-4 bg-gradient-to-r ${slides[currentSlide].gradient} bg-clip-text text-transparent`}
                >
                  {slides[currentSlide].highlight}
                </motion.h2>

                {/* Subtitle */}
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-xl sm:text-2xl font-semibold text-foreground mb-4"
                >
                  {slides[currentSlide].subtitle}
                </motion.p>

                {/* Description */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="text-muted-foreground text-base sm:text-lg"
                >
                  {slides[currentSlide].description}
                </motion.p>
              </motion.div>
            </AnimatePresence>

            {/* Enter button */}
            <AnimatePresence>
              {showEnter && (
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, type: "spring" }}
                  className="absolute bottom-12"
                >
                  <Button
                    onClick={handleEnter}
                    size="lg"
                    className="h-14 sm:h-16 px-8 sm:px-10 text-base sm:text-lg rounded-xl group"
                  >
                    Enter Ahsas
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
