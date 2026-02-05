import { useState, useEffect } from "react";
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
    bgGradient: "from-primary/20 via-accent/10 to-transparent",
  },
  {
    id: 2,
    icon: Users,
    title: "A Community of",
    highlight: "500+",
    subtitle: "Active Members",
    description: "United by passion, driven by purpose",
    gradient: "from-teal-400 via-emerald-400 to-cyan-400",
    bgGradient: "from-teal-500/20 via-emerald-500/10 to-transparent",
  },
  {
    id: 3,
    icon: Trophy,
    title: "Celebrating",
    highlight: "150+",
    subtitle: "Achievements",
    description: "Excellence in academics, sports & arts",
    gradient: "from-amber-400 via-orange-400 to-yellow-400",
    bgGradient: "from-amber-500/20 via-orange-500/10 to-transparent",
  },
  {
    id: 4,
    icon: Heart,
    title: "Building",
    highlight: "Leaders",
    subtitle: "For Tomorrow",
    description: "Empowering students to make a difference",
    gradient: "from-rose-400 via-pink-400 to-red-400",
    bgGradient: "from-rose-500/20 via-pink-500/10 to-transparent",
  },
  {
    id: 5,
    icon: Star,
    title: "10+ Years of",
    highlight: "Legacy",
    subtitle: "And Counting",
    description: "A tradition of excellence continues",
    gradient: "from-violet-400 via-purple-400 to-indigo-400",
    bgGradient: "from-violet-500/20 via-purple-500/10 to-transparent",
  },
];

// Floating particles component
const FloatingParticles = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(30)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-primary/30 rounded-full"
          initial={{
            x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
            y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800),
          }}
          animate={{
            y: [null, -100, (typeof window !== 'undefined' ? window.innerHeight : 800) + 100],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
};

// Animated ring component
const AnimatedRings = ({ launched }: { launched: boolean }) => {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full border border-primary/20"
          initial={{ width: 200, height: 200, opacity: 0 }}
          animate={launched ? {
            width: [200, 800],
            height: [200, 800],
            opacity: [0.5, 0],
          } : {
            width: 200 + i * 100,
            height: 200 + i * 100,
            opacity: 0.1 - i * 0.03,
          }}
          transition={launched ? {
            duration: 1.5,
            delay: i * 0.2,
            ease: "easeOut",
          } : {
            duration: 4,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
      ))}
    </div>
  );
};

