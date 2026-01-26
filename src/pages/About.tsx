import { motion } from "framer-motion";
import { Sparkles, Heart, Leaf, Users, Instagram } from "lucide-react";
import { Layout } from "@/components/layout/Layout";

const values = [
  { icon: Sparkles, title: "Self-Expression", description: "We believe everyone deserves to wear their identity with pride." },
  { icon: Heart, title: "Creator Culture", description: "Built by creators, for creators. We understand your vision." },
  { icon: Leaf, title: "Sustainability", description: "Eco-friendly inks and organic cotton. Fashion with conscience." },
  { icon: Users, title: "Community", description: "Join thousands of creators who trust G-KAP for their merch." },
];

const About = () => (
  <Layout>
    <section className="bg-gradient-mesh py-20">
      <div className="section-container text-center">
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-5xl font-display font-bold mb-6">
          About <span className="text-gradient-primary">G-KAP</span>
        </motion.h1>
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-lg text-muted-foreground max-w-2xl mx-auto">
          G-KAP was founded to empower people to wear their identity through high-quality custom apparel. We're more than a printing company — we're a creative partner for dreamers and doers.
        </motion.p>
      </div>
    </section>

    <section className="py-20">
      <div className="section-container">
        <h2 className="text-3xl font-display font-bold text-center mb-12">Our Values</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((v, i) => (
            <motion.div key={v.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="bg-card rounded-2xl p-6 shadow-soft text-center">
              <div className="w-14 h-14 rounded-xl bg-coral-light flex items-center justify-center mx-auto mb-4">
                <v.icon className="w-7 h-7 text-coral" />
              </div>
              <h3 className="font-display font-semibold text-lg mb-2">{v.title}</h3>
              <p className="text-sm text-muted-foreground">{v.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* Instagram Feed Section */}
    <section className="py-20 bg-muted/30">
      <div className="section-container">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/10 to-pink-500/10 text-purple-600 dark:text-purple-400 text-sm font-medium mb-4"
          >
            <Instagram className="w-4 h-4" />
            <span>Follow Us</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl font-display font-bold mb-4"
          >
            @gkap_branding
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground max-w-xl mx-auto"
          >
            Stay updated with our latest designs, behind-the-scenes content, and community highlights.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="max-w-5xl mx-auto"
        >
          {/* Elfsight Instagram Feed Widget */}
          <div className="elfsight-app-468baced-e730-4e59-9476-dd3a429d256f" data-elfsight-app-lazy></div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center mt-8"
        >
          <a
            href="https://www.instagram.com/gkap_branding?igsh=MTM2ZGV2MDZ1aGxvZw%3D%3D&utm_source=qr"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium hover:shadow-lg transition-shadow"
          >
            <Instagram className="w-5 h-5" />
            Follow us on Instagram
          </a>
        </motion.div>
      </div>
    </section>
  </Layout>
);

export default About;
