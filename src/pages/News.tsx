import { useState } from "react";
import { motion } from "framer-motion";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { Calendar, MapPin, Clock, ArrowRight, Search, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

const categories = ["All", "event", "news", "announcement"];

const News = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ["public-posts", "news-events"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("is_published", true)
        .in("post_type", ["event", "news", "announcement"])
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const filteredPosts = posts.filter((post) => {
    const matchesCategory = activeCategory === "All" || post.post_type === activeCategory;
    const matchesSearch = 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getCategoryLabel = (type: string) => {
    const labels: Record<string, string> = {
      event: "Events",
      news: "News",
      announcement: "Announcements",
    };
    return labels[type] || type;
  };

  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="pt-32 pb-20 gradient-hero relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 right-10 w-64 h-64 bg-accent/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 left-10 w-48 h-48 bg-primary/30 rounded-full blur-3xl" />
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
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                  }`}
                >
                  {category === "All" ? "All" : getCategoryLabel(category)}
                </button>
              ))}
            </div>
            <div className="relative w-full md:w-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-full md:w-64 bg-background"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Posts Grid */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 lg:px-8">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : filteredPosts.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post, index) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 border border-border/50"
                >
                  <div className="relative h-52 overflow-hidden bg-muted">
                    {post.cover_image_url ? (
                      <img
                        src={post.cover_image_url}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-accent/20">
                        <Calendar className="w-16 h-16 text-muted-foreground/40" />
                      </div>
                    )}
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-accent text-accent-foreground">
                        {getCategoryLabel(post.post_type)}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    {post.subtitle && (
                      <p className="mt-2 text-muted-foreground line-clamp-2">{post.subtitle}</p>
                    )}
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4 text-accent" />
                        {format(new Date(post.created_at), "MMM dd, yyyy")}
                      </div>
                      {post.event_date && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="w-4 h-4 text-accent" />
                          Event: {format(new Date(post.event_date), "MMM dd, yyyy")}
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
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
                <Calendar className="w-12 h-12 text-muted-foreground" />
              </div>
              <h3 className="text-2xl font-semibold text-foreground mb-2">No posts found</h3>
              <p className="text-muted-foreground mb-6">
                {searchQuery ? "Try adjusting your search terms" : "Check back soon for updates!"}
              </p>
              {(searchQuery || activeCategory !== "All") && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setActiveCategory("All");
                    setSearchQuery("");
                  }}
                >
                  Clear Filters
                </Button>
              )}
            </motion.div>
          )}
        </div>
      </section>
    </PublicLayout>
  );
};

export default News;
