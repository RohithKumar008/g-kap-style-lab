import { useRef, forwardRef } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import { Link } from "react-router-dom";
import animeCollection from "@/assets/collection-anime.jpg";
import streetwearCollection from "@/assets/collection-streetwear.jpg";
import minimalCollection from "@/assets/collection-minimal.jpg";
import { useEffect, useState } from "react";
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

const NUM_CARDS = collections.length;
const CARD_HEIGHT = 600; // pixels
const CARD_TOP_OFFSET = 100; // pixels between cards

export const StackedCollections = () => {
  // Height: enough for all cards to stack and scroll
  // Make section just tall enough for all cards to animate and stack
  // Make section just tall enough for all cards to animate and stack, with minimal bottom space
  const sectionHeight = `260vh`;
  return (
    <section
      className="w-full relative"
      style={{ backgroundColor: 'rgb(246, 240, 229)', minHeight: sectionHeight }}
    >
      <div className="w-full max-w-5xl mx-auto relative" style={{ minHeight: 500 }}>
        {collections.map((card, i) => (
          <StickyStackCard
            key={card.title}
            card={card}
            index={i}
            total={collections.length}
          />
        ))}
      </div>
    </section>
  );
}
// --- End of StackedCollections component ---

type CardProps = {
  scale: MotionValue<number>;
  opacity: number;
  brightness: MotionValue<number>;
  card: any;
};

