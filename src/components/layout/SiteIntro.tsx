import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export function SiteIntro() {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const hasShown = sessionStorage.getItem("site-intro-shown");
        if (hasShown) {
            setIsVisible(false);
            return;
        }

        const timer = setTimeout(() => {
            setIsVisible(false);
            sessionStorage.setItem("site-intro-shown", "true");
        }, 4500);

        return () => clearTimeout(timer);
    }, []);

    const logoVariants = {
        initial: { scale: 0.5, opacity: 0, filter: "brightness(0)" },
        animate: {
            scale: 1,
            opacity: 1,
            filter: "brightness(1)",
            transition: { duration: 1.5, ease: [0.22, 1, 0.36, 1] }
        }
    };

    const containerVariants = {
        exit: {
            opacity: 0,
            scale: 1.05,
            filter: "blur(40px)",
            transition: { duration: 1.2, ease: [0.7, 0, 0.3, 1] }
        }
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    variants={containerVariants}
                    initial="initial"
                    exit="exit"
                    className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#05070a] overflow-hidden"
                >
                    {/* Deep Background Depth */}
                    <div className="absolute inset-0 bg-[#05070a]" />
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.4 }}
                        className="absolute inset-0"
                        style={{
                            background: "radial-gradient(circle at 50% 50%, #1e293b 0%, #05070a 100%)"
                        }}
                    />

                    {/* Moving Gold Particles / Glow */}
                    <motion.div
                        animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.3, 0.5, 0.3]
                        }}
                        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute w-[800px] h-[800px] rounded-full blur-[120px]"
                        style={{
                            background: "radial-gradient(circle at center, rgba(234, 179, 8, 0.1) 0%, transparent 70%)"
                        }}
                    />

                    <div className="relative flex flex-col items-center">
                        {/* Logo with Glow Ring */}
                        <motion.div
                            variants={logoVariants}
                            initial="initial"
                            animate="animate"
                            className="relative p-8"
                        >
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-0 border border-yellow-500/10 rounded-full scale-150"
                            />
                            <img src="/logo-full.png" alt="Ahsas Logo" className="h-32 object-contain relative z-10 drop-shadow-[0_0_40px_rgba(234,179,8,0.4)]" />
                        </motion.div>

                        {/* Staggered Branding */}
                        <div className="mt-12 overflow-hidden flex flex-col items-center">
                            <div className="flex gap-4">
                                {["A", "H", "S", "A", "S"].map((letter, index) => (
                                    <motion.span
                                        key={index}
                                        initial={{ y: 80, opacity: 0, rotateX: -90 }}
                                        animate={{ y: 0, opacity: 1, rotateX: 0 }}
                                        transition={{
                                            duration: 1,
                                            delay: 0.8 + index * 0.12,
                                            ease: [0.215, 0.61, 0.355, 1],
                                        }}
                                        className="text-7xl md:text-9xl font-black tracking-tight"
                                        style={{
                                            color: "transparent",
                                            WebkitTextStroke: "1px rgba(255,255,255,0.1)",
                                            backgroundImage: "linear-gradient(to bottom, #ffffff 0%, #94a3b8 100%)",
                                            WebkitBackgroundClip: "text",
                                            backgroundClip: "text"
                                        }}
                                    >
                                        {letter}
                                    </motion.span>
                                ))}
                            </div>

                            {/* Tagline Fade In */}
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 1.8, duration: 1 }}
                                className="mt-8 text-center"
                            >
                                <div className="text-[10px] md:text-xs font-bold uppercase tracking-[0.8em] text-yellow-500/80 mb-2">
                                    Al Hasanath Students Association
                                </div>
                                <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-yellow-500/30 to-transparent" />
                            </motion.div>
                        </div>
                    </div>

                    {/* Premium Framing Lines */}
                    <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: "100px" }}
                        transition={{ delay: 2, duration: 1.5, ease: "easeOut" }}
                        className="absolute top-0 left-1/2 w-[1px] bg-gradient-to-b from-yellow-500/40 to-transparent"
                    />
                    <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: "100px" }}
                        transition={{ delay: 2, duration: 1.5, ease: "easeOut" }}
                        className="absolute bottom-0 left-1/2 w-[1px] bg-gradient-to-t from-yellow-500/40 to-transparent"
                    />
                </motion.div>
            )}
        </AnimatePresence>
    );
}
