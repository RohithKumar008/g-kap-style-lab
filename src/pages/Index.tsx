import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, Truck, Shield, Palette, Zap, Star, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import heroImage from "@/assets/hero-tshirt.jpg";
import animeCollection from "@/assets/collection-anime.jpg";
import streetwearCollection from "@/assets/collection-streetwear.jpg";
import minimalCollection from "@/assets/collection-minimal.jpg";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const features = [
  {
    icon: Zap,
    title: "Fast Printing",
    description: "Your custom designs printed and shipped within 48 hours",
    color: "bg-coral-light text-coral"
  },
  {
    icon: Shield,
    title: "Premium Quality",
    description: "100% organic cotton, ethically sourced and pre-shrunk",
    color: "bg-mint-light text-mint"
  },
  {
    icon: Palette,
    title: "Vibrant Colors",
    description: "Advanced DTG printing for colors that pop and last",
    color: "bg-lavender-light text-lavender"
  },
  {
    icon: Sparkles,
    title: "Long-Lasting",
    description: "Wash after wash, your print stays crisp and bold",
    color: "bg-sunflower-light text-sunflower"
  }
];

const collections = [
  {
    title: "Anime Series",
    description: "Inspired by your favorite characters",
    image: animeCollection,
    href: "/shop?category=anime",
    color: "from-coral/80 to-coral/20"
  },
  {
    title: "Streetwear",
    description: "Clean cuts, bold statements",
    image: streetwearCollection,
    href: "/shop?category=streetwear",
    color: "from-foreground/80 to-foreground/20"
  },
  {
    title: "Minimal Logos",
    description: "Less is more, always",
    image: minimalCollection,
    href: "/shop?category=minimal",
    color: "from-mint/80 to-mint/20"
  }
];

const steps = [
  { number: "01", title: "Choose", description: "Pick your style, fit, and color" },
  { number: "02", title: "Design", description: "Upload your logo or pick from our library" },
  { number: "03", title: "Print", description: "We print with premium DTG technology" },
  { number: "04", title: "Ship", description: "Fast delivery to your doorstep" }
];

const testimonials = [
  {
    name: "Alex Chen",
    role: "Content Creator",
    content: "G-KAP made merch for my channel that my community absolutely loves. The quality is insane!",
    rating: 5
  },
  {
    name: "Maya Rodriguez",
    role: "Startup Founder",
    content: "We use G-KAP for all our company swag. Premium quality, quick turnaround, and our team loves wearing them.",
    rating: 5
  },
  {
    name: "Jordan Kim",
    role: "Anime Fan",
    content: "Finally found a place that prints anime designs without looking cheap. The colors are so vibrant!",
    rating: 5
  }
];

const Index = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center bg-gradient-mesh">
        <div className="section-container py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial="initial"
              animate="animate"
              variants={staggerContainer}
              className="text-center lg:text-left"
            >
              <motion.div
                variants={fadeInUp}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-coral-light text-coral text-sm font-medium mb-6"
              >
                <Sparkles className="w-4 h-4" />
                <span>Premium Custom Apparel</span>
              </motion.div>
              
              <motion.h1
                variants={fadeInUp}
                className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-display font-bold leading-tight mb-6"
              >
                Wear Your{" "}
                <span className="text-gradient-primary">Identity.</span>
              </motion.h1>
              
              <motion.p
                variants={fadeInUp}
                className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-xl mx-auto lg:mx-0"
              >
                Premium custom-printed T-shirts with anime, streetwear, and creator-inspired designs — or upload your own logo and make it truly yours.
              </motion.p>
              
              <motion.div
                variants={fadeInUp}
                className="flex flex-wrap gap-4 justify-center lg:justify-start"
              >
                <Link to="/shop">
                  <Button variant="hero" size="xl" className="group">
                    Shop Now
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link to="/customize">
                  <Button variant="hero-outline" size="xl">
                    Customize Yours
                  </Button>
                </Link>
              </motion.div>
              
              <motion.div
                variants={fadeInUp}
                className="flex items-center gap-6 mt-10 justify-center lg:justify-start"
              >
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-full bg-gradient-to-br from-coral to-mint border-2 border-background"
                    />
                  ))}
                </div>
                <div className="text-left">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="w-4 h-4 fill-sunflower text-sunflower" />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">5,000+ happy creators</p>
                </div>
              </motion.div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="relative rounded-3xl overflow-hidden shadow-large">
                <img
                  src={heroImage}
                  alt="G-KAP Premium Custom T-Shirt"
                  className="w-full h-auto object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/20 to-transparent" />
              </div>
              
              {/* Floating badges */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-4 -right-4 bg-background rounded-2xl shadow-medium p-4"
              >
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-mint-light flex items-center justify-center">
                    <Truck className="w-5 h-5 text-mint" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Free Shipping</p>
                    <p className="text-xs text-muted-foreground">Orders $50+</p>
                  </div>
                </div>
              </motion.div>
              
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-4 -left-4 bg-background rounded-2xl shadow-medium p-4"
              >
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-coral-light flex items-center justify-center">
                    <Palette className="w-5 h-5 text-coral" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Custom Designs</p>
                    <p className="text-xs text-muted-foreground">Upload yours</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why G-KAP Section */}
      <section className="py-20 bg-muted/50">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-display font-bold mb-4">
              Why Choose <span className="text-gradient-primary">G-KAP</span>?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We're not just printing shirts — we're helping you express your identity with premium quality.
            </p>
          </motion.div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-background rounded-2xl p-6 shadow-soft card-hover"
              >
                <div className={`w-12 h-12 rounded-xl ${feature.color} flex items-center justify-center mb-4`}>
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="font-display font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Collections Section */}
      <section className="py-20">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-12"
          >
            <div>
              <h2 className="text-3xl sm:text-4xl font-display font-bold mb-2">
                Featured Collections
              </h2>
              <p className="text-muted-foreground">
                Curated designs for every vibe
              </p>
            </div>
            <Link to="/shop">
              <Button variant="outline" className="group">
                View All
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {collections.map((collection, index) => (
              <motion.div
                key={collection.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  to={collection.href}
                  className="group block relative aspect-[4/5] rounded-2xl overflow-hidden product-image-zoom"
                >
                  <img
                    src={collection.image}
                    alt={collection.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${collection.color}`} />
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-background">
                    <h3 className="font-display font-bold text-2xl mb-1">{collection.title}</h3>
                    <p className="text-background/80">{collection.description}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
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
                <h3 className="font-display font-semibold text-xl mb-2">{step.title}</h3>
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
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
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
                    <Star key={i} className="w-5 h-5 fill-sunflower text-sunflower" />
                  ))}
                </div>
                <p className="text-foreground mb-4">"{testimonial.content}"</p>
                <div>
                  <p className="font-semibold">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
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
              Perfect for creators, startups, college events, merch drops, and gifts.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/shop">
                <Button variant="hero" size="xl" className="group">
                  Shop Collection
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
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
