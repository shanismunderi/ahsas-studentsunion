import { motion } from "framer-motion";
import { ArrowRight, Calendar, MapPin, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const events = [
  {
    id: 1,
    title: "Annual Cultural Festival 2024",
    date: "March 15, 2024",
    time: "10:00 AM",
    location: "Main Auditorium",
    category: "Cultural",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&h=400&fit=crop",
  },
  {
    id: 2,
    title: "Leadership Summit",
    date: "April 5, 2024",
    time: "9:00 AM",
    location: "Conference Hall",
    category: "Workshop",
    image: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=600&h=400&fit=crop",
  },
  {
    id: 3,
    title: "Community Service Day",
    date: "April 20, 2024",
    time: "8:00 AM",
    location: "City Center",
    category: "Service",
    image: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=600&h=400&fit=crop",
  },
];

export function EventsPreview() {
  return (
    <section className="py-24 bg-muted/50">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12"
        >
          <div>
            <span className="text-sm font-semibold text-accent uppercase tracking-wider">
              Upcoming Events
            </span>
            <h2 className="mt-4 text-4xl md:text-5xl font-bold text-foreground">
              Join Our Activities
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-xl">
              Stay connected with our vibrant community through workshops, 
              cultural events, and service activities.
            </p>
          </div>
          <Link to="/news">
            <Button variant="outline" size="lg">
              View All Events
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </motion.div>

        {/* Events Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event, index) => (
            <motion.article
              key={event.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300"
            >
              {/* Image */}
              <div className="relative h-52 overflow-hidden">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-accent text-accent-foreground">
                    {event.category}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                  {event.title}
                </h3>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4 text-accent" />
                    {event.date}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4 text-accent" />
                    {event.time}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4 text-accent" />
                    {event.location}
                  </div>
                </div>
                <div className="mt-6">
                  <Link
                    to={`/news/${event.id}`}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-accent transition-colors"
                  >
                    Learn More
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
