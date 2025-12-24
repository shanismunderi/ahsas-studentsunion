import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import logo from "/lovable-uploads/c8289fc4-78f6-43b7-b2e5-947c434bbeda.png";

export function HeroSection() {
  return (
    <section className="relative pt-28 sm:pt-36 lg:pt-40 pb-8 sm:pb-12 overflow-hidden bg-background">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 right-0 h-[60%] gradient-header opacity-10 -z-10" />
      <div className="absolute top-20 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* About Section Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-card rounded-3xl shadow-card p-6 sm:p-8 lg:p-10 relative overflow-hidden"
        >
          {/* Purple decorative background */}
          <div className="absolute top-0 left-0 w-full h-full opacity-5">
            <div className="absolute -top-20 -left-20 w-96 h-96 bg-primary rounded-full blur-3xl" />
          </div>

          <div className="grid lg:grid-cols-2 gap-8 items-center relative z-10">
            {/* Logo Side */}
            <div className="flex justify-center lg:justify-start">
              <motion.img
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                src={logo}
                alt="AHSAS Logo"
                className="w-40 h-40 sm:w-52 sm:h-52 lg:w-64 lg:h-64 object-contain drop-shadow-lg"
              />
            </div>

            {/* Content Side */}
            <div className="text-center lg:text-left">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary"
              >
                AHSAs, more than an union
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-4 text-sm sm:text-base text-muted-foreground leading-relaxed"
              >
                AHSAS is the student union of Darul Hasanath Islamic College, 
                dedicated to enhancing student life through meaningful programs, 
                academic support, cultural celebrations, and community initiatives. 
                With a focus on unity, leadership, and personal growth, AHSAS fosters 
                an inclusive environment where students can learn, lead, and make 
                lasting memories together.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-6"
              >
                <Link to="/about" className="text-primary font-medium hover:text-accent transition-colors inline-flex items-center gap-1 text-sm">
                  more about
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
