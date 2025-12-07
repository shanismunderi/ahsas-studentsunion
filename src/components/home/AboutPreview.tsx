import { motion } from "framer-motion";
import { ArrowRight, Target, Heart, Lightbulb, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import aboutImage from "@/assets/about-students.jpg";

const values = [
  {
    icon: Target,
    title: "Excellence",
    description: "Striving for the highest standards in all endeavors",
  },
  {
    icon: Heart,
    title: "Community",
    description: "Building lasting bonds and supporting each other",
  },
  {
    icon: Lightbulb,
    title: "Innovation",
    description: "Embracing new ideas and creative solutions",
  },
  {
    icon: Users,
    title: "Leadership",
    description: "Developing tomorrow's leaders today",
  },
];

export function AboutPreview() {
  return (
    <section className="py-24 bg-background relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Image Side */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-card-hover">
              <img
                src={aboutImage}
                alt="Ahsas students community"
                className="w-full h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent" />
            </div>
            {/* Floating Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="absolute -bottom-8 -right-8 bg-card rounded-2xl p-6 shadow-card-hover max-w-[260px]"
            >
              <div className="text-5xl font-bold text-primary">10+</div>
              <div className="text-muted-foreground mt-2">
                Years of nurturing student excellence
              </div>
            </motion.div>
          </motion.div>

          {/* Content Side */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-sm font-semibold text-accent uppercase tracking-wider">
              About Ahsas
            </span>
            <h2 className="mt-4 text-4xl md:text-5xl font-bold text-foreground">
              A Legacy of Excellence & Unity
            </h2>
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
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
            <div className="mt-10 grid grid-cols-2 gap-4">
              {values.map((value, index) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 * index }}
                  className="flex items-start gap-3"
                >
                  <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                    <value.icon className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">{value.title}</h4>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {value.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-10">
              <Link to="/about">
                <Button variant="default" size="lg">
                  Learn More About Us
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
