import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, BookOpen, User as UserIcon, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

interface Post {
    id: string;
    title: string;
    subtitle: string;
    author_name: string;
    cover_image_url: string;
    post_type: string;
    created_at: string;
}

export function BlogSection() {
    const [index, setIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const scrollRef = useRef<HTMLDivElement>(null);

    const { data: posts = [], isLoading } = useQuery({
        queryKey: ["home-blog-posts"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("posts")
                .select("id, title, subtitle, cover_image_url, post_type, created_at, created_by")
                .eq("is_published", true)
                .eq("post_type", "blog")
                .order("created_at", { ascending: false })
                .limit(6);

            if (error) throw error;

            // Map data to ensure it matches the Post interface
            return (data || []).map(post => ({
                ...post,
                author_name: "Ahsas Member", // Default since we don't have the direct join yet
            })) as Post[];
        },
    });

    // Auto-play logic
    useEffect(() => {
        if (isPaused || posts.length <= 1) return;

        const interval = setInterval(() => {
            setIndex((prevIndex) => (prevIndex + 1) % posts.length);
        }, 5000); // Change slide every 5 seconds

        return () => clearInterval(interval);
    }, [isPaused, posts.length]);

    const next = () => {
        setIndex((prevIndex) => (prevIndex + 1) % posts.length);
    };

    const prev = () => {
        setIndex((prevIndex) => (prevIndex - 1 + posts.length) % posts.length);
    };

    if (isLoading || posts.length === 0) {
        return null;
    }

    return (
        <section className="py-24 bg-gradient-to-b from-muted/30 to-background overflow-hidden">
            <div className="container mx-auto px-4">
                {/* Section Header */}
                <div className="flex flex-col items-center text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-4xl md:text-5xl font-black text-foreground tracking-tighter mb-4">
                            Students <span className="text-primary">Blog</span>
                        </h2>
                        <div className="h-1.5 w-20 bg-primary rounded-full mx-auto" />
                    </motion.div>
                </div>

                {/* Carousel Container */}
                <div
                    className="relative max-w-6xl mx-auto"
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                >
                    <div className="flex items-center justify-center gap-4 sm:gap-8">
                        {/* Viewport for slider */}
                        <div className="flex-1 overflow-visible">
                            <div className="flex justify-center items-center h-[450px] sm:h-[550px] relative">
                                <AnimatePresence mode="popLayout">
                                    {posts.map((post, i) => {
                                        // Calculate relative position to center
                                        const relativeIndex = i - index;
                                        const isActive = relativeIndex === 0;
                                        const isVisible = Math.abs(relativeIndex) <= 1;

                                        if (!isVisible) return null;

                                        return (
                                            <motion.div
                                                key={post.id}
                                                initial={{
                                                    opacity: 0,
                                                    scale: 0.8,
                                                    x: relativeIndex * 300,
                                                    zIndex: 0
                                                }}
                                                animate={{
                                                    opacity: isActive ? 1 : 0.6,
                                                    scale: isActive ? 1.05 : 0.85,
                                                    x: relativeIndex * (windowWidth < 640 ? 40 : 280),
                                                    zIndex: isActive ? 20 : 10,
                                                    filter: isActive ? "blur(0px)" : "blur(2px)",
                                                }}
                                                exit={{
                                                    opacity: 0,
                                                    scale: 0.8,
                                                    x: relativeIndex * 300
                                                }}
                                                transition={{
                                                    type: "spring",
                                                    stiffness: 260,
                                                    damping: 20,
                                                    opacity: { duration: 0.4 }
                                                }}
                                                className="absolute w-[280px] sm:w-[400px] aspect-[4/5] sm:aspect-[4/5]"
                                            >
                                                <Link to={`/blog/${post.id}`} className="block w-full h-full">
                                                    <div className="relative w-full h-full rounded-[40px] overflow-hidden shadow-2xl group transition-transform duration-500">
                                                        {/* Cover Image */}
                                                        <img
                                                            src={post.cover_image_url || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&q=80'}
                                                            alt={post.title}
                                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                        />

                                                        {/* Overlay */}
                                                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

                                                        {/* Content */}
                                                        <div className="absolute inset-0 p-8 sm:p-10 flex flex-col justify-end">
                                                            <span className="text-xs sm:text-sm font-bold text-white/70 uppercase tracking-[0.2em] mb-3">
                                                                ARTICLE
                                                            </span>
                                                            <h3 className="text-2xl sm:text-3xl font-bold text-white leading-tight mb-4 group-hover:text-primary transition-colors line-clamp-2">
                                                                {post.title}
                                                            </h3>
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                                                                    <UserIcon className="w-4 h-4 text-white" />
                                                                </div>
                                                                <span className="text-sm font-medium text-white/80">
                                                                    {post.author_name || "Ahsas Member"}
                                                                </span>
                                                            </div>
                                                        </div>

                                                        {/* Glow Effect */}
                                                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                                                            <div className="absolute inset-0 bg-primary/10 mix-blend-overlay" />
                                                        </div>
                                                    </div>
                                                </Link>
                                            </motion.div>
                                        );
                                    })}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>

                    {/* Navigation Dots */}
                    <div className="flex justify-center items-center gap-3 mt-12 sm:mt-16">
                        {posts.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setIndex(i)}
                                className={cn(
                                    "w-2.5 h-2.5 rounded-full transition-all duration-300",
                                    index === i
                                        ? "bg-primary w-8"
                                        : "bg-primary/20 hover:bg-primary/40"
                                )}
                                aria-label={`Go to slide ${i + 1}`}
                            />
                        ))}
                    </div>

                    {/* Side Nav Buttons */}
                    <div className="absolute top-1/2 -translate-y-1/2 -left-4 sm:-left-20 z-30">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={prev}
                            className="w-12 h-12 rounded-full bg-background/50 backdrop-blur-md shadow-lg hover:bg-primary hover:text-white transition-all"
                        >
                            <ArrowLeft className="w-6 h-6" />
                        </Button>
                    </div>
                    <div className="absolute top-1/2 -translate-y-1/2 -right-4 sm:-right-20 z-30">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={next}
                            className="w-12 h-12 rounded-full bg-background/50 backdrop-blur-md shadow-lg hover:bg-primary hover:text-white transition-all"
                        >
                            <ArrowRight className="w-6 h-6" />
                        </Button>
                    </div>
                </div>

                {/* View All Button */}
                <div className="mt-16 text-center">
                    <Link to="/blog">
                        <Button variant="outline" className="rounded-full px-10 h-14 border-primary/20 hover:border-primary/50 text-base font-bold group">
                            Explore More Articles
                            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
}
