import { Suspense, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import {
  Environment,
  OrbitControls,
  ContactShadows,
  Html,
  Decal,
  useTexture,
} from "@react-three/drei";
import * as THREE from "three";

interface ThreeShirtViewerProps {
  colorHex?: string;
  logoUrl?: string | null;
  printLocation?: "front" | "back";
  logoScale?: number;
  logoRotation?: number; // degrees
}

const transparentPixel =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAuMBg5j5x98AAAAASUVORK5CYII=";

const ShirtMesh = ({
  colorHex = "#f5f5f5",
  logoUrl,
  printLocation = "front",
  logoScale = 1,
  logoRotation = 0,
}: ThreeShirtViewerProps) => {
  const baseColor = colorHex || "#f5f5f5";

  // Use a transparent placeholder so the hook never fails when no logo exists
  const decalTexture = useTexture(logoUrl || transparentPixel);
  decalTexture.flipY = true; // keep upright from file uploads
  decalTexture.colorSpace = THREE.SRGBColorSpace;

  const decalPosition = useMemo(
    () => new THREE.Vector3(0, 0.25, printLocation === "front" ? 0.32 : -0.32),
    [printLocation]
  );

  const decalRotation = useMemo(() => {
    const zRot = THREE.MathUtils.degToRad(logoRotation || 0);
    return printLocation === "front"
      ? [0, 0, zRot]
      : [0, Math.PI, zRot];
  }, [printLocation, logoRotation]);

  return (
    <group position={[0, -0.1, 0]}>
      {/* Main Torso - tall rectangular body */}
      <mesh castShadow receiveShadow position={[0, 0, 0]}>
        <boxGeometry args={[0.72, 1.2, 0.3]} />
        <meshPhysicalMaterial
          color={baseColor}
          roughness={0.7}
          metalness={0.05}
          clearcoat={0.4}
          clearcoatRoughness={0.2}
        />
        {logoUrl ? (
          <Decal
            position={decalPosition}
            rotation={decalRotation as [number, number, number]}
            scale={[0.6 * logoScale, 0.6 * logoScale, 0.6 * logoScale]}
            map={decalTexture}
          />
        ) : null}
      </mesh>

      {/* Left Shoulder - rounded cap */}
      <mesh castShadow receiveShadow position={[-0.36, 0.55, 0]}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshPhysicalMaterial
          color={baseColor}
          roughness={0.7}
          metalness={0.05}
          clearcoat={0.4}
          clearcoatRoughness={0.2}
        />
      </mesh>

      {/* Right Shoulder - rounded cap */}
      <mesh castShadow receiveShadow position={[0.36, 0.55, 0]}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshPhysicalMaterial
          color={baseColor}
          roughness={0.7}
          metalness={0.05}
          clearcoat={0.4}
          clearcoatRoughness={0.2}
        />
      </mesh>

      {/* Left Sleeve */}
      <mesh
        castShadow
        receiveShadow
        position={[-0.55, 0.55, 0]}
        rotation={[0, 0, 0.15]}
      >
        <cylinderGeometry args={[0.12, 0.11, 0.55, 16, 4]} />
        <meshPhysicalMaterial
          color={baseColor}
          roughness={0.7}
          metalness={0.05}
          clearcoat={0.35}
          clearcoatRoughness={0.25}
        />
      </mesh>

      {/* Right Sleeve */}
      <mesh
        castShadow
        receiveShadow
        position={[0.55, 0.55, 0]}
        rotation={[0, 0, -0.15]}
      >
        <cylinderGeometry args={[0.12, 0.11, 0.55, 16, 4]} />
        <meshPhysicalMaterial
          color={baseColor}
          roughness={0.7}
          metalness={0.05}
          clearcoat={0.35}
          clearcoatRoughness={0.25}
        />
      </mesh>

      {/* Collar cutout sphere (subtle neck) */}
      <mesh castShadow receiveShadow position={[0, 0.57, 0.15]}>
        <sphereGeometry args={[0.12, 12, 12]} />
        <meshPhysicalMaterial
          color={baseColor}
          roughness={0.75}
          metalness={0.02}
        />
      </mesh>

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
}: ThreeShirtViewerProps) => {
  return (
    <div className="relative w-full h-[520px] rounded-2xl overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 shadow-large">
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ position: [0, 1.2, 3], fov: 42 }}
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
          />
          <Environment preset="city" />
        </Suspense>

        <OrbitControls enablePan={false} minDistance={2.1} maxDistance={4} />
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
