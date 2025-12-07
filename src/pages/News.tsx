import { useState } from "react";
import { motion } from "framer-motion";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { Calendar, MapPin, Clock, ArrowRight, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const categories = ["All", "Events", "News", "Announcements"];

const posts = [
  {
    id: 1,
    title: "Annual Cultural Festival 2024",
    excerpt: "Join us for the biggest celebration of the year featuring performances, competitions, and more.",
    date: "March 15, 2024",
    time: "10:00 AM",
    location: "Main Auditorium",
    category: "Events",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=500&fit=crop",
  },
  {
    id: 2,
    title: "Leadership Summit 2024",
    excerpt: "A transformative workshop designed to develop leadership skills and strategic thinking.",
    date: "April 5, 2024",
    time: "9:00 AM",
    location: "Conference Hall",
    category: "Events",
    image: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&h=500&fit=crop",
  },
  {
    id: 3,
    title: "New Scholarship Program Announced",
    excerpt: "Ahsas introduces merit-based scholarships for outstanding student members.",
    date: "March 1, 2024",
    category: "News",
    image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=500&fit=crop",
  },
  {
    id: 4,
    title: "Community Service Day",
    excerpt: "Join fellow members in giving back to our local community through various service activities.",
    date: "April 20, 2024",
    time: "8:00 AM",
    location: "City Center",
    category: "Events",
    image: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800&h=500&fit=crop",
  },
  {
    id: 5,
    title: "Member Registration Open",
    excerpt: "Applications are now open for new members. Don't miss this opportunity to join our family.",
    date: "February 20, 2024",
    category: "Announcements",
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&h=500&fit=crop",
  },
  {
    id: 6,
    title: "Sports Tournament Results",
    excerpt: "Congratulations to all participants in our annual inter-department sports tournament.",
    date: "February 15, 2024",
    category: "News",
    image: "https://images.unsplash.com/photo-1461896836934- voices?w=800&h=500&fit=crop",
  },
];

const News = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPosts = posts.filter((post) => {
    const matchesCategory = activeCategory === "All" || post.category === activeCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="pt-32 pb-20 gradient-hero relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 right-10 w-64 h-64 bg-accent/20 rounded-full blur-3xl" />
        </div>
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <span className="text-sm font-semibold text-accent uppercase tracking-wider">
              Stay Updated
            </span>
            <h1 className="mt-4 text-5xl md:text-6xl font-bold text-primary-foreground">
              News & <span className="text-accent">Events</span>
            </h1>
            <p className="mt-6 text-xl text-primary-foreground/80">
              Stay informed about the latest happenings, upcoming events, and important 
              announcements from Ahsas.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-background border-b border-border sticky top-20 z-40">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    activeCategory === category
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
            <div className="relative w-full md:w-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-full md:w-64"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Posts Grid */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4 lg:px-8">
          {filteredPosts.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post, index) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300"
                >
                  <div className="relative h-52 overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-accent text-accent-foreground">
                        {post.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="mt-3 text-muted-foreground line-clamp-2">{post.excerpt}</p>
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4 text-accent" />
                        {post.date}
                      </div>
                      {post.time && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="w-4 h-4 text-accent" />
                          {post.time}
                        </div>
                      )}
                      {post.location && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="w-4 h-4 text-accent" />
                          {post.location}
                        </div>
                      )}
                    </div>
                    <div className="mt-6">
                      <Link
                        to={`/news/${post.id}`}
                        className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-accent transition-colors"
                      >
                        Read More
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-xl text-muted-foreground">No posts found matching your criteria.</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => {
                  setActiveCategory("All");
                  setSearchQuery("");
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </section>
    </PublicLayout>
  );
};

export default News;
