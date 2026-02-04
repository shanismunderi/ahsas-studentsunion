import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { Sparkles, ArrowRight, MousePointer2 } from "lucide-react";
import { Button } from "@/components/ui/button";

type IntroPhase = "launch" | "introducing" | "branding" | "hidden";

export function SiteIntro() {
    const [phase, setPhase] = useState<IntroPhase>("launch");
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const hasShown = sessionStorage.getItem("site-intro-shown");
        if (hasShown) {
            setPhase("hidden");
        }
    }, []);

    const handleLaunch = () => {
        setPhase("introducing");
        setTimeout(() => {
            setPhase("branding");
        }, 2000);

        // Progress simulation
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    return 100;
                }
                return prev + 1;
            });
        }, 50);

        setTimeout(() => {
            setPhase("hidden");
            sessionStorage.setItem("site-intro-shown", "true");
        }, 7500);
    };

    if (phase === "hidden") return null;

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key="intro-container"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] } }}
                className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#030508] overflow-hidden"
            >
                {/* Cinema Noise Overlay */}
                <div className="absolute inset-0 pointer-events-none z-[100] opacity-[0.03] mix-blend-overlay noise" />

                {/* Vignette */}
                <div className="absolute inset-0 pointer-events-none z-10 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]" />

                {/* Animated Background Gradients */}
                <div className="absolute inset-0 overflow-hidden">
                    <motion.div
                        animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.1, 0.15, 0.1],
                            x: [0, 50, 0],
                            y: [0, -50, 0],
                        }}
                        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                        className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] rounded-full blur-[120px] bg-primary/20"
                    />
                    <motion.div
                        animate={{
                            scale: [1.2, 1, 1.2],
                            opacity: [0.05, 0.1, 0.05],
                            x: [0, -50, 0],
                            y: [0, 50, 0],
                        }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        className="absolute -bottom-[20%] -right-[10%] w-[50%] h-[50%] rounded-full blur-[100px] bg-yellow-500/10"
                    />
                </div>

                <AnimatePresence mode="wait">
                    {phase === "launch" && (
                        <motion.div
                            key="launch-phase"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0, scale: 1.05, filter: "blur(20px)" }}
                            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                            className="relative flex flex-col items-center px-4 z-20"
                        >
                            <motion.div
                                initial={{ y: 30, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.4, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                                className="mb-14 text-center"
                            >
                                <motion.span
                                    initial={{ opacity: 0, filter: "blur(10px)" }}
                                    animate={{ opacity: 1, filter: "blur(0px)" }}
                                    transition={{ delay: 0.6, duration: 1.5 }}
                                    className="text-5xl md:text-7xl lg:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-yellow-100 via-yellow-400 to-yellow-700 block mb-8 leading-relaxed tracking-wide"
                                    style={{ fontFamily: "'Amiri', serif", direction: "rtl", textShadow: "0 0 50px rgba(234, 179, 8, 0.2)" }}
                                >
                                    إِنَّا فَتَحْنَا لَكَ فَتْحًا مُّبِينًا
                                </motion.span>
                                <motion.div
                                    initial={{ scaleX: 0 }}
                                    animate={{ scaleX: 1 }}
                                    transition={{ delay: 1, duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
                                    className="h-[1px] w-48 bg-gradient-to-r from-transparent via-yellow-500/40 to-transparent mx-auto"
                                />
                            </motion.div>

                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 1.2, duration: 1, ease: [0.22, 1, 0.36, 1] }}
                            >
                                <Button
                                    onClick={handleLaunch}
                                    size="lg"
                                    className="relative group h-16 px-12 rounded-full bg-white text-black hover:bg-yellow-400 transition-all duration-700 overflow-hidden font-bold tracking-[0.1em] text-sm uppercase"
                                >
                                    <span className="relative z-10 flex items-center gap-3">
                                        Enter Experience
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-500 ease-out" />
                                    </span>
                                    <motion.div
                                        className="absolute inset-0 bg-yellow-400 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[0.22, 1, 0.36, 1]"
                                    />
                                    <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                                </Button>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: [0, 0.5, 0] }}
                                transition={{ delay: 2, duration: 3, repeat: Infinity }}
                                className="absolute -bottom-24 flex flex-col items-center gap-2"
                            >
                                <MousePointer2 className="w-4 h-4 text-white/30" />
                                <span className="text-[10px] uppercase tracking-[0.3em] text-white/30 font-medium">Click to proceed</span>
                            </motion.div>
                        </motion.div>
                    )}

                    {phase === "introducing" && (
                        <motion.div
                            key="introducing-phase"
                            initial={{ opacity: 0, letterSpacing: "-0.05em" }}
                            animate={{ opacity: 1, letterSpacing: "0.02em" }}
                            exit={{ opacity: 0, filter: "blur(10px)", transition: { duration: 0.8 } }}
                            transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
                            className="relative flex flex-col items-center z-20"
                        >
                            <motion.div className="flex flex-col items-center gap-6">
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex items-center gap-3 text-yellow-500/60"
                                >
                                    <div className="h-px w-8 bg-current" />
                                    <Sparkles className="w-4 h-4 animate-pulse" />
                                    <span className="text-[10px] font-bold uppercase tracking-[0.5em]">Evolution</span>
                                    <div className="h-px w-8 bg-current" />
                                </motion.div>
                                <h1 className="text-5xl md:text-8xl font-black text-white text-center tracking-tight px-4 leading-[1] max-w-4xl">
                                    <span className="block opacity-50 font-light italic mb-2">Introducing</span>
                                    <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-white to-yellow-200 bg-[length:200%_auto] animate-shimmer">
                                        Ahsas on Web
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: "100%" }}
                                            transition={{ delay: 0.5, duration: 1.5 }}
                                            className="absolute -bottom-4 left-0 h-[2px] bg-gradient-to-r from-transparent via-yellow-500/50 to-transparent"
                                        />
                                    </span>
                                </h1>
                            </motion.div>
                        </motion.div>
                    )}

                    {phase === "branding" && (
                        <motion.div
                            key="branding-phase"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0, transition: { duration: 0.8 } }}
                            className="relative flex flex-col items-center z-20 w-full max-w-lg px-6"
                        >
                            {/* Logo with Glow Ring */}
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0, filter: "blur(20px)" }}
                                animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
                                transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
                                className="relative p-12 mb-8"
                            >
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                                    className="absolute inset-0 border border-yellow-500/10 rounded-full scale-150"
                                />
                                <motion.div
                                    animate={{ rotate: -360 }}
                                    transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
                                    className="absolute inset-0 border border-white/5 rounded-full scale-[1.7]"
                                />
                                <img
                                    src="/logo-full.png"
                                    alt="Ahsas Logo"
                                    className="h-36 md:h-44 object-contain relative z-10 drop-shadow-[0_0_50px_rgba(234,179,8,0.3)] filter brightness-110"
                                />
                            </motion.div>

                            {/* Staggered Branding */}
                            <div className="overflow-hidden flex flex-col items-center w-full">
                                <div className="flex gap-3 md:gap-6">
                                    {["A", "H", "S", "A", "S"].map((letter, index) => (
                                        <motion.span
                                            key={index}
                                            initial={{ y: 120, opacity: 0, rotateX: -90, filter: "blur(10px)" }}
                                            animate={{ y: 0, opacity: 1, rotateX: 0, filter: "blur(0px)" }}
                                            transition={{
                                                duration: 1.4,
                                                delay: index * 0.1,
                                                ease: [0.22, 1, 0.36, 1],
                                            }}
                                            className="text-8xl md:text-[11rem] font-black tracking-tighter"
                                            style={{
                                                color: "transparent",
                                                WebkitTextStroke: "1px rgba(255,255,255,0.05)",
                                                backgroundImage: "linear-gradient(to bottom, #ffffff 0%, #475569 100%)",
                                                WebkitBackgroundClip: "text",
                                                backgroundClip: "text",
                                                textShadow: "0 20px 40px rgba(0,0,0,0.5)"
                                            }}
                                        >
                                            {letter}
                                        </motion.span>
                                    ))}
                                </div>

                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 1, duration: 1.2 }}
                                    className="mt-6 text-center w-full"
                                >
                                    <div className="text-[10px] md:text-xs font-bold uppercase tracking-[1em] text-yellow-500/60 mb-8 ml-[1em]">
                                        Al Hasanath Students Association
                                    </div>

                                    {/* Premium Progress Bar */}
                                    <div className="relative w-64 h-px bg-white/5 mx-auto overflow-hidden rounded-full">
                                        <motion.div
                                            initial={{ scaleX: 0, originX: 0 }}
                                            animate={{ scaleX: progress / 100 }}
                                            className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-500/50 to-transparent"
                                        />
                                    </div>
                                    <motion.div
                                        animate={{ opacity: [0.4, 1, 0.4] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                        className="mt-2 text-[8px] uppercase tracking-[0.4em] text-white/20"
                                    >
                                        Initializing Core Modules
                                    </motion.div>
                                </motion.div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Premium Framing Lines */}
                <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: phase === "branding" ? "120px" : "0px" }}
                    transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute top-0 left-1/2 w-[1px] bg-gradient-to-b from-yellow-500/30 to-transparent"
                />
                <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: phase === "branding" ? "120px" : "0px" }}
                    transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute bottom-0 left-1/2 w-[1px] bg-gradient-to-t from-yellow-500/30 to-transparent"
                />

                {/* Lateral Accent Lines */}
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: phase === "branding" ? "100px" : "0px" }}
                    transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute top-1/2 left-0 h-[1px] bg-gradient-to-r from-yellow-500/20 to-transparent"
                />
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: phase === "branding" ? "100px" : "0px" }}
                    transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute top-1/2 right-0 h-[1px] bg-gradient-to-l from-yellow-500/20 to-transparent"
                />
            </motion.div>
        </AnimatePresence>
    );
}
