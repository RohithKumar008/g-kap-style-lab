import { motion } from "framer-motion";
import jitterGraphic from "@/assets/t-shirt.png";
import heroGraphic from "@/assets/Gemini_Generated_Image_mw43pmmw43pmmw43 (1).png";

// Pendulum animation - chopped motion left to right
const pendulumX = [10, -10, 10, -10, 10, -10];  // Right, Left, Right, Left
const PENDULUM_DURATION = 2;  // Total duration for all steps

// Floating animation variants with different speeds and directions
const floatingVariants = {
  float1: {
    y: [0, -30, 0],
    rotate: [0, 5, 0],
    transition: {
      duration: 4,
      ease: "easeInOut",
      repeat: Infinity,
    },
  },
  float2: {
    y: [0, 35, 0],
    rotate: [0, -4, 0],
    transition: {
      duration: 5,
      ease: "easeInOut",
      repeat: Infinity,
    },
  },
  float3: {
    x: [0, 25, 0],
    y: [0, -20, 0],
    rotate: [0, 6, 0],
    transition: {
      duration: 5.5,
      ease: "easeInOut",
      repeat: Infinity,
    },
  },
  float4: {
    x: [0, -30, 0],
    y: [0, 25, 0],
    rotate: [0, -5, 0],
    transition: {
      duration: 6,
      ease: "easeInOut",
      repeat: Infinity,
    },
  },
  float5: {
    y: [0, -25, 0],
    rotate: [0, 4, 0],
    transition: {
      duration: 4.5,
      ease: "easeInOut",
      repeat: Infinity,
    },
  },
  float6: {
    x: [0, -20, 0],
    y: [0, -30, 0],
    rotate: [0, -3, 0],
    transition: {
      duration: 5.2,
      ease: "easeInOut",
      repeat: Infinity,
    },
  },
  spin: {
    rotate: [0, 360],
    transition: {
      duration: 8,
      ease: "linear",
      repeat: Infinity,
    },
  }
};

// Floating star with pulsing animation
const FloatingStar = ({ variant }: { variant: keyof typeof floatingVariants }) => {
  const animationConfig = floatingVariants[variant];
  return (
    <motion.div
      animate={{
        ...(animationConfig as any)
      }}
      className="text-6xl drop-shadow-lg"
    >
      <motion.span
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        ⭐
      </motion.span>
    </motion.div>
  );
};

