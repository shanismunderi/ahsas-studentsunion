import { motion } from "framer-motion";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { Calendar, User, ArrowRight, Clock, Loader2, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

const Blog = () => {
  const { data: posts = [], isLoading } = useQuery({
    queryKey: ["public-posts", "blog"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("is_published", true)
        .eq("post_type", "blog")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const featuredPost = posts[0];
  const otherPosts = posts.slice(1);

  const estimateReadTime = (content: string) => {
    const wordsPerMinute = 200;
    const words = content.split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} min read`;
  };

  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="pt-32 pb-20 gradient-hero relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 right-10 w-64 h-64 bg-accent/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 left-20 w-48 h-48 bg-primary/30 rounded-full blur-3xl" />
        </div>
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <span className="text-sm font-semibold text-accent uppercase tracking-wider">
              Our Blog
            </span>
            <h1 className="mt-4 text-5xl md:text-6xl font-bold text-primary-foreground">
              Insights & <span className="text-accent">Stories</span>
            </h1>
            <p className="mt-6 text-xl text-primary-foreground/80">
              Explore articles, stories, and insights from our community members and leadership.
            </p>
          </motion.div>
        </div>
      </section>

      {isLoading ? (
        <section className="py-20">
          <div className="flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        </section>
      ) : posts.length === 0 ? (
        <section className="py-20">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
              <BookOpen className="w-12 h-12 text-muted-foreground" />
            </div>
            <h3 className="text-2xl font-semibold text-foreground mb-2">No blog posts yet</h3>
            <p className="text-muted-foreground">Check back soon for interesting articles!</p>
          </motion.div>
        </section>
      ) : (
        <>
          {/* Featured Post */}
          {featuredPost && (
            <section className="py-16 bg-background">
              <div className="container mx-auto px-4 lg:px-8">
                <motion.article
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="grid lg:grid-cols-2 gap-8 bg-card rounded-3xl overflow-hidden shadow-card-hover border border-border/50"
                >
                  <div className="relative h-72 lg:h-auto overflow-hidden bg-muted">
                    {featuredPost.cover_image_url ? (
                      <img
                        src={featuredPost.cover_image_url}
                        alt={featuredPost.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-accent/20">
                        <BookOpen className="w-20 h-20 text-muted-foreground/40" />
                      </div>
                    )}
                    <div className="absolute top-4 left-4">
                      <span className="px-4 py-2 rounded-full text-sm font-semibold bg-accent text-accent-foreground">
                        Featured
                      </span>
                    </div>
                  </div>
                  <div className="p-8 lg:p-12 flex flex-col justify-center">
                    {featuredPost.tags && featuredPost.tags.length > 0 && (
                      <span className="text-sm font-semibold text-accent uppercase tracking-wider">
                        {featuredPost.tags[0]}
                      </span>
                    )}
                    <h2 className="mt-4 text-3xl md:text-4xl font-bold text-foreground">
                      {featuredPost.title}
                    </h2>
                    {featuredPost.subtitle && (
                      <p className="mt-4 text-lg text-muted-foreground">{featuredPost.subtitle}</p>
                    )}
                    <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {format(new Date(featuredPost.created_at), "MMM dd, yyyy")}
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        {estimateReadTime(featuredPost.content)}
                      </div>
                    </div>
                    <div className="mt-8">
                      <Link
                        to={`/blog/${featuredPost.id}`}
                        className="inline-flex items-center gap-2 text-base font-semibold text-primary hover:text-accent transition-colors"
                      >
                        Read Article
                        <ArrowRight className="w-5 h-5" />
                      </Link>
                    </div>
                  </div>
                </motion.article>
              </div>
            </section>
          )}

          {/* Other Posts */}
          {otherPosts.length > 0 && (
            <section className="py-16 bg-muted/30">
              <div className="container mx-auto px-4 lg:px-8">
                <h2 className="text-3xl font-bold text-foreground mb-10">Latest Articles</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {otherPosts.map((post, index) => (
                    <motion.article
                      key={post.id}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
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
                            <BookOpen className="w-12 h-12 text-muted-foreground/40" />
                          </div>
                        )}
                        {post.tags && post.tags.length > 0 && (
                          <div className="absolute top-4 left-4">
                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-primary text-primary-foreground">
                              {post.tags[0]}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                          {post.title}
                        </h3>
                        {post.subtitle && (
                          <p className="mt-3 text-muted-foreground line-clamp-2">{post.subtitle}</p>
                        )}
                        <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            {format(new Date(post.created_at), "MMM dd, yyyy")}
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            {estimateReadTime(post.content)}
                          </div>
                        </div>
                        <div className="mt-6">
                          <Link
                            to={`/blog/${post.id}`}
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
              </div>
            </section>
          )}
        </>
      )}
    </PublicLayout>
  );
};

export default Blog;
