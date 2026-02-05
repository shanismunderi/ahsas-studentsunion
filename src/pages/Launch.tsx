 import { useState, useEffect } from "react";
 import { motion, AnimatePresence } from "framer-motion";
 import { Rocket, Users, Trophy, Heart, Star, ArrowRight, Sparkles, Gem } from "lucide-react";
 import { Button } from "@/components/ui/button";
 import ahsasLogo from "@/assets/ahsas-logo.png";
 
 const slides = [
   {
     id: 1,
     icon: Sparkles,
     title: "Welcome to",
     highlight: "AHSAS",
     subtitle: "Al Hasanath Students Association",
     description: "إِنَّا فَتَحْنَا لَكَ فَتْحًا مُّبِينًا",
     gradient: "from-primary via-accent to-primary",
     bgGradient: "from-primary/20 via-accent/10 to-transparent",
   },
   {
     id: 2,
     icon: Users,
     title: "A Community of",
     highlight: "400+",
     subtitle: "Active Members",
     description: "United by passion, driven by purpose",
     gradient: "from-emerald-500 via-teal-500 to-cyan-500",
     bgGradient: "from-emerald-500/20 via-teal-500/10 to-transparent",
   },
   {
     id: 3,
     icon: Trophy,
     title: "Celebrating",
     highlight: "300+",
     subtitle: "Achievements",
     description: "Excellence in academics, sports & arts",
     gradient: "from-amber-500 via-orange-500 to-yellow-500",
     bgGradient: "from-amber-500/20 via-orange-500/15 to-transparent",
   },
   {
     id: 4,
     icon: Heart,
     title: "Building",
     highlight: "Leaders",
     subtitle: "For Tomorrow",
     description: "Empowering students to make a difference",
     gradient: "from-rose-500 via-pink-500 to-red-500",
     bgGradient: "from-rose-500/20 via-pink-500/15 to-transparent",
   },
   {
     id: 5,
     icon: Star,
     title: "10+ Years of",
     highlight: "Legacy",
     subtitle: "And Counting",
     description: "A tradition of excellence continues",
     gradient: "from-violet-500 via-purple-500 to-indigo-500",
     bgGradient: "from-violet-500/20 via-purple-500/15 to-transparent",
   },
 ];
 
 const FloatingParticles = () => (
   <div className="absolute inset-0 overflow-hidden pointer-events-none">
     {[...Array(50)].map((_, i) => (
       <motion.div
         key={i}
         className={`absolute rounded-full ${i % 3 === 0 ? 'w-2 h-2 bg-primary/20' : i % 3 === 1 ? 'w-1.5 h-1.5 bg-accent/25' : 'w-1 h-1 bg-primary/30'}`}
         initial={{
           x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
           y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800),
         }}
         animate={{
           y: [null, -100, (typeof window !== 'undefined' ? window.innerHeight : 800) + 100],
           opacity: [0, 1, 0],
           scale: [0, 1, 0],
         }}
         transition={{
           duration: Math.random() * 15 + 8,
           repeat: Infinity,
           delay: Math.random() * 5,
           ease: "linear",
         }}
       />
     ))}
   </div>
 );
 
 const FloatingGeometry = () => (
   <div className="absolute inset-0 overflow-hidden pointer-events-none">
     {[...Array(8)].map((_, i) => (
       <motion.div
         key={i}
         className={`absolute ${i % 2 === 0 ? 'w-32 h-32 border border-primary/10 rounded-2xl' : 'w-24 h-24 border border-accent/10 rounded-full'}`}
         style={{ left: `${10 + (i * 12)}%`, top: `${15 + (i % 3) * 25}%` }}
         animate={{
           rotate: [0, 360],
           scale: [0.8, 1.2, 0.8],
           opacity: [0.1, 0.3, 0.1],
         }}
         transition={{ duration: 15 + i * 3, repeat: Infinity, ease: "linear" }}
       />
     ))}
   </div>
 );
 
 const AnimatedRings = ({ launched }: { launched: boolean }) => (
   <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
     {[...Array(5)].map((_, i) => (
       <motion.div
         key={i}
         className={`absolute rounded-full ${i % 2 === 0 ? 'border border-primary/20' : 'border border-accent/15'}`}
         initial={{ width: 200, height: 200, opacity: 0 }}
         animate={launched ? {
           width: [200, 1200],
           height: [200, 1200],
           opacity: [0.5, 0],
         } : {
           width: 150 + i * 80,
           height: 150 + i * 80,
           opacity: 0.1 - i * 0.02,
         }}
         transition={launched ? {
           duration: 1.5,
           delay: i * 0.2,
           ease: "easeOut",
         } : {
           duration: 6 + i,
           repeat: Infinity,
           repeatType: "reverse",
         }}
       />
     ))}
   </div>
 );
 
 const GlowingOrbs = () => (
   <>
     <motion.div
       className="absolute top-1/4 right-1/4 w-[600px] h-[600px] rounded-full blur-[150px]"
       style={{ background: `radial-gradient(circle, hsl(var(--primary) / 0.2) 0%, transparent 70%)` }}
       animate={{ scale: [1, 1.4, 1], x: [0, 80, 0], y: [0, -50, 0] }}
       transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
     />
     <motion.div
       className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] rounded-full blur-[120px]"
       style={{ background: `radial-gradient(circle, hsl(var(--accent) / 0.15) 0%, transparent 70%)` }}
       animate={{ scale: [1.3, 1, 1.3], x: [0, -60, 0], y: [0, 60, 0] }}
       transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
     />
     <motion.div
       className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full blur-[200px]"
       style={{ background: `radial-gradient(circle, hsl(var(--primary) / 0.1) 0%, transparent 60%)` }}
       animate={{ scale: [1, 1.3, 1], rotate: [0, 180, 360] }}
       transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
     />
     <motion.div
       className="absolute top-1/3 left-1/3 w-[300px] h-[300px] rounded-full blur-[80px]"
       style={{ background: `radial-gradient(circle, hsl(180 70% 45% / 0.12) 0%, transparent 70%)` }}
       animate={{ scale: [1, 1.5, 1], x: [0, 100, 0], y: [0, -80, 0] }}
       transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
     />
   </>
 );
 
 export default function Launch() {
   const [launched, setLaunched] = useState(false);
   const [currentSlide, setCurrentSlide] = useState(0);
   const [showEnter, setShowEnter] = useState(false);
   const [isExiting, setIsExiting] = useState(false);
   const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
 
   useEffect(() => {
     const handleMouseMove = (e: MouseEvent) => {
       setMousePosition({
         x: (e.clientX / window.innerWidth - 0.5) * 20,
         y: (e.clientY / window.innerHeight - 0.5) * 20,
       });
     };
     window.addEventListener('mousemove', handleMouseMove);
     return () => window.removeEventListener('mousemove', handleMouseMove);
   }, []);
 
   const handleLaunch = () => {
     setLaunched(true);
     const interval = setInterval(() => {
       setCurrentSlide((prev) => {
         if (prev >= slides.length - 1) {
           clearInterval(interval);
           setTimeout(() => setShowEnter(true), 600);
           return prev;
         }
         return prev + 1;
       });
     }, 3500);
   };
 
   const handleEnter = () => {
     setIsExiting(true);
     localStorage.setItem("ahsas_launched", "true");
     setTimeout(() => { window.location.href = "/home"; }, 1000);
   };
 
   const handleSkip = () => {
     setIsExiting(true);
     localStorage.setItem("ahsas_launched", "true");
     setTimeout(() => { window.location.href = "/home"; }, 600);
   };
 
   return (
     <motion.div 
       className="min-h-screen bg-background overflow-hidden relative"
       animate={isExiting ? { opacity: 0, scale: 1.15, filter: "blur(20px)" } : { opacity: 1, scale: 1, filter: "blur(0px)" }}
       transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
     >
       {/* Animated gradient background */}
       <motion.div
         className="absolute inset-0"
         animate={{
           background: launched 
             ? `radial-gradient(ellipse at center, hsl(var(--primary) / 0.15) 0%, hsl(var(--background)) 70%)`
             : `radial-gradient(ellipse at center, hsl(var(--primary) / 0.08) 0%, hsl(var(--background)) 60%)`,
         }}
         transition={{ duration: 1 }}
       />
 
       {/* Premium grid pattern */}
       <div 
         className="absolute inset-0 opacity-[0.03]"
         style={{
           backgroundImage: `linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)`,
           backgroundSize: '80px 80px',
         }}
       />
 
       {/* Noise texture overlay */}
       <div 
         className="absolute inset-0 opacity-[0.015] mix-blend-overlay"
         style={{
           backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
         }}
       />
 
       <FloatingGeometry />
       <FloatingParticles />
       <AnimatedRings launched={launched} />
       <GlowingOrbs />
 
       <AnimatePresence mode="wait">
         {!launched ? (
           <motion.div
             key="launch"
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             exit={{ opacity: 0, scale: 0.8, filter: "blur(30px)", rotateX: 15 }}
             transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
             className="min-h-screen flex flex-col items-center justify-center px-6 relative z-10"
           >
             {/* Mouse-following spotlight */}
             <motion.div
               className="absolute w-[800px] h-[800px] rounded-full pointer-events-none"
               style={{ background: `radial-gradient(circle, hsl(var(--primary) / 0.08) 0%, transparent 50%)` }}
               animate={{ x: mousePosition.x * 3, y: mousePosition.y * 3 }}
               transition={{ type: "spring", stiffness: 50, damping: 30 }}
             />
 
             {/* Premium logo container */}
             <motion.div
               initial={{ y: -80, opacity: 0, scale: 0.5 }}
               animate={{ y: 0, opacity: 1, scale: 1 }}
               transition={{ delay: 0.2, duration: 1.2, type: "spring", stiffness: 80, damping: 15 }}
               className="text-center mb-10 sm:mb-14"
             >
               <div className="relative w-36 h-36 sm:w-44 sm:h-44 mx-auto mb-8">
                 {/* Multi-layer glow */}
                 <motion.div
                   className="absolute inset-[-20px] rounded-full blur-3xl"
                   style={{ background: `radial-gradient(circle, hsl(var(--primary) / 0.4) 0%, transparent 70%)` }}
                   animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0.8, 0.5] }}
                   transition={{ duration: 3, repeat: Infinity }}
                 />
                 
                 {/* Outer rotating ring */}
                 <motion.div
                   className="absolute inset-[-8px] rounded-full"
                   style={{ 
                     background: `conic-gradient(from 0deg, hsl(var(--primary)), hsl(var(--accent)), hsl(120 70% 45%), hsl(var(--primary)))`,
                     padding: '3px',
                   }}
                   animate={{ rotate: 360 }}
                   transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                 >
                   <div className="w-full h-full rounded-full bg-background" />
                 </motion.div>
 
                 {/* Secondary rotating ring */}
                 <motion.div
                   className="absolute inset-[-4px] rounded-full opacity-50"
                   style={{ background: `conic-gradient(from 180deg, transparent, hsl(var(--primary) / 0.5), transparent)` }}
                   animate={{ rotate: -360 }}
                   transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                 />
 
                 {/* Inner glow ring */}
                 <motion.div
                   className="absolute inset-0 rounded-full"
                   style={{ background: `linear-gradient(135deg, hsl(var(--primary) / 0.3) 0%, hsl(var(--accent) / 0.3) 100%)` }}
                   animate={{
                     boxShadow: [
                       "0 0 40px hsl(var(--primary) / 0.4), 0 0 80px hsl(var(--primary) / 0.2), inset 0 0 30px hsl(var(--primary) / 0.1)",
                       "0 0 60px hsl(var(--primary) / 0.6), 0 0 120px hsl(var(--primary) / 0.3), inset 0 0 50px hsl(var(--primary) / 0.2)",
                       "0 0 40px hsl(var(--primary) / 0.4), 0 0 80px hsl(var(--primary) / 0.2), inset 0 0 30px hsl(var(--primary) / 0.1)",
                     ],
                   }}
                   transition={{ duration: 2.5, repeat: Infinity }}
                 />
                 
                 {/* Logo image */}
                 <motion.div
                   className="absolute inset-2 rounded-full bg-background flex items-center justify-center overflow-hidden"
                   animate={{ scale: [1, 1.02, 1] }}
                   transition={{ duration: 3, repeat: Infinity }}
                 >
                   <img src={ahsasLogo} alt="AHSAS Logo" className="w-full h-full object-contain p-3" />
                 </motion.div>
 
                 {/* Floating sparkles around logo */}
                 {[...Array(6)].map((_, i) => (
                   <motion.div
                     key={i}
                     className="absolute w-2 h-2"
                     style={{ left: '50%', top: '50%' }}
                     animate={{
                       x: [0, Math.cos(i * 60 * Math.PI / 180) * 80],
                       y: [0, Math.sin(i * 60 * Math.PI / 180) * 80],
                       opacity: [0, 1, 0],
                       scale: [0, 1, 0],
                     }}
                     transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                   >
                     <Sparkles className="w-2 h-2 text-primary" />
                   </motion.div>
                 ))}
               </div>
 
               {/* Title with premium animation */}
               <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                 <motion.h1 
                   className="text-5xl sm:text-7xl lg:text-8xl font-bold mb-4 tracking-tight"
                   initial={{ y: 20, opacity: 0 }}
                   animate={{ y: 0, opacity: 1 }}
                   transition={{ delay: 0.6, duration: 0.8 }}
                 >
                   <motion.span 
                     className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent bg-[length:300%_auto]"
                     animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
                     transition={{ duration: 5, repeat: Infinity }}
                   >
                     AHSAS
                   </motion.span>
                 </motion.h1>
                 
                 <motion.p 
                   className="text-muted-foreground text-sm sm:text-base lg:text-lg tracking-[0.3em] uppercase font-medium"
                   initial={{ y: 20, opacity: 0 }}
                   animate={{ y: 0, opacity: 1 }}
                   transition={{ delay: 0.8, duration: 0.6 }}
                 >
                   Al Hasanath Students Association
                 </motion.p>
 
                 {/* Arabic verse */}
                 <motion.p 
                   className="text-primary/80 text-lg sm:text-xl lg:text-2xl mt-4"
                   initial={{ y: 20, opacity: 0 }}
                   animate={{ y: 0, opacity: 1 }}
                   transition={{ delay: 1, duration: 0.6 }}
                   style={{ fontFamily: 'serif' }}
                 >
                   إِنَّا فَتَحْنَا لَكَ فَتْحًا مُّبِينًا
                 </motion.p>
               </motion.div>
             </motion.div>
 
             {/* Premium Launch Button */}
             <motion.div
               initial={{ y: 60, opacity: 0 }}
               animate={{ y: 0, opacity: 1 }}
               transition={{ delay: 1.2, duration: 0.8, type: "spring" }}
               className="relative"
             >
               <motion.div
                 className="absolute -inset-4 rounded-3xl blur-2xl"
                 style={{ background: `linear-gradient(135deg, hsl(var(--primary) / 0.4) 0%, hsl(var(--accent) / 0.3) 100%)` }}
                 animate={{ opacity: [0.3, 0.6, 0.3], scale: [0.9, 1.1, 0.9] }}
                 transition={{ duration: 2.5, repeat: Infinity }}
               />
               
               <motion.div
                 className="absolute -inset-2 rounded-3xl opacity-50 blur-xl"
                 style={{ background: `linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--accent)) 100%)` }}
                 animate={{ opacity: [0.4, 0.7, 0.4], scale: [0.95, 1.08, 0.95] }}
                 transition={{ duration: 2, repeat: Infinity }}
               />
               
               <Button
                 onClick={handleLaunch}
                 size="lg"
                 className="relative h-16 sm:h-20 px-12 sm:px-16 text-lg sm:text-xl rounded-2xl overflow-hidden group border-0 shadow-2xl"
               >
                 <motion.span
                   className="absolute inset-0"
                   style={{ 
                     background: `linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--accent)) 50%, hsl(var(--primary)) 100%)`,
                     backgroundSize: "300% 300%" 
                   }}
                   animate={{ backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"] }}
                   transition={{ duration: 4, repeat: Infinity }}
                 />
                 
                 <motion.span
                   className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                   style={{ background: `linear-gradient(90deg, transparent 0%, hsl(0 0% 100% / 0.3) 50%, transparent 100%)` }}
                   animate={{ x: ["-100%", "100%"] }}
                   transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 0.5 }}
                 />
                 
                 <span className="absolute inset-0 rounded-2xl border border-white/20" />
                 
                 <span className="relative flex items-center gap-4 text-primary-foreground font-bold tracking-wide">
                   <motion.span
                     animate={{ rotate: [0, -15, 15, 0], y: [0, -2, 0], scale: [1, 1.1, 1] }}
                     transition={{ duration: 2, repeat: Infinity }}
                   >
                     <Rocket className="w-6 h-6 sm:w-7 sm:h-7 drop-shadow-lg" />
                   </motion.span>
                   Launch Experience
                   <motion.span
                     animate={{ scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }}
                     transition={{ duration: 1.5, repeat: Infinity }}
                   >
                     <Gem className="w-5 h-5 sm:w-6 sm:h-6" />
                   </motion.span>
                 </span>
               </Button>
             </motion.div>
 
             {/* Animated hint */}
             <motion.div
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               transition={{ delay: 1.6, duration: 0.8 }}
               className="mt-10 flex flex-col items-center gap-3"
             >
               <motion.div
                 className="flex gap-1"
                 animate={{ y: [0, 5, 0] }}
                 transition={{ duration: 1.5, repeat: Infinity }}
               >
                 {[0, 1, 2].map((i) => (
                   <motion.div
                     key={i}
                     className="w-2 h-2 bg-primary/60 rounded-full"
                     animate={{ opacity: [0.3, 1, 0.3] }}
                     transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                   />
                 ))}
               </motion.div>
               <p className="text-muted-foreground text-sm tracking-wider">Click to begin your journey</p>
             </motion.div>
           </motion.div>
         ) : (
           /* Premium Slideshow */
           <motion.div
             key="slideshow"
             initial={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
             animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
             transition={{ duration: 1 }}
             className="min-h-screen flex flex-col items-center justify-center px-6 relative z-10"
           >
             {/* Skip button */}
             <motion.button
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ delay: 1 }}
               onClick={handleSkip}
               className="absolute top-8 right-8 px-5 py-2.5 rounded-full bg-background/50 backdrop-blur-xl border border-border/50 text-muted-foreground hover:text-foreground hover:bg-background/80 transition-all text-sm font-medium flex items-center gap-2 group shadow-lg"
             >
               Skip
               <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
             </motion.button>
 
             {/* Premium progress bar */}
             <div className="absolute top-8 left-1/2 -translate-x-1/2 flex items-center gap-2 sm:gap-3">
               {slides.map((_, index) => (
                 <div key={index} className="relative">
                   <motion.div className="w-10 sm:w-14 h-1.5 rounded-full bg-muted/50 overflow-hidden backdrop-blur-sm">
                     <motion.div
                       className="h-full rounded-full"
                       style={{ background: `linear-gradient(90deg, hsl(var(--primary)) 0%, hsl(var(--accent)) 100%)` }}
                       initial={{ width: "0%" }}
                       animate={{ width: index < currentSlide ? "100%" : index === currentSlide ? "100%" : "0%" }}
                       transition={{ duration: index === currentSlide ? 3.3 : 0.3, ease: index === currentSlide ? "linear" : "easeOut" }}
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
               transition={{ duration: 1 }}
             >
               <div 
                 className={`absolute inset-0 bg-gradient-radial ${slides[currentSlide].bgGradient}`}
                 style={{
                   background: `radial-gradient(ellipse at center, ${slides[currentSlide].bgGradient.includes('emerald') ? 'hsl(160 70% 45% / 0.2)' : slides[currentSlide].bgGradient.includes('amber') ? 'hsl(45 90% 50% / 0.2)' : slides[currentSlide].bgGradient.includes('rose') ? 'hsl(350 80% 50% / 0.2)' : slides[currentSlide].bgGradient.includes('violet') ? 'hsl(270 70% 50% / 0.2)' : 'hsl(var(--primary) / 0.2)'} 0%, transparent 70%)`
                 }}
               />
             </motion.div>
 
             <AnimatePresence mode="wait">
               <motion.div
                 key={currentSlide}
                 initial={{ opacity: 0, y: 80, scale: 0.85, filter: "blur(15px)" }}
                 animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                 exit={{ opacity: 0, y: -80, scale: 0.85, filter: "blur(15px)" }}
                 transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                 className="text-center max-w-4xl relative px-4"
               >
                 {/* Animated icon container */}
                 <motion.div
                   initial={{ scale: 0, rotate: -180, opacity: 0 }}
                   animate={{ scale: 1, rotate: 0, opacity: 1 }}
                   transition={{ delay: 0.2, type: "spring", stiffness: 150, damping: 15 }}
                   className="relative w-28 h-28 sm:w-36 sm:h-36 mx-auto mb-8 sm:mb-12"
                 >
                   <motion.div
                     className="absolute inset-[-8px] rounded-[28px] opacity-30"
                     style={{ background: `linear-gradient(135deg, ${slides[currentSlide].gradient.split(' ')[0].replace('from-', '')} 0%, transparent 100%)` }}
                     animate={{ scale: [1, 1.3, 1], rotate: [0, 180, 360] }}
                     transition={{ duration: 6, repeat: Infinity }}
                   />
                   
                   <div 
                     className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${slides[currentSlide].gradient} shadow-2xl flex items-center justify-center`}
                     style={{
                       boxShadow: `0 20px 60px -15px ${slides[currentSlide].gradient.includes('emerald') ? 'hsl(160 70% 45% / 0.5)' : slides[currentSlide].gradient.includes('amber') ? 'hsl(45 90% 50% / 0.5)' : slides[currentSlide].gradient.includes('rose') ? 'hsl(350 80% 50% / 0.5)' : slides[currentSlide].gradient.includes('violet') ? 'hsl(270 70% 50% / 0.5)' : 'hsl(var(--primary) / 0.5)'}`,
                     }}
                   >
                     <motion.div animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 2.5, repeat: Infinity }}>
                       {(() => {
                         const Icon = slides[currentSlide].icon;
                         return <Icon className="w-14 h-14 sm:w-16 sm:h-16 text-white drop-shadow-lg" />;
                       })()}
                     </motion.div>
                   </div>
                 </motion.div>
 
                 {/* Title */}
                 <motion.p
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ delay: 0.3, duration: 0.6 }}
                   className="text-lg sm:text-2xl lg:text-3xl text-muted-foreground mb-3 sm:mb-4 font-light tracking-wide"
                 >
                   {slides[currentSlide].title}
                 </motion.p>
 
                 {/* Highlight number/text */}
                 <motion.h2
                   initial={{ opacity: 0, scale: 0.5, y: 30 }}
                   animate={{ opacity: 1, scale: 1, y: 0 }}
                   transition={{ delay: 0.4, type: "spring", stiffness: 80, damping: 12 }}
                   className={`text-7xl sm:text-9xl lg:text-[10rem] font-black mb-4 sm:mb-6 bg-gradient-to-r ${slides[currentSlide].gradient} bg-clip-text text-transparent leading-none tracking-tight`}
                 >
                   {slides[currentSlide].highlight}
                 </motion.h2>
 
                 {/* Subtitle */}
                 <motion.p
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ delay: 0.5, duration: 0.6 }}
                   className="text-xl sm:text-3xl lg:text-4xl font-semibold text-foreground mb-4 sm:mb-6"
                 >
                   {slides[currentSlide].subtitle}
                 </motion.p>
 
                 {/* Description */}
                 <motion.p
                   initial={{ opacity: 0 }}
                   animate={{ opacity: 1 }}
                   transition={{ delay: 0.6, duration: 0.6 }}
                   className={`text-muted-foreground text-base sm:text-xl lg:text-2xl max-w-lg mx-auto ${currentSlide === 0 ? 'text-primary/80' : ''}`}
                   style={currentSlide === 0 ? { fontFamily: 'serif' } : undefined}
                 >
                   {slides[currentSlide].description}
                 </motion.p>
 
                 {/* Decorative line */}
                 <motion.div
                   initial={{ scaleX: 0 }}
                   animate={{ scaleX: 1 }}
                   transition={{ delay: 0.7, duration: 0.8 }}
                   className="mt-6 sm:mt-8 h-0.5 w-40 mx-auto bg-gradient-to-r from-transparent via-primary/60 to-transparent"
                 />
               </motion.div>
             </AnimatePresence>
 
             {/* Premium Enter button */}
             <AnimatePresence>
               {showEnter && (
                 <motion.div
                   initial={{ opacity: 0, y: 80, scale: 0.7 }}
                   animate={{ opacity: 1, y: 0, scale: 1 }}
                   transition={{ duration: 1, type: "spring", stiffness: 80 }}
                   className="absolute bottom-12 sm:bottom-16"
                 >
                   <div className="relative">
                     <motion.div
                       className="absolute -inset-4 rounded-2xl blur-2xl"
                       style={{ background: `linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--accent)) 100%)` }}
                       animate={{ opacity: [0.4, 0.8, 0.4], scale: [0.9, 1.1, 0.9] }}
                       transition={{ duration: 2, repeat: Infinity }}
                     />
                     
                     <Button
                       onClick={handleEnter}
                       size="lg"
                       className="relative h-14 sm:h-18 px-10 sm:px-14 text-base sm:text-xl rounded-2xl overflow-hidden group shadow-2xl"
                     >
                       <motion.span
                         className="absolute inset-0"
                         style={{ background: `linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--accent)) 100%)` }}
                       />
                       <span className="absolute inset-0 rounded-2xl border border-white/20" />
                       <span className="relative flex items-center gap-4 text-primary-foreground font-bold tracking-wide">
                         Enter AHSAS
                         <motion.span
                           animate={{ x: [0, 5, 0] }}
                           transition={{ duration: 1, repeat: Infinity }}
                         >
                           <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6" />
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