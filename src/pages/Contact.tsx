import { motion } from "framer-motion";
import { Mail, Phone, MapPin, MessageCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Layout } from "@/components/layout/Layout";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const faqs = [
  { q: "How long does printing take?", a: "Custom orders are printed within 48 hours and shipped immediately after." },
  { 
    q: "Do you offer bulk discounts?", 
    a: "Yes, we do! We love working on large orders for corporate events, college fests, startups, and family gatherings. Our pricing is designed to be the more you print, the more you save.\n\nWe offer tiered discounts based on the total number of units in your order:\n\n• Small Batch (10–25 units): 5% off\n• Team Batch (26–50 units): 10% off\n• Event Batch (51–100 units): 15% off\n• Enterprise Batch (100+ units): Custom wholesale pricing" 
  },
  { q: "How long will it take to get my order?", a: "For most customers in major cities, you can expect your G-KAP package within 5 to 8 business days from the date of order." },
  { q: "What print quality do you use?", a: "We use premium DTG (Direct-to-Garment) printing for vibrant, long-lasting colors." },
];

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          access_key: "dcb04fc9-224c-41ed-8e6b-39db90a52ce6",
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Message Sent!",
          description: "Thank you for reaching out. We'll get back to you soon.",
          className: "bg-green-500 text-white",
        });
        setFormData({
          name: "",
          email: "",
          subject: "",
          message: "",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to send message. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while sending the message.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
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
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <Input
                  placeholder="Your Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
                <Input
                  type="email"
                  placeholder="Email Address"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <Input
                placeholder="Subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
              />
              <Textarea
                placeholder="Your message..."
                name="message"
                value={formData.message}
                onChange={handleChange}
                className="min-h-[150px]"
                required
              />
              <Button variant="hero" size="lg" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Send Message"
                )}
              </Button>
            </form>
          </div>
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-display font-bold mb-6">Contact Info</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-4"><Mail className="w-5 h-5 text-coral" /><span>gkapprints@gmail.com</span></div>
                <div className="flex items-center gap-4"><Phone className="w-5 h-5 text-mint" /><span>7287980727</span></div>
                <div className="flex items-start gap-4"><MapPin className="w-5 h-5 text-lavender mt-1 shrink-0" /><span>Padmavathi colony, hayathnagar hyderabad 501505</span></div>
              </div>
              <Button 
                variant="mint" 
                className="mt-4"
                onClick={() => window.open("https://wa.me/917287980727?text=Hello%20I%20want%20to%20know%20about%20the%20business", "_blank")}
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Chat on WhatsApp
              </Button>
            </div>
            <div id="faq">
              <h2 className="text-2xl font-display font-bold mb-4">FAQ</h2>
              <Accordion type="single" collapsible>
                {faqs.map((f, i) => (
                  <AccordionItem key={i} value={`item-${i}`}>
                    <AccordionTrigger>{f.q}</AccordionTrigger>
                    <AccordionContent className="whitespace-pre-line">{f.a}</AccordionContent>
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
};

export default Contact;