export default function Launch() {
  const [launched, setLaunched] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showEnter, setShowEnter] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  const handleLaunch = () => {
    setLaunched(true);
    // Auto-advance slides
    const interval = setInterval(() => {
      setCurrentSlide((prev) => {
        if (prev >= slides.length - 1) {
          clearInterval(interval);
          setTimeout(() => setShowEnter(true), 800);
          return prev;
        }
        return prev + 1;
      });
    }, 3000);
  };

  const handleEnter = () => {
    setIsExiting(true);
    localStorage.setItem("ahsas_launched", "true");
    setTimeout(() => {
      window.location.href = "/home";
    }, 800);
  };

  const handleSkip = () => {
    setIsExiting(true);
    localStorage.setItem("ahsas_launched", "true");
    setTimeout(() => {
      window.location.href = "/home";
    }, 500);
  };

  return (
    <motion.div 
      className="min-h-screen bg-background overflow-hidden relative"
      animate={isExiting ? { opacity: 0, scale: 1.1 } : { opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
    >
      {/* Animated gradient background */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background: launched 
            ? `radial-gradient(ellipse at center, hsl(var(--primary) / 0.1) 0%, transparent 70%)`
            : `radial-gradient(ellipse at center, hsl(var(--primary) / 0.05) 0%, transparent 50%)`,
        }}
        transition={{ duration: 1 }}
      />

      {/* Grid pattern overlay */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Floating particles */}
      <FloatingParticles />

      {/* Animated rings */}
      <AnimatedRings launched={launched} />

      {/* Dynamic gradient orbs */}
      <motion.div
        className="absolute top-1/4 right-1/4 w-[500px] h-[500px] rounded-full blur-[120px]"
        style={{ background: `radial-gradient(circle, hsl(var(--primary) / 0.15) 0%, transparent 70%)` }}
        animate={{
          scale: [1, 1.3, 1],
          x: [0, 50, 0],
          y: [0, -30, 0],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] rounded-full blur-[100px]"
        style={{ background: `radial-gradient(circle, hsl(var(--accent) / 0.12) 0%, transparent 70%)` }}
        animate={{
          scale: [1.2, 1, 1.2],
          x: [0, -40, 0],
          y: [0, 40, 0],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[150px]"
        style={{ background: `radial-gradient(circle, hsl(var(--primary) / 0.08) 0%, transparent 60%)` }}
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 180, 360],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />

      <AnimatePresence mode="wait">
        {!launched ? (
          /* Initial Launch Screen */
          <motion.div
            key="launch"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ 
              opacity: 0, 
              scale: 0.8,
              filter: "blur(20px)",
            }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="min-h-screen flex flex-col items-center justify-center px-4 relative z-10"
          >
            {/* Animated logo container */}
            <motion.div
              initial={{ y: -100, opacity: 0, rotateX: -90 }}
              animate={{ y: 0, opacity: 1, rotateX: 0 }}
              transition={{ delay: 0.3, duration: 1, type: "spring", stiffness: 100 }}
              className="text-center mb-16 perspective-1000"
            >
              {/* Logo with multiple layers */}
              <div className="relative w-32 h-32 sm:w-40 sm:h-40 mx-auto mb-8">
                {/* Outer glow ring */}
                <motion.div
                  className="absolute inset-0 rounded-3xl"
                  style={{ background: `linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--accent)) 100%)` }}
                  animate={{
                    boxShadow: [
                      "0 0 30px hsl(var(--primary) / 0.3), 0 0 60px hsl(var(--primary) / 0.2)",
                      "0 0 50px hsl(var(--primary) / 0.5), 0 0 100px hsl(var(--primary) / 0.3)",
                      "0 0 30px hsl(var(--primary) / 0.3), 0 0 60px hsl(var(--primary) / 0.2)",
                    ],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                
                {/* Inner rotating gradient */}
                <motion.div
                  className="absolute inset-1 rounded-[20px] overflow-hidden"
                  style={{ background: `linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--accent)) 100%)` }}
                >
                  <motion.div
                    className="absolute inset-0"
                    style={{ 
                      background: `conic-gradient(from 0deg, transparent 0%, hsl(0 0% 100% / 0.3) 25%, transparent 50%)`,
                    }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  />
                </motion.div>
                
                {/* Logo letter */}
                <motion.div
                  className="absolute inset-2 rounded-2xl flex items-center justify-center"
                  style={{ background: `linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--primary) / 0.9) 100%)` }}
                >
                  <motion.span 
                    className="text-5xl sm:text-6xl font-bold text-primary-foreground"
                    animate={{ 
                      textShadow: [
                        "0 0 20px hsl(0 0% 100% / 0.5)",
                        "0 0 40px hsl(0 0% 100% / 0.8)",
                        "0 0 20px hsl(0 0% 100% / 0.5)",
                      ]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    A
                  </motion.span>
                </motion.div>
              </div>

              {/* Title with staggered animation */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <motion.h1 
                  className="text-5xl sm:text-7xl font-bold mb-3 tracking-tight"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.7, duration: 0.6 }}
                >
                  <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
                    AHSAS
                  </span>
                </motion.h1>
                <motion.p 
                  className="text-muted-foreground text-base sm:text-lg tracking-widest uppercase"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.9, duration: 0.6 }}
                >
                  Al Hasanath Students Association
                </motion.p>
              </motion.div>
            </motion.div>

            {/* Launch Button with premium styling */}
            <motion.div
              initial={{ y: 80, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.1, duration: 0.8, type: "spring" }}
              className="relative"
            >
              {/* Button glow effect */}
              <motion.div
                className="absolute -inset-2 rounded-3xl opacity-50 blur-xl"
                style={{ background: `linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--accent)) 100%)` }}
                animate={{
                  opacity: [0.3, 0.6, 0.3],
                  scale: [0.95, 1.05, 0.95],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              
              <Button
                onClick={handleLaunch}
                size="lg"
                className="relative h-16 sm:h-20 px-10 sm:px-14 text-lg sm:text-xl rounded-2xl overflow-hidden group border-0"
              >
                {/* Animated gradient background */}
                <motion.span
                  className="absolute inset-0"
                  style={{ 
                    background: `linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--accent)) 50%, hsl(var(--primary)) 100%)`,
                    backgroundSize: "200% 200%" 
                  }}
                  animate={{
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
                
                {/* Shimmer effect */}
                <motion.span
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ 
                    background: `linear-gradient(90deg, transparent 0%, hsl(0 0% 100% / 0.2) 50%, transparent 100%)`,
                  }}
                  animate={{
                    x: ["-100%", "100%"],
                  }}
                  transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 0.5 }}
                />
                
                <span className="relative flex items-center gap-3 text-primary-foreground font-semibold">
                  <motion.span
                    animate={{ 
                      rotate: [0, -10, 10, 0],
                      y: [0, -2, 0],
                    }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <Rocket className="w-6 h-6 sm:w-7 sm:h-7" />
                  </motion.span>
                  Launch Experience
                </span>
              </Button>
            </motion.div>

            {/* Animated hint */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5, duration: 0.8 }}
              className="mt-12 flex flex-col items-center gap-2"
            >
              <motion.div
                className="flex gap-1"
                animate={{ y: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-1.5 h-1.5 bg-primary/50 rounded-full"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                  />
                ))}
              </motion.div>
              <p className="text-muted-foreground text-sm">Click to begin your journey</p>
            </motion.div>
          </motion.div>
        ) : (
          /* Premium Slideshow */
          <motion.div
            key="slideshow"
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="min-h-screen flex flex-col items-center justify-center px-4 relative z-10"
          >
            {/* Skip button */}
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.5 }}
              onClick={handleSkip}
              className="absolute top-6 right-6 px-4 py-2 rounded-full glass text-muted-foreground hover:text-foreground transition-all text-sm flex items-center gap-2 group"
            >
              Skip
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </motion.button>

            {/* Premium progress bar */}
            <div className="absolute top-6 left-1/2 -translate-x-1/2 flex items-center gap-3">
              {slides.map((_, index) => (
                <div key={index} className="relative">
                  <motion.div
                    className="w-8 sm:w-12 h-1 rounded-full bg-muted overflow-hidden"
                  >
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: `linear-gradient(90deg, hsl(var(--primary)) 0%, hsl(var(--accent)) 100%)` }}
                      initial={{ width: "0%" }}
                      animate={{ 
                        width: index < currentSlide ? "100%" : index === currentSlide ? "100%" : "0%"
                      }}
                      transition={{ 
                        duration: index === currentSlide ? 2.8 : 0.3,
                        ease: index === currentSlide ? "linear" : "easeOut"
                      }}
                    />
                  </motion.div>
                </div>
              ))}
            </div>

            {/* Slide content with dynamic background */}
            <motion.div
              key={`bg-${currentSlide}`}
              className="absolute inset-0 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div 
                className={`absolute inset-0 bg-gradient-radial ${slides[currentSlide].bgGradient}`}
                style={{
                  background: `radial-gradient(ellipse at center, ${slides[currentSlide].bgGradient.includes('teal') ? 'hsl(180 70% 45% / 0.15)' : slides[currentSlide].bgGradient.includes('amber') ? 'hsl(45 90% 50% / 0.15)' : slides[currentSlide].bgGradient.includes('rose') ? 'hsl(350 80% 50% / 0.15)' : slides[currentSlide].bgGradient.includes('violet') ? 'hsl(270 70% 50% / 0.15)' : 'hsl(var(--primary) / 0.15)'} 0%, transparent 60%)`
                }}
              />
            </motion.div>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, y: 60, scale: 0.9, filter: "blur(10px)" }}
                animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -60, scale: 0.9, filter: "blur(10px)" }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="text-center max-w-3xl relative"
              >
                {/* Animated icon container */}
                <motion.div
                  initial={{ scale: 0, rotate: -180, opacity: 0 }}
                  animate={{ scale: 1, rotate: 0, opacity: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 150, damping: 15 }}
                  className="relative w-24 h-24 sm:w-32 sm:h-32 mx-auto mb-10"
                >
                  {/* Outer ring animation */}
                  <motion.div
                    className="absolute inset-0 rounded-3xl"
                    style={{ 
                      background: `linear-gradient(135deg, ${slides[currentSlide].gradient.split(' ')[0].replace('from-', '')} 0%, transparent 100%)`,
                      opacity: 0.2
                    }}
                    animate={{ 
                      scale: [1, 1.2, 1],
                      rotate: [0, 90, 0],
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                  />
                  
                  {/* Icon background */}
                  <div 
                    className={`absolute inset-2 rounded-2xl bg-gradient-to-br ${slides[currentSlide].gradient} shadow-2xl flex items-center justify-center`}
                  >
                    <motion.div
                      animate={{ 
                        scale: [1, 1.1, 1],
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      {(() => {
                        const Icon = slides[currentSlide].icon;
                        return <Icon className="w-12 h-12 sm:w-16 sm:h-16 text-white drop-shadow-lg" />;
                      })()}
                    </motion.div>
                  </div>
                </motion.div>

                {/* Title */}
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                  className="text-xl sm:text-2xl text-muted-foreground mb-4 font-light tracking-wide"
                >
                  {slides[currentSlide].title}
                </motion.p>

                {/* Highlight number/text */}
                <motion.h2
                  initial={{ opacity: 0, scale: 0.5, y: 30 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ delay: 0.4, type: "spring", stiffness: 100, damping: 12 }}
                  className={`text-6xl sm:text-8xl md:text-9xl font-bold mb-6 bg-gradient-to-r ${slides[currentSlide].gradient} bg-clip-text text-transparent leading-none`}
                >
                  {slides[currentSlide].highlight}
                </motion.h2>

                {/* Subtitle */}
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                  className="text-2xl sm:text-3xl font-semibold text-foreground mb-6"
                >
                  {slides[currentSlide].subtitle}
                </motion.p>

                {/* Description */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.6 }}
                  className="text-muted-foreground text-lg sm:text-xl max-w-md mx-auto"
                >
                  {slides[currentSlide].description}
                </motion.p>

                {/* Decorative line */}
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.7, duration: 0.8 }}
                  className="mt-8 h-px w-32 mx-auto bg-gradient-to-r from-transparent via-primary/50 to-transparent"
                />
              </motion.div>
            </AnimatePresence>

            {/* Premium Enter button */}
            <AnimatePresence>
              {showEnter && (
                <motion.div
                  initial={{ opacity: 0, y: 60, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
                  className="absolute bottom-16"
                >
                  <div className="relative">
                    {/* Button glow */}
                    <motion.div
                      className="absolute -inset-3 rounded-2xl blur-xl"
                      style={{ background: `linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--accent)) 100%)` }}
                      animate={{
                        opacity: [0.4, 0.7, 0.4],
                        scale: [0.95, 1.05, 0.95],
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    
                    <Button
                      onClick={handleEnter}
                      size="lg"
                      className="relative h-14 sm:h-16 px-8 sm:px-12 text-base sm:text-lg rounded-xl overflow-hidden group"
                    >
                      <motion.span
                        className="absolute inset-0"
                        style={{ background: `linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--accent)) 100%)` }}
                      />
                      <span className="relative flex items-center gap-3 text-primary-foreground font-semibold">
                        Enter AHSAS
                        <motion.span
                          animate={{ x: [0, 5, 0] }}
                          transition={{ duration: 1, repeat: Infinity }}
                        >
                          <ArrowRight className="w-5 h-5" />
                        </motion.span>
                      </span>
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
