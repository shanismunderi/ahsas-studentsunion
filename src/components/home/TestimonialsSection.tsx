import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const testimonials = [
  {
    id: 1,
    name: "Ahmed Khan",
    role: "Alumni, Batch 2020",
    quote: "Ahsas gave me the platform to grow as a leader. The connections I made here have shaped my career and personal growth.",
    avatar: "AK",
  },
  {
    id: 2,
    name: "Fatima Zahra",
    role: "Current Member",
    quote: "Being part of this community has been transformative. The events, workshops, and mentorship opportunities are invaluable.",
    avatar: "FZ",
  },
  {
    id: 3,
    name: "Mohammed Rashid",
    role: "Alumni, Batch 2018",
    quote: "The skills I developed through Ahsas activities helped me secure my dream job. Forever grateful for this association.",
    avatar: "MR",
  },
  {
    id: 4,
    name: "Ayesha Siddiqui",
    role: "Executive Member",
    quote: "Ahsas is more than an organization - it's a family that supports each other through every challenge and celebration.",
    avatar: "AS",
  },
];

export function TestimonialsSection() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const next = () => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % testimonials.length);
  };

  const prev = () => {
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
    }),
  };

  return (
    <section className="py-16 sm:py-24 bg-gradient-to-b from-background to-secondary/30 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 sm:mb-16"
        >
          <span className="inline-block px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-accent/10 text-accent text-xs sm:text-sm font-medium mb-3 sm:mb-4">
            Testimonials
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-3 sm:mb-4">
            What Our Members Say
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto px-4">
            Hear from the voices that make Ahsas special — our incredible members and alumni.
          </p>
        </motion.div>

        <div className="relative max-w-4xl mx-auto">
          {/* Quote Icon */}
          <div className="absolute -top-6 sm:-top-8 left-1/2 -translate-x-1/2 w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-accent/20 flex items-center justify-center">
            <Quote className="w-6 h-6 sm:w-8 sm:h-8 text-accent" />
          </div>

          {/* Testimonial Card */}
          <div className="relative bg-card rounded-2xl sm:rounded-3xl shadow-card p-6 sm:p-8 md:p-12 pt-10 sm:pt-12 min-h-[280px] sm:min-h-[300px] flex items-center">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={current}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3 }}
                className="w-full text-center"
              >
                <p className="text-base sm:text-lg md:text-xl text-foreground leading-relaxed mb-6 sm:mb-8 px-4 sm:px-8">
                  "{testimonials[current].quote}"
                </p>
                <div className="flex items-center justify-center gap-3 sm:gap-4">
                  <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm sm:text-lg">
                    {testimonials[current].avatar}
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-sm sm:text-base text-foreground">
                      {testimonials[current].name}
                    </p>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      {testimonials[current].role}
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 rounded-full w-8 h-8 sm:w-10 sm:h-10"
              onClick={prev}
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 rounded-full w-8 h-8 sm:w-10 sm:h-10"
              onClick={next}
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </Button>
          </div>

          {/* Dots */}
          <div className="flex justify-center gap-1.5 sm:gap-2 mt-4 sm:mt-6">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setDirection(index > current ? 1 : -1);
                  setCurrent(index);
                }}
                className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full transition-all duration-300 ${
                  index === current
                    ? "bg-accent w-6 sm:w-8"
                    : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
