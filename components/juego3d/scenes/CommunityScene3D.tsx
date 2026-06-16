'use client';

import { useRef, useEffect, Suspense, Component, type ReactNode } from 'react';
import { useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { useGame } from '../engine/GameContext';
import { COMMUNITY_DIALOGS } from '@/lib/dialogs';

// ─── Assets y configuración de iluminación cinemática por comunidad ───────────

const COMMUNITY_MODELS: Record<number, string> = {
  1: '/models/communities/capulalpam.glb',
  2: '/models/communities/chicomezuchil.glb',
  3: '/models/communities/huamuchil.glb',
  4: '/models/communities/guelatao.glb',
  5: '/models/communities/san_cristobal.glb',
};

interface LightingConfig {
  ambient:     { intensity: number; color: string };
  directional: { position: [number, number, number]; intensity: number; color: string };
  point:       { position: [number, number, number]; intensity: number; color: string; distance: number };
  fog:         [string, number, number];
}

const COMMUNITY_LIGHTING: Record<number, LightingConfig> = {
  1: {
    ambient:     { intensity: 0.45, color: '#3A2A10' },
    directional: { position: [-5, 9, 4],    intensity: 1.1,  color: '#FFE0A0' },
    point:       { position: [2, 2, 2],      intensity: 0.5,  color: '#F2C14E', distance: 8 },
    fog:         ['#1A0E05', 14, 26],
  },
  2: {
    ambient:     { intensity: 0.5,  color: '#0A1A18' },
    directional: { position: [4, 10, 3],    intensity: 0.95, color: '#D0FFE8' },
    point:       { position: [-2, 2, 1],     intensity: 0.4,  color: '#2FB89A', distance: 8 },
    fog:         ['#081510', 13, 25],
  },
  3: {
    ambient:     { intensity: 0.4,  color: '#2A1808' },
    directional: { position: [6, 8, 2],     intensity: 1.0,  color: '#FFD090' },
    point:       { position: [-1.5, 1.5, 0], intensity: 0.6,  color: '#E5532E', distance: 8 },
    fog:         ['#1A0D05', 14, 26],
  },
  4: {
    ambient:     { intensity: 0.5,  color: '#1A1A30' },
    directional: { position: [-4, 9, 5],    intensity: 1.1,  color: '#FFE0A0' },
    point:       { position: [0, 1, -2],     intensity: 0.7,  color: '#F2C14E', distance: 10 },
    fog:         ['#0D0D1A', 14, 26],
  },
  5: {
    ambient:     { intensity: 0.45, color: '#0A1A18' },
    directional: { position: [3, 10, 4],    intensity: 0.9,  color: '#C8FFE8' },
    point:       { position: [-1, 2, 0.5],   intensity: 0.5,  color: '#2FB89A', distance: 9 },
    fog:         ['#051510', 12, 24],
  },
};

// ─── Error boundary para GLB faltante ────────────────────────────────────────
class GLBErrorBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { error: boolean }
> {
  state = { error: false };
  static getDerivedStateFromError() { return { error: true }; }
  render() { return this.state.error ? this.props.fallback : this.props.children; }
}

// ─── Fallback mientras el GLB de la comunidad carga ──────────────────────────
function Loader3D() {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame(({ clock }) => {
    if (ref.current) ref.current.rotation.y = clock.elapsedTime * 2.2;
  });
  return (
    <>
      <ambientLight intensity={0.15} color="#0a1a10" />
      <mesh ref={ref}>
        <torusGeometry args={[0.38, 0.1, 8, 28]} />
        <meshToonMaterial color="#2FB89A" />
      </mesh>
    </>
  );
}

// ─── Entorno por comunidad: GLB + iluminación cinemática ─────────────────────
function CommunityEnvironment({ nivel }: { nivel: number }) {
  const path  = COMMUNITY_MODELS[nivel]  ?? COMMUNITY_MODELS[1];
  const light = COMMUNITY_LIGHTING[nivel] ?? COMMUNITY_LIGHTING[1];
  const { scene } = useGLTF(path);

  useEffect(() => {
    scene.traverse((node) => {
      const mesh = node as THREE.Mesh;
      if (mesh.isMesh) {
        mesh.castShadow    = true;
        mesh.receiveShadow = true;
      }
    });
  }, [scene]);

  return (
    <>
      <ambientLight
        intensity={light.ambient.intensity}
        color={light.ambient.color}
      />
      <directionalLight
        position={light.directional.position}
        intensity={light.directional.intensity}
        color={light.directional.color}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <pointLight
        position={light.point.position}
        intensity={light.point.intensity}
        color={light.point.color}
        distance={light.point.distance}
        decay={2}
      />
      <fog attach="fog" args={light.fog} />
      <primitive object={scene} />
    </>
  );
}

// ─── Escena principal ─────────────────────────────────────────────────────────
export default function CommunityScene3D() {
  const { state, dispatch } = useGame();
  const nivel    = state.activeCommunityLevel ?? 1;
  const isActive = state.scene === 'community';
  const dialogEverOpened = useRef(false);

  useEffect(() => {
    if (!isActive && state.scene !== 'minigame') {
      dialogEverOpened.current = false;
    }
  }, [isActive, state.scene]);

  useEffect(() => {
    if (!isActive) return;
    const dialog = COMMUNITY_DIALOGS[nivel];
    if (!dialog) {
      const t = setTimeout(() => dispatch({ type: 'SET_SCENE', scene: 'minigame' }), 800);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => dispatch({ type: 'OPEN_DIALOG', dialog }), 900);
    return () => clearTimeout(t);
  }, [isActive, nivel, dispatch]);

  useEffect(() => {
    if (!isActive) return;
    if (state.isDialogOpen) { dialogEverOpened.current = true; return; }
    if (!dialogEverOpened.current) return;
    const t = setTimeout(() => dispatch({ type: 'SET_SCENE', scene: 'minigame' }), 500);
    return () => clearTimeout(t);
  }, [state.isDialogOpen, isActive, dispatch]);

  return (
    <>
      <OrbitControls
        enablePan={false}
        enableZoom={false}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 2.3}
        target={[0, 0.3, 0]}
      />

      <GLBErrorBoundary fallback={null}>
        <Suspense fallback={<Loader3D />}>
          <CommunityEnvironment nivel={nivel} />
        </Suspense>
      </GLBErrorBoundary>
    </>
  );
}

Object.values(COMMUNITY_MODELS).forEach((path) => useGLTF.preload(path));
