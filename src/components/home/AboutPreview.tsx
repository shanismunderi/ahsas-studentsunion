import { motion } from "framer-motion";
import { ArrowRight, Target, Heart, Lightbulb, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const values = [
  {
    icon: Target,
    title: "Excellence",
    description: "Striving for the highest standards in all endeavors"
  },
  {
    icon: Heart,
    title: "Community",
    description: "Building lasting bonds and supporting each other"
  },
  {
    icon: Lightbulb,
    title: "Innovation",
    description: "Embracing new ideas and creative solutions"
  },
  {
    icon: Users,
    title: "Leadership",
    description: "Developing tomorrow's leaders today"
  }
];

export function AboutPreview() {
  return (
    <section className="py-20 sm:py-32 bg-background relative overflow-hidden">
      {/* Subtle background elements */}
      <div className="absolute inset-0 pattern-dots opacity-20" />
      <div className="absolute top-0 left-0 w-96 h-96 bg-foreground/3 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-24">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xs font-medium text-muted-foreground uppercase tracking-[0.2em]"
          >
            About Ahsas
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-4 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground tracking-tight"
          >
            A Legacy of Excellence
          </motion.h2>
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mt-6 h-px w-24 bg-foreground/30 mx-auto"
          />
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image Side */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative order-2 lg:order-1"
          >
            <div className="relative">
              {/* Main image */}
              <div className="relative rounded-2xl overflow-hidden border border-border/50">
                <img
                  alt="Ahsas students community"
                  className="w-full h-[400px] sm:h-[500px] object-cover grayscale hover:grayscale-0 transition-all duration-700"
                  src="/lovable-uploads/c8289fc4-78f6-43b7-b2e5-947c434bbeda.png"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
              </div>
              
              {/* Floating stat card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="absolute -bottom-6 -right-6 sm:-bottom-8 sm:-right-8 bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-premium hidden sm:block"
              >
                <div className="text-4xl sm:text-5xl font-bold text-foreground">10+</div>
                <div className="text-sm text-muted-foreground mt-2 max-w-[140px]">
                  Years of nurturing excellence
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Content Side */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="order-1 lg:order-2"
          >
            <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed">
              Founded with a vision to empower students, Ahsas (Al Hasanath Students
              Association) has grown into a vibrant community that fosters academic
              excellence, leadership development, and lasting friendships.
            </p>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Our members are not just students — they are future leaders, innovators,
              and changemakers who carry the values of integrity, collaboration, and
              service wherever they go.
            </p>

            {/* Values Grid */}
            <div className="mt-10 sm:mt-12 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {values.map((value, index) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 * index }}
                  className="group"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-secondary border border-border/50 flex items-center justify-center shrink-0 group-hover:border-foreground/20 transition-colors">
                      <value.icon className="w-5 h-5 text-foreground/70" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">{value.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        {value.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-10 sm:mt-12">
              <Link to="/about">
                <Button variant="default" size="lg" className="group">
                  Learn More About Us
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
