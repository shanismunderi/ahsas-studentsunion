import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown, ChevronUp, ArrowRight, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

const newsItems = [
  {
    id: 1,
    title: "Hashim Thangal Excellenci Award Ended",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&h=400&fit=crop",
  },
  {
    id: 2,
    title: "Annual Cultural Festival 2024",
    image: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=600&h=400&fit=crop",
  },
  {
    id: 3,
    title: "Community Service Day",
    image: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=600&h=400&fit=crop",
  },
];

const upcomingEvents = [
  {
    id: 1,
    title: "Mala-Mawilid conference",
    description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.",
    date: "On 2025 February 16 Wednesday",
    location: "At Hasanath Grand JUma masjid",
  },
  {
    id: 2,
    title: "Malayalima",
    description: "Annual malayalam literature event celebrating our rich cultural heritage.",
    date: "On 2025 March 10",
    location: "Main Auditorium",
  },
  {
    id: 3,
    title: "Documentary show",
    description: "A documentary screening on the history of Islamic education.",
    date: "On 2025 March 15",
    location: "Conference Hall",
  },
  {
    id: 4,
    title: "Poem Writing contest",
    description: "Inter-college poetry writing competition.",
    date: "On 2025 March 20",
    location: "Library Hall",
  },
  {
    id: 5,
    title: "Palestine discussion",
    description: "An open forum to discuss the humanitarian situation.",
    date: "On 2025 March 25",
    location: "Seminar Room",
  },
];

export function AboutPreview() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [expandedEvent, setExpandedEvent] = useState<number | null>(null);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % newsItems.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + newsItems.length) % newsItems.length);
  };

  const toggleEvent = (id: number) => {
    setExpandedEvent(expandedEvent === id ? null : id);
  };

  return (
    <section className="py-12 sm:py-16 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* News & Updates Slider */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-6">News & Updates</h2>
            
            <div className="relative rounded-2xl overflow-hidden shadow-card aspect-[4/3]">
              {/* Slider Images */}
              <div className="relative w-full h-full">
                {newsItems.map((item, index) => (
                  <div
                    key={item.id}
                    className={cn(
                      "absolute inset-0 transition-opacity duration-500",
                      index === currentSlide ? "opacity-100" : "opacity-0 pointer-events-none"
                    )}
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
                      <h3 className="text-lg sm:text-xl font-bold text-white">{item.title}</h3>
                    </div>
                  </div>
                ))}
              </div>

              {/* Navigation Arrows */}
              <button
                onClick={prevSlide}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-accent/90 text-white flex items-center justify-center hover:bg-accent transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-accent/90 text-white flex items-center justify-center hover:bg-accent transition-colors"
              >
                <ArrowRight className="w-5 h-5" />
              </button>

              {/* Dots */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
                {newsItems.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={cn(
                      "w-2 h-2 rounded-full transition-all",
                      index === currentSlide ? "bg-white w-6" : "bg-white/50"
                    )}
                  />
                ))}
              </div>
            </div>
          </motion.div>

          {/* Upcoming Events Accordion */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-6">Upcoming Events</h2>
            
            <div className="space-y-3">
              {upcomingEvents.map((event) => (
                <div
                  key={event.id}
                  className="border border-border rounded-xl overflow-hidden bg-card"
                >
                  <button
                    onClick={() => toggleEvent(event.id)}
                    className="w-full flex items-center justify-between p-4 text-left hover:bg-muted/50 transition-colors"
                  >
                    <span className="font-medium text-foreground text-sm sm:text-base pr-4">{event.title}</span>
                    {expandedEvent === event.id ? (
                      <ChevronUp className="w-5 h-5 text-primary shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-primary shrink-0" />
                    )}
                  </button>
                  
                  {expandedEvent === event.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="px-4 pb-4 border-t border-border"
                    >
                      <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
                        {event.description}
                      </p>
                      <div className="mt-3 space-y-1 text-sm">
                        <p className="text-foreground font-medium">{event.date}</p>
                        <p className="text-muted-foreground">{event.location}</p>
                      </div>
                    </motion.div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
