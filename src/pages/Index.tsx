import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import { FloatingHero } from "@/components/home/FloatingHero";
import { FeaturedCarousel } from "@/components/home/FeaturedCarousel";
import { ScrollingBanner } from "@/components/layout/ScrollingBanner";
import { StackedCollections } from "@/components/home/StackedCollections";

const steps = [
  {
    number: "01",
    title: "Choose",
    description: "Pick your style, fit, and color",
  },
  {
    number: "02",
    title: "Design",
    description: "Upload your logo or pick from our library",
  },
  {
    number: "03",
    title: "Print",
    description: "We print with premium DTG technology",
  },
  {
    number: "04",
    title: "Ship",
    description: "Fast delivery to your doorstep",
  },
];

const testimonials = [
  {
    name: "Alex Chen",
    role: "Content Creator",
    content:
      "G-KAP made merch for my channel that my community absolutely loves. The quality is insane!",
    rating: 5,
  },
  {
    name: "Maya Rodriguez",
    role: "Startup Founder",
    content:
      "We use G-KAP for all our company swag. Premium quality, quick turnaround, and our team loves wearing them.",
    rating: 5,
  },
  {
    name: "Jordan Kim",
    role: "Anime Fan",
    content:
      "Finally found a place that prints anime designs without looking cheap. The colors are so vibrant!",
    rating: 5,
  },
];

const Index = () => {
  return (
    <Layout>
      {/* HERO */}
      <FloatingHero />

      {/* FEATURED */}
          {/* BANNER */}
      <ScrollingBanner />
          <div className="mt-8">
            <FeaturedCarousel />
          </div>
          

      

      {/* COLLECTIONS */}
      {/* <StackedCollections /> */}

      {/* HOW IT WORKS */}
      <section className="py-20 bg-foreground text-background">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-display font-bold mb-4">
              How It Works
            </h2>
            <p className="text-background/70 max-w-2xl mx-auto">
              From idea to delivery in four simple steps
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-5xl font-display font-bold text-gradient-primary mb-4">
                  {step.number}
                </div>
                <h3 className="font-display font-semibold text-xl mb-2">
                  {step.title}
                </h3>
                <p className="text-background/70">{step.description}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link to="/customize">
              <Button variant="hero" size="xl" className="group">
                Start Creating
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-20">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-display font-bold mb-4">
              Loved by Creators
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              See what our community is saying about G-KAP
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-card rounded-2xl p-6 shadow-soft"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 fill-sunflower text-sunflower"
                    />
                  ))}
                </div>
                <p className="text-foreground mb-4">
                  "{testimonial.content}"
                </p>
                <div>
                  <p className="font-semibold">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {testimonial.role}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-mesh">
        <div className="section-container text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold mb-6">
              Ready to Wear Your Identity?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Perfect for creators, startups, college events, merch drops, and
              gifts.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/shop">
                <Button variant="hero" size="xl" className="group">
                  Shop Collection
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/customize">
                <Button variant="hero-outline" size="xl">
                  Design Your Own
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;