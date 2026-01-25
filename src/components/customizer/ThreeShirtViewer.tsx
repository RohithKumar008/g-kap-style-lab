import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import {
  Environment,
  OrbitControls,
  ContactShadows,
  Html,
  useTexture,
  useGLTF,
  Decal,
} from "@react-three/drei";
import * as THREE from "three";
import { Maximize2, Minimize2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ThreeShirtViewerProps {
  colorHex?: string;
  logoUrl?: string | null;
  printLocation?: "front" | "back";
  logoScale?: number;
  logoRotation?: number; // degrees
  modelUrl?: string; // glb model path, e.g., /models/tshirt.glb
  textureUrl?: string | null; // composited texture from canvas
  userTemplate?: string | null;
  sideImages?: Partial<Record<"front" | "back" | "left" | "right", string | null>>;
  showReferenceTemplate?: boolean;
}

const transparentPixel =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAuMBg5j5x98AAAAASUVORK5CYII=";

const ShirtMesh = ({
  colorHex = "#f5f5f5",
  logoUrl,
  printLocation = "front",
  logoScale = 1,
  logoRotation = 0,
  modelUrl = "/models/tshirt.glb",
  textureUrl,
}: ThreeShirtViewerProps) => {
  const baseColor = colorHex || "#f5f5f5";

  // Load GLB model
  const shirtRef = useRef<THREE.Mesh>(null);

  const { scene } = useGLTF(modelUrl);

  // Load composited texture if available
  const texture = useTexture(textureUrl || transparentPixel);
  texture.flipY = false; // GLB UVs are already correct
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;

  // Apply texture or base color to materials
  useEffect(() => {
    if (!scene) return;
    scene.traverse((child: any) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        if (child.material) {
          child.material = child.material.clone();
          
          // Apply composited texture if available
          if (textureUrl) {
            // Set texture and ensure no unintended tinting
            child.material.map = texture;
            child.material.color = new THREE.Color('#ffffff');
          } else {
            // Clear any previous texture and set base color
            child.material.map = null;
            child.material.color = new THREE.Color(baseColor);
          }
          
          if (child.material.roughness === undefined) child.material.roughness = 0.6;
          if (child.material.metalness === undefined) child.material.metalness = 0.05;
          child.material.needsUpdate = true;
        }
      }
    });
  }, [scene, baseColor, textureUrl, texture]);

  return (
    <group position={[0, -0.5, 0]} scale={[0.6, 0.6, 0.6]}>
      <primitive object={scene} />
      <ContactShadows
        position={[0, -1, 0]}
        opacity={0.35}
        scale={4}
        blur={2.5}
        far={2}
      />
    </group>
  );
};

export const ThreeShirtViewer = ({
  colorHex,
  logoUrl,
  printLocation = "front",
  logoScale,
  logoRotation,
  modelUrl,
  userTemplate,
  sideImages,
  showReferenceTemplate,
  textureUrl,
}: ThreeShirtViewerProps) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Use provided textureUrl directly (Customize component handles generation)
  const composedTextureUrl = textureUrl || null;

  const toggleFullscreen = () => {
    if (!containerRef.current) return;

    if (!isFullscreen) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  return (
    <div 
      ref={containerRef}
      className={`relative w-full rounded-2xl overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 shadow-large ${
        isFullscreen ? 'h-screen' : 'h-[520px]'
      }`}
    >
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleFullscreen}
        className="absolute top-4 right-4 z-10 bg-black/30 hover:bg-black/50 text-white backdrop-blur-sm"
      >
        {isFullscreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
      </Button>

      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ position: [0, 0.8, 3.5], fov: 45 }}
      >
        <color attach="background" args={["#0f172a"]} />
        <ambientLight intensity={0.5} />
        <directionalLight
          castShadow
          position={[5, 5, 5]}
          intensity={1.25}
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <directionalLight position={[-3, 4, -2]} intensity={0.6} />

        <Suspense
          fallback={
            <Html center>
              <div className="px-4 py-2 rounded-lg bg-white/80 text-slate-900 text-sm font-medium shadow-sm">
                Loading 3D preview...
              </div>
            </Html>
          }
        >
          <ShirtMesh
            colorHex={colorHex}
            logoUrl={logoUrl}
            printLocation={printLocation}
            logoScale={logoScale}
            logoRotation={logoRotation}
            modelUrl={modelUrl}
            textureUrl={composedTextureUrl}
          />
          <Environment preset="city" />
        </Suspense>

        <OrbitControls enablePan={false} minDistance={2} maxDistance={6} />
      </Canvas>

      {!logoUrl && (
        <div className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 text-xs text-slate-300/80 bg-black/30 px-3 py-1.5 rounded-full backdrop-blur-sm">
          Tip: Upload a logo to project it on the tee
        </div>
      )}
    </div>
  );
};

export default ThreeShirtViewer;

// Preload default model to speed up first render
useGLTF.preload("/models/tshirt.glb");