const MotionCard = forwardRef<HTMLDivElement, CardProps>(
  ({ scale, opacity, brightness, card }, ref) => {
    // Map brightness number → CSS filter string
    const brightnessFilter = useTransform(
      brightness,
      (v) => `brightness(${v})`
    );

    return (
      <motion.div
        ref={ref}
        className="card-content bg-white rounded-3xl shadow-2xl overflow-hidden flex w-full h-[800px]"
        style={{
          scale,
          opacity,
          filter: brightnessFilter,
          boxShadow: "0 8px 32px 0 rgba(0,0,0,0.10)",
        }}
      >
        {/* CARD CONTENT */}
        <div className="flex w-full h-full">
          <div className="w-1/2 p-10 flex flex-col justify-center">
            <h3 className="text-3xl font-bold mb-4">{card.title}</h3>
            <p className="text-lg text-gray-600">
              {card.description}
            </p>
          </div>

          <div className="w-1/2">
            <img
              src={card.image}
              alt={card.title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </motion.div>
    );
  }
);

MotionCard.displayName = "MotionCard";

function StickyStackCard({ card, index, total }: { card: any; index: number; total: number }) {
  // Each card is sticky with a top offset
  // The stacking and scaling is handled by scroll position and z-index
  const CARD_OFFSET = 24; // px vertical offset between cards (tighter)
  const STICKY_TOP = 32; // px sticky offset from top (tighter)
  // Special sticky+expansion for the first card
  if (index === 0) {
    return <StickyRevealCard card={card} />;
  }
  // For the second card, it should fall directly on the first card (which is sticky+centered)
  // Use a sticky offset that matches the center of the viewport
  const stickyTop = index === 1 ? '50%' : `${STICKY_TOP + index * CARD_OFFSET}px`;
  const marginTop = index === 1 ? 0 : index === 0 ? 0 : -CARD_OFFSET;
  return (
    <div
      className="card-container z-10"
      style={{
        position: "sticky",
        top: stickyTop,
        zIndex: index + 1,
        marginTop: marginTop,
        transform: index === 1 ? 'translateY(-50%)' : undefined,
      }}
    >
      <CardContent card={card} index={index} total={total} />
    </div>
  );


// Sticky Reveal Card: scrolls up, locks at center, expands, recedes when covered
function StickyRevealCard({ card }: { card: any }) {
  // Tall wrapper for scroll progress
  const wrapperRef = useRef<HTMLDivElement>(null);
  // Use scroll progress of wrapper, sticky triggers at center
  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ["start start", "end end"]
  });
  // Expansion: 0 = closed, 0.8 = fully open
  const width = useTransform(scrollYProgress, [0, 0.8], [300, '95vw']);
  const height = useTransform(scrollYProgress, [0, 0.8], [200, '85vh']);
  const borderRadius = useTransform(scrollYProgress, [0, 0.8], [40, 24]);
  // Text fade/slide in only during expansion
  const textOpacity = useTransform(scrollYProgress, [0.15, 0.5], [0, 1]);
  const textX = useTransform(scrollYProgress, [0.15, 0.5], [-20, 0]);
  // Image parallax
  const imgX = useTransform(scrollYProgress, [0.15, 0.7], [40, 0]);
  // Recede when covered by next card
  const scaleDown = useTransform(scrollYProgress, [0.9, 1], [1, 0.9]);
  const darken = useTransform(scrollYProgress, [0.9, 1], [1, 0.7]);

  return (
    <div ref={wrapperRef} style={{ height: '300vh', position: 'relative', zIndex: 2 }}>
      <motion.div
        className="expanding-card bg-white shadow-2xl"
        style={{
          position: 'sticky',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width,
          height,
          borderRadius,
          overflow: 'hidden',
          minWidth: 300,
          minHeight: 200,
          transition: 'box-shadow 0.3s',
          zIndex: 2,
          scale: scaleDown,
          filter: darken.to(v => `brightness(${v})`),
        }}
      >
        <div
          className="card-content"
          style={{
            width: '95vw',
            height: '85vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-around',
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'auto',
          }}
        >
          <motion.div
            className="text-element flex-1 pr-8"
            style={{
              opacity: textOpacity,
              x: textX,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            <h3 className="text-4xl font-bold mb-4">{card.title}</h3>
            <p className="text-lg text-gray-600 mb-6">{card.description}</p>
            <Link
              to={card.href}
              className="inline-block px-6 py-2 bg-black text-white rounded-full text-lg font-semibold shadow hover:bg-gray-800 transition"
            >
              Shop Now
            </Link>
          </motion.div>
          <motion.div
            className="flex-1 flex items-center justify-center"
            style={{ x: imgX }}
          >
            <img
              src={card.image}
              alt={card.title}
              className="w-full max-w-[340px] h-auto object-contain drop-shadow-xl"
              draggable={false}
            />
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
}

function CardContent({ card, index, total, isTop }: { card: any; index: number; total: number; isTop?: boolean }) {
  // Framer Motion for scroll-driven animation
  // We'll use a simple fade/scale for entrance, and scale/brightness for receding
  // For demo, use a spring for smoothness
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  // Animate scale: 0.8 → 1.0 (active) → 0.9 (receding)
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.9]);
  const brightness = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1, 0.7]);
  const opacity = 1;
  const brightnessFilter = useTransform(brightness, (v) => `brightness(${v})`);

  return (
    <motion.div
      ref={ref}
      className="card-content bg-white rounded-3xl shadow-2xl overflow-hidden flex w-full h-[800px]"
      style={{
        scale,
        opacity,
        filter: brightnessFilter,
        boxShadow: "0 8px 32px 0 rgba(0,0,0,0.10)",
      }}
    >
      {/* CARD CONTENT */}
      <div className="flex w-full h-full">
        <div className="w-1/2 p-10 flex flex-col justify-center">
          <h3 className="text-3xl font-bold mb-4">{card.title}</h3>
          <p className="text-lg text-gray-600">{card.description}</p>
          <Link
            to={card.href}
            className="mt-6 inline-block px-6 py-2 bg-black text-white rounded-full text-lg font-semibold shadow hover:bg-gray-800 transition"
          >
            Shop Now
          </Link>
        </div>
        <div className="w-1/2">
          <img
            src={card.image}
            alt={card.title}
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </motion.div>
  );
}
