import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, ArrowUpRight } from "lucide-react";

const quickLinks = [
  { name: "Home", href: "/" },
  { name: "About Us", href: "/about" },
  { name: "News & Events", href: "/news" },
  { name: "Gallery", href: "/gallery" },
  { name: "Contact", href: "/contact" },
];

const memberLinks = [
  { name: "Member Login", href: "/login" },
  { name: "My Dashboard", href: "/dashboard" },
  { name: "My Profile", href: "/dashboard/profile" },
  { name: "Achievements", href: "/dashboard/achievements" },
];

const socialLinks = [
  { icon: Instagram, href: "https://instagram.com/dhic_ahsas", label: "Instagram" },
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
];

export function Footer() {
  return (
    <footer className="bg-card border-t border-border">
      {/* Main Footer */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          {/* Brand */}
          <div className="space-y-6 sm:col-span-2 lg:col-span-1">
            <Link to="/" className="flex items-center gap-3">
              <img src="/logo.png" alt="Ahsas Logo" className="w-12 h-12 object-contain" />
              <div className="flex flex-col">
                <span className="text-xl font-bold text-foreground">AHSAs</span>
                <span className="text-[10px] text-muted-foreground uppercase tracking-[0.2em]">
                  Al Hasanath Students Association
                </span>
              </div>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Al Hasanath Students Association - Empowering students through community,
              leadership, and excellence since establishment.
            </p>
            <div className="flex gap-2">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-10 h-10 rounded-xl bg-secondary border border-border/50 flex items-center justify-center hover:bg-foreground hover:text-background hover:border-foreground transition-all duration-300"
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="group flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <span>{link.name}</span>
                    <ArrowUpRight className="w-3 h-3 opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Member Area */}
          <div>
            <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-6">Member Area</h4>
            <ul className="space-y-3">
              {memberLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="group flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <span>{link.name}</span>
                    <ArrowUpRight className="w-3 h-3 opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-6">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                </div>
                <span className="text-sm text-muted-foreground leading-relaxed">
                  Darul Hasanath Islamic College, Kannadiparamba,<br />
                  Niduvat, P.O Narath, Kannur, Kerala - 670601
                </span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                </div>
                <a href="tel:+916238781368" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  +91 6238 781 368
                </a>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                </div>
                <a href="mailto:dhicahsas@gmail.com" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  dhicahsas@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-xs text-muted-foreground text-center sm:text-left">
              © {new Date().getFullYear()} AHSAs - Al Hasanath Students Association. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link to="/privacy" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
