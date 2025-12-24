import { Link } from "react-router-dom";
import { Mail, Phone, Facebook, Instagram, Youtube } from "lucide-react";
import logo from "/lovable-uploads/c8289fc4-78f6-43b7-b2e5-947c434bbeda.png";

const usefulLinks = [
  { name: "Student Login", href: "/login" },
  { name: "News & Events", href: "/news" },
  { name: "Subwings", href: "/about" },
  { name: "Featured Articles", href: "/blog" },
];

const socialLinks = [
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: "X", href: "#", label: "X" },
  { icon: Youtube, href: "#", label: "YouTube" },
  { icon: Instagram, href: "#", label: "Instagram" },
];

export function Footer() {
  return (
    <footer className="bg-primary">
      {/* Main Footer */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 items-start">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <img 
              src={logo} 
              alt="AHSAS Logo" 
              className="w-16 h-16 sm:w-20 sm:h-20 object-contain"
            />
            <div className="flex flex-col">
              <span className="text-xl sm:text-2xl font-bold text-primary-foreground">
                AHSAS
              </span>
              <span className="text-[9px] sm:text-[10px] text-primary-foreground/80 font-medium uppercase tracking-wide leading-tight">
                AL HASANATH<br />STUDENTS<br />ASSOCIATION
              </span>
            </div>
          </div>

          {/* Useful Links */}
          <div>
            <h4 className="text-sm font-semibold text-primary-foreground/70 mb-4">Useful links</h4>
            <ul className="space-y-2">
              {usefulLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-primary-foreground hover:text-accent transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-sm font-semibold text-primary-foreground/70 mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary-foreground/70 shrink-0" />
                <a href="mailto:dhicahsas@gmail.com" className="text-sm text-primary-foreground hover:text-accent transition-colors">
                  dhicahsas@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary-foreground/70 shrink-0" />
                <a href="tel:+916238781368" className="text-sm text-primary-foreground hover:text-accent transition-colors">
                  +91 6238 781 368
                </a>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div className="flex justify-start lg:justify-end">
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center text-primary-foreground hover:bg-accent hover:text-accent-foreground transition-all duration-300"
                >
                  {social.icon === "X" ? (
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  ) : (
                    <social.icon className="w-5 h-5" />
                  )}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-primary-foreground/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-xs sm:text-sm text-primary-foreground/60 text-center">
            Copyright ©{new Date().getFullYear()} AHSAs. All rights reserved
          </p>
        </div>
      </div>
    </footer>
  );
}
