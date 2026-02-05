import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

type IntroPhase = "launch" | "introducing" | "branding" | "hidden";

export function SiteIntro() {
    const [phase, setPhase] = useState<IntroPhase>("launch");
    const [progress, setProgress] = useState(0);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const hasShown = sessionStorage.getItem("site-intro-shown");
        if (hasShown) {
            setPhase("hidden");
        } else {
            // Trigger entrance animation after mount
            setTimeout(() => setIsLoaded(true), 100);
        }
    }, []);

    const handleLaunch = () => {
        setPhase("introducing");
        setTimeout(() => {
            setPhase("branding");
        }, 2500);

        // Progress simulation
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    return 100;
                }
                return prev + 2;
            });
        }, 60);

        setTimeout(() => {
            setPhase("hidden");
            sessionStorage.setItem("site-intro-shown", "true");
        }, 6500);
    };

    if (phase === "hidden") return null;

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key="intro-container"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ 
                    opacity: 0, 
                    scale: 1.1,
                    filter: "blur(20px)",
                    transition: { duration: 1.5, ease: [0.22, 1, 0.36, 1] } 
                }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#030508] overflow-hidden"
            >
                {/* Animated Grid Background */}
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isLoaded ? 0.03 : 0 }}
                    transition={{ duration: 2, delay: 0.5 }}
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        backgroundImage: `linear-gradient(rgba(234,179,8,0.1) 1px, transparent 1px),
                                          linear-gradient(90deg, rgba(234,179,8,0.1) 1px, transparent 1px)`,
                        backgroundSize: '60px 60px'
                    }}
                />

                {/* Vignette */}
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1.5 }}
                    className="absolute inset-0 pointer-events-none z-10 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.6)_100%)]" 
                />

                {/* Animated Background Gradients */}
                <div className="absolute inset-0 overflow-hidden">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{
                            scale: [1, 1.2, 1],
                            opacity: isLoaded ? [0.15, 0.25, 0.15] : 0,
                            x: [0, 50, 0],
                            y: [0, -50, 0],
                        }}
                        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] rounded-full blur-[150px] bg-yellow-500/30"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{
                            scale: [1.2, 1, 1.2],
                            opacity: isLoaded ? [0.1, 0.2, 0.1] : 0,
                            x: [0, -50, 0],
                            y: [0, 50, 0],
                        }}
                        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute -bottom-[20%] -right-[10%] w-[50%] h-[50%] rounded-full blur-[120px] bg-amber-600/20"
                    />
                    {/* Central glow */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ 
                            opacity: isLoaded ? [0.05, 0.1, 0.05] : 0,
                            scale: isLoaded ? [1, 1.1, 1] : 0.5
                        }}
                        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] rounded-full blur-[200px] bg-yellow-400/10"
                    />
                </div>

                <AnimatePresence mode="wait">
                    {phase === "launch" && (
                        <motion.div
                            key="launch-phase"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: isLoaded ? 1 : 0, scale: isLoaded ? 1 : 0.95 }}
                            exit={{ opacity: 0, scale: 1.1, filter: "blur(30px)" }}
                            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                            className="relative flex flex-col items-center px-4 z-20"
                        >
                            <motion.div
                                initial={{ y: 40, opacity: 0, filter: "blur(10px)" }}
                                animate={{ y: 0, opacity: isLoaded ? 1 : 0, filter: "blur(0px)" }}
                                transition={{ delay: 0.3, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                                className="mb-12 text-center"
                            >
                                <motion.span
                                    className="text-4xl md:text-6xl lg:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-yellow-200 via-yellow-400 to-yellow-600 block mb-6 leading-relaxed tracking-wide"
                                    style={{ fontFamily: "'Amiri', serif", direction: "rtl" }}
                                >
                                    إِنَّا فَتَحْنَا لَكَ فَتْحًا مُّبِينًا
                                </motion.span>
                                <motion.div
                                    initial={{ scaleX: 0 }}
                                    animate={{ scaleX: isLoaded ? 1 : 0 }}
                                    transition={{ delay: 0.8, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                                    className="h-[2px] w-32 md:w-48 bg-gradient-to-r from-transparent via-yellow-500/60 to-transparent mx-auto"
                                />
                            </motion.div>

                            <motion.div
                                initial={{ y: 30, opacity: 0, scale: 0.9 }}
                                animate={{ y: 0, opacity: isLoaded ? 1 : 0, scale: isLoaded ? 1 : 0.9 }}
                                transition={{ delay: 0.8, duration: 1, ease: [0.22, 1, 0.36, 1] }}
                            >
                                <Button
                                    onClick={handleLaunch}
                                    size="lg"
                                    className="relative group h-14 md:h-16 px-10 md:px-12 rounded-full bg-white/95 text-black hover:bg-yellow-400 transition-all duration-500 overflow-hidden font-semibold tracking-[0.15em] text-xs md:text-sm uppercase shadow-2xl shadow-yellow-500/20"
                                >
                                    <span className="relative z-10 flex items-center gap-2 md:gap-3">
                                        Enter Experience
                                        <ArrowRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform duration-300" />
                                    </span>
                                    <motion.div
                                        className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-amber-400 translate-y-full group-hover:translate-y-0 transition-transform duration-400"
                                    />
                                </Button>
                            </motion.div>
                        </motion.div>
                    )}

                    {phase === "introducing" && (
                        <motion.div
                            key="introducing-phase"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.1, filter: "blur(20px)" }}
                            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                            className="relative flex flex-col items-center z-20"
                        >
                            <motion.div className="flex flex-col items-center gap-6">
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2, duration: 0.8 }}
                                    className="flex items-center gap-3 text-yellow-500/60"
                                >
                                    <div className="h-px w-8 bg-current" />
                                    <Sparkles className="w-4 h-4 animate-pulse" />
                                    <span className="text-[10px] font-semibold uppercase tracking-[0.4em]">Welcome</span>
                                    <div className="h-px w-8 bg-current" />
                                </motion.div>
                                <motion.h1 
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4, duration: 1 }}
                                    className="text-4xl md:text-7xl font-black text-white text-center tracking-tight px-4 leading-[1.1] max-w-4xl"
                                >
                                    <motion.span 
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 0.6 }}
                                        transition={{ delay: 0.6, duration: 0.8 }}
                                        className="block font-light italic mb-3 text-2xl md:text-4xl"
                                    >
                                        Introducing
                                    </motion.span>
                                    <motion.span 
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.8, duration: 0.8 }}
                                        className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-white to-yellow-300"
                                    >
                                        Ahsas on Web
                                    </motion.span>
                                </motion.h1>
                            </motion.div>
                        </motion.div>
                    )}

                    {phase === "branding" && (
                        <motion.div
                            key="branding-phase"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.05, filter: "blur(15px)" }}
                            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                            className="relative flex flex-col items-center z-20 w-full max-w-md px-6"
                        >
                            {/* Logo */}
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                                className="relative mb-6"
                            >
                                <img
                                    src="/logo-full.png"
                                    alt="Ahsas Logo"
                                    className="h-28 md:h-36 object-contain drop-shadow-[0_0_40px_rgba(234,179,8,0.25)]"
                                />
                            </motion.div>

                            {/* Letters */}
                            <div className="flex gap-2 md:gap-4 mb-6">
                                {["A", "H", "S", "A", "S"].map((letter, index) => (
                                    <motion.span
                                        key={index}
                                        initial={{ y: 60, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{
                                            duration: 0.8,
                                            delay: 0.2 + index * 0.08,
                                            ease: [0.22, 1, 0.36, 1],
                                        }}
                                        className="text-6xl md:text-8xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-500"
                                    >
                                        {letter}
                                    </motion.span>
                                ))}
                            </div>

                            {/* Tagline */}
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.8, duration: 0.8 }}
                                className="text-center w-full"
                            >
                                <div className="text-[10px] md:text-xs font-medium uppercase tracking-[0.5em] text-yellow-500/50 mb-6 ml-[0.5em]">
                                    Al Hasanath Students Association
                                </div>

                                {/* Progress */}
                                <div className="relative w-48 h-[2px] bg-white/10 mx-auto rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ scaleX: 0 }}
                                        animate={{ scaleX: progress / 100 }}
                                        style={{ originX: 0 }}
                                        className="absolute inset-0 bg-gradient-to-r from-yellow-500/80 to-yellow-400/60"
                                    />
                                </div>
                                <motion.div
                                    animate={{ opacity: [0.3, 0.7, 0.3] }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                    className="mt-3 text-[9px] uppercase tracking-[0.3em] text-white/30"
                                >
                                    Loading Experience
                                </motion.div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </AnimatePresence>
    );
}
