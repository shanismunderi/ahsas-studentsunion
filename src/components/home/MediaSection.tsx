import { motion } from "framer-motion";
import { Play, Youtube, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

const mediaItems = [
    {
        id: 1,
        type: "video",
        title: "Islam and Darwinism | Special Podcast",
        thumbnail: "https://img.youtube.com/vi/vLzAnjYgInE/maxresdefault.jpg",
        videoId: "vLzAnjYgInE",
        platform: "Youtube",
        icon: Youtube,
        link: "https://www.youtube.com/watch?v=vLzAnjYgInE"
    },
    {
        id: 2,
        type: "video",
        title: "Hasanath Arts Fest | Official Promo",
        thumbnail: "https://img.youtube.com/vi/7_pW5I3w7Gk/maxresdefault.jpg",
        videoId: "7_pW5I3w7Gk",
        platform: "Youtube",
        icon: Youtube,
        link: "https://www.youtube.com/watch?v=7_pW5I3w7Gk"
    },
    {
        id: 3,
        type: "video",
        title: "Darul Hasanath Documentary 2023",
        thumbnail: "https://img.youtube.com/vi/gS6Y3w0W1w8/maxresdefault.jpg",
        videoId: "gS6Y3w0W1w8",
        platform: "Youtube",
        icon: Youtube,
        link: "https://www.youtube.com/watch?v=gS6Y3w0W1w8"
    },
    {
        id: 4,
        type: "video",
        title: "AHSAs Media | Official Highlights",
        thumbnail: "https://img.youtube.com/vi/q_m-Wn-hX78/maxresdefault.jpg",
        videoId: "q_m-Wn-hX78",
        platform: "Youtube",
        icon: Youtube,
        link: "https://www.youtube.com/watch?v=q_m-Wn-hX78"
    }
];

export function MediaSection() {
    return (
        <section className="py-24 bg-background relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-16">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="max-w-2xl"
                    >
                        <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-bold tracking-wider uppercase mb-4">
                            Ahsas Media
                        </span>
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-foreground tracking-tighter">
                            Witness Our <span className="text-primary">Journey</span>
                        </h2>
                        <p className="mt-4 text-lg text-muted-foreground">
                            Explore our latest highlights, events, and community stories captured through the lens.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <a href="https://www.youtube.com/@dhicahsas" target="_blank" rel="noopener noreferrer">
                            <Button variant="outline" className="rounded-xl border-border px-8 group">
                                View Official Channel
                                <ExternalLink className="ml-2 w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                            </Button>
                        </a>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {mediaItems.map((item, index) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="group relative"
                        >
                            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden bg-muted border border-border/50">
                                {/* Image */}
                                <img
                                    src={item.thumbnail}
                                    alt={item.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />

                                {/* Overlays */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                                {/* Content */}
                                <div className="absolute inset-0 p-6 flex flex-col justify-end">
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-md flex items-center justify-center">
                                            <item.icon className="w-4 h-4 text-white" />
                                        </div>
                                        <span className="text-xs font-bold text-white/90 uppercase tracking-widest">
                                            {item.platform}
                                        </span>
                                    </div>
                                    <h3 className="text-lg font-bold text-white leading-tight mb-2 group-hover:text-primary transition-colors">
                                        {item.title}
                                    </h3>
                                </div>

                                {/* Interaction Button */}
                                <div
                                    className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 cursor-pointer"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        window.open(item.link, '_blank');
                                    }}
                                >
                                    <motion.div
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-primary-foreground shadow-2xl"
                                    >
                                        <Play className="w-6 h-6 fill-current ml-1" />
                                    </motion.div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

        </section>
    );
}

