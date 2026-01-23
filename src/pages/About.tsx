import { motion } from "framer-motion";
import { Sparkles, Heart, Leaf, Users } from "lucide-react";
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
  </Layout>
);

export default About;
