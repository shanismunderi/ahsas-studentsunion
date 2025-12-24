import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, ThumbsUp } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

const blogPosts = [
  {
    id: 1,
    type: "ARTICLE",
    title: "Impact of human in nature",
    author: "Muhammed",
    likes: 156,
    image: "https://images.unsplash.com/photo-1505765050516-f72dcac9c60e?w=600&h=400&fit=crop",
  },
  {
    id: 2,
    type: "ARTICLE",
    title: "Impact of human in nature",
    author: "Muhammed",
    likes: 156,
    image: "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=600&h=400&fit=crop",
  },
  {
    id: 3,
    type: "ARTICLE",
    title: "Impact of human in nature",
    author: "Muhammed",
    likes: 156,
    image: "https://images.unsplash.com/photo-1439853949127-fa647f8a0f86?w=600&h=400&fit=crop",
  },
];

export function EventsPreview() {
  const [currentSlide, setCurrentSlide] = useState(1);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % blogPosts.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + blogPosts.length) % blogPosts.length);
  };

  const getSlideStyle = (index: number) => {
    const diff = index - currentSlide;
    if (diff === 0) {
      return "scale-100 z-20 opacity-100";
    } else if (diff === 1 || diff === -(blogPosts.length - 1)) {
      return "scale-90 z-10 opacity-70 translate-x-[60%]";
    } else if (diff === -1 || diff === (blogPosts.length - 1)) {
      return "scale-90 z-10 opacity-70 -translate-x-[60%]";
    }
    return "scale-75 z-0 opacity-0";
  };

  return (
    <section className="py-12 sm:py-16 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">Students Blog</h2>
        </motion.div>

        {/* Blog Carousel */}
        <div className="relative flex items-center justify-center h-[300px] sm:h-[350px] lg:h-[400px] overflow-hidden">
          {blogPosts.map((post, index) => (
            <motion.div
              key={post.id}
              className={cn(
                "absolute w-[280px] sm:w-[320px] lg:w-[380px] aspect-[4/3] rounded-2xl overflow-hidden shadow-lg transition-all duration-500 cursor-pointer",
                getSlideStyle(index)
              )}
              onClick={() => setCurrentSlide(index)}
            >
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
                <span className="text-[10px] sm:text-xs text-white/70 uppercase tracking-wider">{post.type}</span>
                <h3 className="text-sm sm:text-base lg:text-lg font-bold text-white mt-1">{post.title}</h3>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs sm:text-sm text-white/80">{post.author}</span>
                  <div className="flex items-center gap-1 text-white/80">
                    <ThumbsUp className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="text-xs sm:text-sm">{post.likes}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Carousel Dots */}
        <div className="flex justify-center gap-2 mt-6">
          {blogPosts.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={cn(
                "w-2 h-2 rounded-full transition-all",
                index === currentSlide ? "bg-primary w-6" : "bg-muted-foreground/30"
              )}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