export const FloatingHero = () => {
  return (
    <section className="relative w-full min-h-screen overflow-hidden pt-24 pb-0 border-b border-black" style={{ backgroundColor: 'rgb(109, 236, 71)' }}>
      
      {/* Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex flex-col md:grid md:grid-cols-2 gap-0 lg:gap-0 items-center md:items-end justify-between min-h-[calc(100vh-120px)]">
          
          {/* Left Content - Text */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative z-10 order-1 md:order-1 pt-0 md:pt-0 md:self-center"
          >
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="font-display font-bold text-black mb-6 leading-tight"
              style={{ fontSize: 'clamp(60px, 10vw, 116px)' }}
            >
              <span style={{ display: 'inline-block', transform: 'rotate(-11deg)', whiteSpace: 'nowrap' }}>Design Your</span><br />
              <span style={{ display: 'inline-block', transform: 'rotate(-17deg)', whiteSpace: 'nowrap' }}>Own Style</span>
            </motion.h1>
          </motion.div>

          {/* Right Content - Image with Background Graphics */}
          <div className="relative order-2 md:order-2 w-full flex justify-center md:justify-end md:self-end md:mb-0">
            {/* Background jittering graphics - positioned around the image */}
            <div className="absolute inset-0 pointer-events-none">
              {/* Top left corner of image */}
              <motion.div
                animate={{ x: pendulumX }}
                transition={{
                  duration: PENDULUM_DURATION,
                  ease: "linear",
                  repeat: Infinity,
                }}
                className="absolute top-0 -left-5 w-24 h-24 md:w-32 md:h-32"
                style={{ rotate: '25deg' }}
              >
                <img
                  src={jitterGraphic}
                  alt="Floating Design Element"
                  className="w-full h-full object-contain drop-shadow-lg"
                />
              </motion.div>

              {/* Top right corner of image */}
              <motion.div
                animate={{ x: pendulumX }}
                transition={{
                  duration: PENDULUM_DURATION,
                  ease: "linear",
                  repeat: Infinity,
                  delay: 0.2,
                }}
                className="absolute top-0 -right-5 w-24 h-24 md:w-32 md:h-32"
                style={{ rotate: '-35deg' }}
              >
                <img
                  src={jitterGraphic}
                  alt="Floating Design Element"
                  className="w-full h-full object-contain drop-shadow-lg"
                />
              </motion.div>

              {/* Bottom left corner of image */}
              <motion.div
                animate={{ x: pendulumX }}
                transition={{
                  duration: PENDULUM_DURATION,
                  ease: "linear",
                  repeat: Infinity,
                  delay: 0.4,
                }}
                className="absolute -bottom-0 -left-5 w-24 h-24 md:w-32 md:h-32"
                style={{ rotate: '-45deg' }}
              >
                <img
                  src={jitterGraphic}
                  alt="Floating Design Element"
                  className="w-full h-full object-contain drop-shadow-lg"
                />
              </motion.div>

              {/* Bottom right corner of image */}
              <motion.div
                animate={{ x: pendulumX }}
                transition={{
                  duration: PENDULUM_DURATION,
                  ease: "linear",
                  repeat: Infinity,
                  delay: 0.6,
                }}
                className="absolute -bottom-0 -right-5 w-24 h-24 md:w-32 md:h-32"
                style={{ rotate: '50deg' }}
              >
                <img
                  src={jitterGraphic}
                  alt="Floating Design Element"
                  className="w-full h-full object-contain drop-shadow-lg"
                />
              </motion.div>
              {/* Left side of image */}
              <motion.div
                animate={{ x: pendulumX }}
                transition={{
                  duration: PENDULUM_DURATION,
                  ease: "linear",
                  repeat: Infinity,
                  delay: 0.3,
                }}
                className="absolute top-1/2 -left-12 w-20 h-20 md:w-28 md:h-28 -translate-y-1/2"
                style={{ rotate: '15deg' }}
              >
                <img
                  src={jitterGraphic}
                  alt="Floating Design Element"
                  className="w-full h-full object-contain drop-shadow-lg"
                />
              </motion.div>

              {/* Right side of image */}
              <motion.div
                animate={{ x: pendulumX }}
                transition={{
                  duration: PENDULUM_DURATION,
                  ease: "linear",
                  repeat: Infinity,
                  delay: 0.5,
                }}
                className="absolute top-1/3 -right-12 w-20 h-20 md:w-28 md:h-28"
                style={{ rotate: '-25deg' }}
              >
                <img
                  src={jitterGraphic}
                  alt="Floating Design Element"
                  className="w-full h-full object-contain drop-shadow-lg"
                />
              </motion.div>

              {/* Center bottom of image */}
              <motion.div
                animate={{ x: pendulumX }}
                transition={{
                  duration: PENDULUM_DURATION,
                  ease: "linear",
                  repeat: Infinity,
                  delay: 0.1,
                }}
                className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-20 h-20 md:w-24 md:h-24"
                style={{ rotate: '35deg' }}
              >
                <img
                  src={jitterGraphic}
                  alt="Floating Design Element"
                  className="w-full h-full object-contain drop-shadow-lg"
                />
              </motion.div>            </div>

            {/* Model Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative z-5 w-full md:w-auto md:h-[600px] md:flex md:items-end pointer-events-none"
            >
              <img
                src={heroGraphic}
                alt="Your Model"
                className="w-full h-auto md:h-full md:w-auto object-contain"
              />
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default FloatingHero;
