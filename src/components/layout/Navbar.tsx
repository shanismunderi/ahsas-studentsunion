import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, GraduationCap, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
const navLinks = [{
  name: "Home",
  href: "/"
}, {
  name: "About",
  href: "/about"
}, {
  name: "News & Events",
  href: "/news"
}, {
  name: "Blog",
  href: "/blog"
}, {
  name: "Gallery",
  href: "/gallery"
}, {
  name: "Contact",
  href: "/contact"
}];
export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  useEffect(() => {
    setIsOpen(false);
  }, [location]);
  const isActive = (href: string) => {
    if (href === "/") return location.pathname === "/";
    return location.pathname.startsWith(href);
  };
  return <motion.header initial={{
    y: -100
  }} animate={{
    y: 0
  }} transition={{
    duration: 0.5
  }} className={cn("fixed top-0 left-0 right-0 z-50 transition-all duration-300", scrolled ? "bg-background/95 backdrop-blur-xl border-b border-border shadow-card" : "bg-transparent")}>
      <nav className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center shadow-card group-hover:shadow-gold transition-shadow duration-300">
                <GraduationCap className="w-7 h-7 text-accent" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-accent shadow-gold" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-foreground tracking-tight">
                Ahsas
              </span>
              <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">AL HASANATH STUDENTS ASSOCIATION</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map(link => <Link key={link.href} to={link.href} className={cn("px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200", isActive(link.href) ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground hover:bg-muted")}>
                {link.name}
              </Link>)}
          </div>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost" size="sm">
                Member Login
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="gold" size="sm">
                Join Ahsas
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors">
            {isOpen ? <X className="w-6 h-6 text-foreground" /> : <Menu className="w-6 h-6 text-foreground" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && <motion.div initial={{
          opacity: 0,
          height: 0
        }} animate={{
          opacity: 1,
          height: "auto"
        }} exit={{
          opacity: 0,
          height: 0
        }} transition={{
          duration: 0.2
        }} className="lg:hidden overflow-hidden">
              <div className="py-4 space-y-2 border-t border-border">
                {navLinks.map(link => <Link key={link.href} to={link.href} className={cn("block px-4 py-3 rounded-lg text-sm font-medium transition-all", isActive(link.href) ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground hover:bg-muted")}>
                    {link.name}
                  </Link>)}
                <div className="pt-4 space-y-2 border-t border-border mt-4">
                  <Link to="/login" className="block">
                    <Button variant="outline" className="w-full">
                      Member Login
                    </Button>
                  </Link>
                  <Link to="/login" className="block">
                    <Button variant="gold" className="w-full">
                      Join Ahsas
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>}
        </AnimatePresence>
      </nav>
    </motion.header>;
}