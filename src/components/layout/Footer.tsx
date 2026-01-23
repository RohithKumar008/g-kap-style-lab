import { Link } from "react-router-dom";
import { Instagram, Twitter, Facebook, Youtube, Mail, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const footerLinks = {
  shop: [
    { name: "All Products", path: "/shop" },
    { name: "Anime Collection", path: "/shop?category=anime" },
    { name: "Streetwear", path: "/shop?category=streetwear" },
    { name: "Minimal Logos", path: "/shop?category=minimal" },
    { name: "New Arrivals", path: "/shop?sort=newest" },
  ],
  company: [
    { name: "About Us", path: "/about" },
    { name: "Contact", path: "/contact" },
    { name: "Size Guide", path: "/size-guide" },
    { name: "Sustainability", path: "/about#sustainability" },
  ],
  support: [
    { name: "FAQ", path: "/contact#faq" },
    { name: "Shipping & Returns", path: "/shipping" },
    { name: "Track Order", path: "/track-order" },
    { name: "Refund Policy", path: "/refund" },
  ],
  legal: [
    { name: "Privacy Policy", path: "/privacy" },
    { name: "Terms & Conditions", path: "/terms" },
  ],
};

const socialLinks = [
  { icon: Instagram, href: "https://instagram.com/gkap", label: "Instagram" },
  { icon: Twitter, href: "https://twitter.com/gkap", label: "Twitter" },
  { icon: Facebook, href: "https://facebook.com/gkap", label: "Facebook" },
  { icon: Youtube, href: "https://youtube.com/gkap", label: "YouTube" },
];

export const Footer = () => {
  return (
    <footer className="bg-foreground text-background">
      {/* Newsletter Section */}
      <div className="border-b border-background/10">
        <div className="section-container py-12 md:py-16">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h3 className="text-2xl md:text-3xl font-display font-bold mb-2">
                Join the G-KAP Crew
              </h3>
              <p className="text-background/70">
                Get 15% off your first order + exclusive drops & updates
              </p>
            </div>
            <div className="flex w-full max-w-md gap-2">
              <Input
                type="email"
                placeholder="Enter your email"
                className="bg-background/10 border-background/20 text-background placeholder:text-background/50 focus:border-primary"
              />
              <Button variant="hero" className="shrink-0">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="section-container py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 md:gap-12">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="inline-block mb-4">
              <span className="text-2xl font-display font-bold">
                G-<span className="text-gradient-primary">KAP</span>
              </span>
            </Link>
            <p className="text-background/70 text-sm mb-6">
              Your Design. Your Style. Your G-KAP. Premium custom-printed T-shirts for creators.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-primary hover:text-foreground transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h4 className="font-display font-semibold mb-4">Shop</h4>
            <ul className="space-y-2">
              {footerLinks.shop.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-background/70 hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-display font-semibold mb-4">Company</h4>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-background/70 hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="font-display font-semibold mb-4">Support</h4>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-background/70 hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-display font-semibold mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-background/70">
                <Mail className="w-4 h-4 mt-0.5 shrink-0" />
                <span>hello@gkap.com</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-background/70">
                <Phone className="w-4 h-4 mt-0.5 shrink-0" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-background/70">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                <span>123 Creative Street, Design District</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-background/10">
        <div className="section-container py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-background/50">
              © {new Date().getFullYear()} G-KAP. All rights reserved.
            </p>
            <div className="flex gap-6">
              {footerLinks.legal.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="text-sm text-background/50 hover:text-primary transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
