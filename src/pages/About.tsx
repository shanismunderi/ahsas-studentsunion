import { motion } from "framer-motion";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { Target, Heart, Lightbulb, Users, Award, Globe, BookOpen, Handshake } from "lucide-react";

const values = [
  {
    icon: Target,
    title: "Excellence",
    description: "We pursue the highest standards in academics, leadership, and character development.",
  },
  {
    icon: Heart,
    title: "Community",
    description: "We foster a supportive environment where every member feels valued and connected.",
  },
  {
    icon: Lightbulb,
    title: "Innovation",
    description: "We encourage creative thinking and embrace new ideas to solve challenges.",
  },
  {
    icon: Users,
    title: "Leadership",
    description: "We develop confident leaders who inspire and positively impact others.",
  },
  {
    icon: Award,
    title: "Integrity",
    description: "We uphold honesty and strong moral principles in all our actions.",
  },
  {
    icon: Globe,
    title: "Service",
    description: "We are committed to giving back to our community and making a difference.",
  },
];

const leadership = [
  {
    name: "Ahmed Al-Rahman",
    role: "President",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face",
  },
  {
    name: "Fatima Hassan",
    role: "Vice President",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop&crop=face",
  },
  {
    name: "Omar Khalid",
    role: "Secretary",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop&crop=face",
  },
  {
    name: "Sara Mohammed",
    role: "Treasurer",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face",
  },
];

const milestones = [
  { year: "2014", title: "Foundation", description: "Ahsas was established with 50 founding members" },
  { year: "2016", title: "First Annual Fest", description: "Successfully organized our first cultural festival" },
  { year: "2018", title: "500 Members", description: "Milestone of 500 active members reached" },
  { year: "2020", title: "Digital Transformation", description: "Launched online community and virtual events" },
  { year: "2023", title: "Recognition Award", description: "Received Best Student Association Award" },
];

const About = () => {
  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="pt-32 pb-20 gradient-hero relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 right-10 w-64 h-64 bg-accent/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 left-10 w-48 h-48 bg-teal/20 rounded-full blur-3xl" />
        </div>
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <span className="text-sm font-semibold text-accent uppercase tracking-wider">
              About Us
            </span>
            <h1 className="mt-4 text-5xl md:text-6xl font-bold text-primary-foreground">
              Our Story & <span className="text-accent">Mission</span>
            </h1>
            <p className="mt-6 text-xl text-primary-foreground/80">
              Ahsas - Al Hasanath Students Association has been empowering students and building 
              leaders for over a decade. Learn about our journey and values.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-card rounded-3xl p-10 shadow-card"
            >
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                <BookOpen className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-3xl font-bold text-foreground">Our Mission</h2>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                To create a nurturing environment where students can discover their potential, 
                develop leadership skills, and contribute meaningfully to society while building 
                lifelong connections with fellow members.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-primary rounded-3xl p-10 shadow-card"
            >
              <div className="w-16 h-16 rounded-2xl bg-accent/20 flex items-center justify-center mb-6">
                <Handshake className="w-8 h-8 text-accent" />
              </div>
              <h2 className="text-3xl font-bold text-primary-foreground">Our Vision</h2>
              <p className="mt-4 text-lg text-primary-foreground/80 leading-relaxed">
                To be the leading student association that shapes confident, compassionate, 
                and capable leaders who make a positive impact in their communities and beyond.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 bg-muted/50">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-sm font-semibold text-accent uppercase tracking-wider">
              Our Values
            </span>
            <h2 className="mt-4 text-4xl md:text-5xl font-bold text-foreground">
              What We Stand For
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-card rounded-2xl p-8 shadow-card hover:shadow-card-hover transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center mb-6">
                  <value.icon className="w-7 h-7 text-accent" />
                </div>
                <h3 className="text-xl font-bold text-foreground">{value.title}</h3>
                <p className="mt-3 text-muted-foreground">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-sm font-semibold text-accent uppercase tracking-wider">
              Leadership
            </span>
            <h2 className="mt-4 text-4xl md:text-5xl font-bold text-foreground">
              Meet Our Team
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Our dedicated leadership team works tirelessly to serve our members and uphold our values.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {leadership.map((person, index) => (
              <motion.div
                key={person.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center group"
              >
                <div className="relative w-48 h-48 mx-auto rounded-3xl overflow-hidden shadow-card group-hover:shadow-card-hover transition-all duration-300">
                  <img
                    src={person.image}
                    alt={person.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <h3 className="mt-6 text-xl font-bold text-foreground">{person.name}</h3>
                <p className="mt-1 text-accent font-medium">{person.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-24 bg-muted/50">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-sm font-semibold text-accent uppercase tracking-wider">
              Our Journey
            </span>
            <h2 className="mt-4 text-4xl md:text-5xl font-bold text-foreground">
              Milestones
            </h2>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            {milestones.map((milestone, index) => (
              <motion.div
                key={milestone.year}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="flex gap-8 mb-12 last:mb-0"
              >
                <div className="shrink-0 w-20 text-right">
                  <span className="text-2xl font-bold text-accent">{milestone.year}</span>
                </div>
                <div className="relative flex-1 pb-12 border-l-2 border-accent/30 pl-8 last:pb-0">
                  <div className="absolute left-0 top-1 w-4 h-4 rounded-full bg-accent -translate-x-[9px]" />
                  <h3 className="text-xl font-bold text-foreground">{milestone.title}</h3>
                  <p className="mt-2 text-muted-foreground">{milestone.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </PublicLayout>
  );
};

export default About;
