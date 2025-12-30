import { Link } from "react-router-dom";
import { GraduationCap, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

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
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
];

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      {/* Main Footer */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 lg:gap-12">
          {/* Brand */}
          <div className="space-y-4 sm:space-y-6 sm:col-span-2 lg:col-span-1">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-accent/20 flex items-center justify-center">
                <GraduationCap className="w-5 h-5 sm:w-7 sm:h-7 text-accent" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg sm:text-xl font-bold">Ahsas</span>
                <span className="text-[9px] sm:text-[10px] text-primary-foreground/70 uppercase tracking-widest">
                  Students Association
                </span>
              </div>
            </Link>
            <p className="text-xs sm:text-sm text-primary-foreground/70 leading-relaxed">
              Al Hasanath Students Association - Empowering students through community, 
              leadership, and excellence since establishment.
            </p>
            <div className="flex gap-2 sm:gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-primary-foreground/10 flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-all duration-300"
                >
                  <social.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-base sm:text-lg font-semibold mb-4 sm:mb-6">Quick Links</h4>
            <ul className="space-y-2 sm:space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-xs sm:text-sm text-primary-foreground/70 hover:text-accent transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Member Area */}
          <div>
            <h4 className="text-base sm:text-lg font-semibold mb-4 sm:mb-6">Member Area</h4>
            <ul className="space-y-2 sm:space-y-3">
              {memberLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-xs sm:text-sm text-primary-foreground/70 hover:text-accent transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-base sm:text-lg font-semibold mb-4 sm:mb-6">Contact Us</h4>
            <ul className="space-y-3 sm:space-y-4">
              <li className="flex items-start gap-2 sm:gap-3">
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-accent shrink-0 mt-0.5" />
                <span className="text-xs sm:text-sm text-primary-foreground/70">
                  Al Hasanath Campus, Main Road<br />City, State - 123456
                </span>
              </li>
              <li className="flex items-center gap-2 sm:gap-3">
                <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-accent shrink-0" />
                <a href="tel:+1234567890" className="text-xs sm:text-sm text-primary-foreground/70 hover:text-accent transition-colors">
                  +1 234 567 890
                </a>
              </li>
              <li className="flex items-center gap-2 sm:gap-3">
                <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-accent shrink-0" />
                <a href="mailto:contact@ahsas.org" className="text-xs sm:text-sm text-primary-foreground/70 hover:text-accent transition-colors break-all">
                  contact@ahsas.org
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-primary-foreground/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4">
            <p className="text-xs sm:text-sm text-primary-foreground/60 text-center sm:text-left">
              © {new Date().getFullYear()} Ahsas - Al Hasanath Students Association. All rights reserved.
            </p>
            <div className="flex gap-4 sm:gap-6">
              <Link to="/privacy" className="text-xs sm:text-sm text-primary-foreground/60 hover:text-accent transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-xs sm:text-sm text-primary-foreground/60 hover:text-accent transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
