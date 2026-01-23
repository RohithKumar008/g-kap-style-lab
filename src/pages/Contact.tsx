import { motion } from "framer-motion";
import { Mail, Phone, MapPin, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Layout } from "@/components/layout/Layout";

const faqs = [
  { q: "How long does printing take?", a: "Custom orders are printed within 48 hours and shipped immediately after." },
  { q: "What's your return policy?", a: "30-day hassle-free returns for unworn items in original packaging." },
  { q: "Do you offer bulk discounts?", a: "Yes! Orders of 10+ items get 15% off, 25+ get 25% off." },
  { q: "What print quality do you use?", a: "We use premium DTG (Direct-to-Garment) printing for vibrant, long-lasting colors." },
];

const Contact = () => (
  <Layout>
    <section className="bg-gradient-mesh py-16">
      <div className="section-container text-center">
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-5xl font-display font-bold mb-4">
          Get In <span className="text-gradient-primary">Touch</span>
        </motion.h1>
        <p className="text-muted-foreground">We'd love to hear from you</p>
      </div>
    </section>

    <section className="py-16">
      <div className="section-container">
        <div className="grid lg:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl font-display font-bold mb-6">Send us a message</h2>
            <form className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <Input placeholder="Your Name" />
                <Input type="email" placeholder="Email Address" />
              </div>
              <Input placeholder="Subject" />
              <Textarea placeholder="Your message..." className="min-h-[150px]" />
              <Button variant="hero" size="lg">Send Message</Button>
            </form>
          </div>
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-display font-bold mb-6">Contact Info</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-4"><Mail className="w-5 h-5 text-coral" /><span>hello@gkap.com</span></div>
                <div className="flex items-center gap-4"><Phone className="w-5 h-5 text-mint" /><span>+1 (555) 123-4567</span></div>
                <div className="flex items-center gap-4"><MapPin className="w-5 h-5 text-lavender" /><span>123 Creative Street, Design District</span></div>
              </div>
              <Button variant="mint" className="mt-4"><MessageCircle className="w-4 h-4 mr-2" />Chat on WhatsApp</Button>
            </div>
            <div id="faq">
              <h2 className="text-2xl font-display font-bold mb-4">FAQ</h2>
              <Accordion type="single" collapsible>
                {faqs.map((f, i) => (
                  <AccordionItem key={i} value={`item-${i}`}>
                    <AccordionTrigger>{f.q}</AccordionTrigger>
                    <AccordionContent>{f.a}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </div>
      </div>
    </section>
  </Layout>
);

export default Contact;
