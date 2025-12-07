import { motion } from "framer-motion";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { Calendar, User, ArrowRight, Clock } from "lucide-react";
import { Link } from "react-router-dom";

const blogPosts = [
  {
    id: 1,
    title: "5 Leadership Lessons Every Student Should Learn",
    excerpt: "Discover the essential leadership qualities that will help you succeed in your academic and professional journey.",
    author: "Ahmed Al-Rahman",
    date: "March 10, 2024",
    readTime: "5 min read",
    category: "Leadership",
    image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&h=500&fit=crop",
  },
  {
    id: 2,
    title: "Building a Strong Community: The Ahsas Way",
    excerpt: "How our association has built a thriving community and what other organizations can learn from our approach.",
    author: "Fatima Hassan",
    date: "March 5, 2024",
    readTime: "7 min read",
    category: "Community",
    image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&h=500&fit=crop",
  },
  {
    id: 3,
    title: "The Power of Volunteering: Stories from Our Members",
    excerpt: "Hear inspiring stories from members who have transformed lives through community service.",
    author: "Sara Mohammed",
    date: "February 28, 2024",
    readTime: "6 min read",
    category: "Service",
    image: "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=800&h=500&fit=crop",
  },
  {
    id: 4,
    title: "Balancing Academics and Extracurriculars",
    excerpt: "Practical tips for managing your time effectively while staying active in student organizations.",
    author: "Omar Khalid",
    date: "February 20, 2024",
    readTime: "4 min read",
    category: "Tips",
    image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&h=500&fit=crop",
  },
];

const Blog = () => {
  const featuredPost = blogPosts[0];
  const otherPosts = blogPosts.slice(1);

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

      {/* Featured Post */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.article
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid lg:grid-cols-2 gap-8 bg-card rounded-3xl overflow-hidden shadow-card-hover"
          >
            <div className="relative h-72 lg:h-auto overflow-hidden">
              <img
                src={featuredPost.image}
                alt={featuredPost.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4">
                <span className="px-4 py-2 rounded-full text-sm font-semibold bg-accent text-accent-foreground">
                  Featured
                </span>
              </div>
            </div>
            <div className="p-8 lg:p-12 flex flex-col justify-center">
              <span className="text-sm font-semibold text-accent uppercase tracking-wider">
                {featuredPost.category}
              </span>
              <h2 className="mt-4 text-3xl md:text-4xl font-bold text-foreground">
                {featuredPost.title}
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">{featuredPost.excerpt}</p>
              <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  {featuredPost.author}
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {featuredPost.date}
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {featuredPost.readTime}
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

      {/* Other Posts */}
      <section className="py-16 bg-muted/50">
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
                className="group bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300"
              >
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-primary text-primary-foreground">
                      {post.category}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="mt-3 text-muted-foreground line-clamp-2">{post.excerpt}</p>
                  <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      {post.author}
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      {post.readTime}
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
    </PublicLayout>
  );
};

export default Blog;
