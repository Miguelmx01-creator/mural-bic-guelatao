'use client';

import { useRef, useMemo, useEffect, Suspense, Component, type ReactNode } from 'react';
import { useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { useGame } from '../engine/GameContext';
import { DIALOG_INTRO } from '@/lib/dialogs';

const INTRO_SCENE_PATH = '/models/environment/intro_scene.glb';

// ─── Error boundary para GLB faltante ────────────────────────────────────────
class GLBErrorBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { error: boolean }
> {
  state = { error: false };
  static getDerivedStateFromError() { return { error: true }; }
  render() { return this.state.error ? this.props.fallback : this.props.children; }
}

// ─── Luciérnagas (partículas — se mantienen procedurales) ────────────────────
function Luciernagas({ count = 40 }: { count?: number }) {
  const pointsRef = useRef<THREE.Points>(null!);

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * 12;
      pos[i * 3 + 1] = Math.random() * 3 + 0.2;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 12;
    }
    return pos;
  }, [count]);

  const phases = useMemo(
    () => Array.from({ length: count }, () => Math.random() * Math.PI * 2),
    [count],
  );

  useFrame(({ clock }) => {
    if (!pointsRef.current) return;
    const t   = clock.elapsedTime;
    const pos = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < count; i++) {
      pos.setY(i, positions[i * 3 + 1] + Math.sin(t * 0.8 + phases[i]) * 0.2);
    }
    pos.needsUpdate = true;
    (pointsRef.current.material as THREE.PointsMaterial).opacity =
      0.5 + Math.sin(t * 2.2) * 0.3;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[new Float32Array(positions), 3]}
        />
      </bufferGeometry>
      <pointsMaterial size={0.05} color="#B5FF5A" transparent opacity={0.7} sizeAttenuation />
    </points>
  );
}

// ─── Fallback mientras el GLB de la intro carga ───────────────────────────────
function Loader3D() {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame(({ clock }) => {
    if (ref.current) ref.current.rotation.y = clock.elapsedTime * 1.8;
  });
  return (
    <>
      <ambientLight intensity={0.15} color="#121224" />
      <mesh ref={ref}>
        <torusGeometry args={[0.38, 0.1, 8, 28]} />
        <meshToonMaterial color="#F2C14E" />
      </mesh>
    </>
  );
}

// ─── Entorno de introducción cargado desde GLB ────────────────────────────────
function IntroEnvironment() {
  const { scene } = useGLTF(INTRO_SCENE_PATH);

  useEffect(() => {
    scene.traverse((node) => {
      const mesh = node as THREE.Mesh;
      if (mesh.isMesh) {
        mesh.castShadow    = true;
        mesh.receiveShadow = true;
      }
    });
  }, [scene]);

  return <primitive object={scene} />;
}

// ─── Escena principal ─────────────────────────────────────────────────────────
export default function IntroScene() {
  const { state, dispatch } = useGame();
  const isTalking = state.isDialogOpen;
  const dialogEverOpened = useRef(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch({ type: 'OPEN_DIALOG', dialog: DIALOG_INTRO });
    }, 1200);
    return () => clearTimeout(timer);
  }, []); // eslint-disable-line

  useEffect(() => {
    if (state.isDialogOpen) { dialogEverOpened.current = true; return; }
    if (!dialogEverOpened.current || state.scene !== 'intro') return;
    const timer = setTimeout(() => {
      dispatch({ type: 'SET_SCENE', scene: 'world-map' });
    }, 600);
    return () => clearTimeout(timer);
  }, [state.isDialogOpen, state.scene, dispatch]);

  return (
    <>
      <OrbitControls
        enablePan={false}
        enableZoom={false}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 2.2}
        target={[0, 0, 0]}
      />

      {/* ── Iluminación cinemática — bosque noche serrana ─────────────────── */}
      <ambientLight intensity={0.3} color="#121224" />
      <directionalLight
        position={[-5, 9, 4]}
        intensity={1.2}
        color="#a3b8cc"
        castShadow
        shadow-mapSize={[512, 512]}
        shadow-camera-far={35}
        shadow-camera-left={-15}
        shadow-camera-right={15}
        shadow-camera-top={15}
        shadow-camera-bottom={-15}
      />
      <pointLight position={[-10, 12, -6]} intensity={0.5}  color="#5a7aaa" />
      <pointLight position={[0, 1.2, 1]}   intensity={0.9}  color="#F2C14E" distance={5} />
      <fog attach="fog" args={['#060a14', 5, 20]} />

      {/* ── Entorno 3D — sin personaje ───────────────────────────────────── */}
      <GLBErrorBoundary fallback={null}>
        <Suspense fallback={<Loader3D />}>
          <IntroEnvironment />
        </Suspense>
      </GLBErrorBoundary>

      {/* ── Luciérnagas — procedurales, no bloquean la carga ─────────────── */}
      <Luciernagas count={35} />
    </>
  );
}

useGLTF.preload(INTRO_SCENE_PATH);
