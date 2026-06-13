'use client';

// Escena de introducción 3D: el jugador conoce a Kimi en un claro de la Sierra Norte.
// Ambiente: noche serrana con montañas low-poly, pinos y luciérnagas.

import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import JaguarGuide3D from '../characters/JaguarGuide3D';
import { useGame } from '../engine/GameContext';
import { DIALOG_INTRO } from '@/lib/dialogs';

// ─── Árbol de pino low-poly ────────────────────────────────────────────────────
function PinoLowPoly({
  position,
  scale = 1,
}: {
  position: [number, number, number];
  scale?: number;
}) {
  return (
    <group position={position} scale={scale}>
      {/* Tronco */}
      <mesh position={[0, -0.4, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.1, 0.6, 5]} />
        <meshToonMaterial color="#5C3A1E" />
      </mesh>
      {/* Copa inferior */}
      <mesh position={[0, 0.15, 0]} castShadow>
        <coneGeometry args={[0.55, 0.9, 6]} />
        <meshToonMaterial color="#1B5E20" />
      </mesh>
      {/* Copa media */}
      <mesh position={[0, 0.65, 0]} castShadow>
        <coneGeometry args={[0.4, 0.75, 5]} />
        <meshToonMaterial color="#2E7D32" />
      </mesh>
      {/* Copa superior */}
      <mesh position={[0, 1.05, 0]} castShadow>
        <coneGeometry args={[0.22, 0.6, 5]} />
        <meshToonMaterial color="#388E3C" />
      </mesh>
    </group>
  );
}

// ─── Montaña low-poly ─────────────────────────────────────────────────────────
function Montana({
  position,
  scale,
  color = '#2D5A1B',
}: {
  position: [number, number, number];
  scale: [number, number, number];
  color?: string;
}) {
  return (
    <mesh position={position} scale={scale} castShadow receiveShadow>
      <coneGeometry args={[1, 1.6, 5]} />
      <meshToonMaterial color={color} />
    </mesh>
  );
}

// ─── Luciérnagas (partículas flotantes) ───────────────────────────────────────
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

  const phases = useMemo(() => {
    return Array.from({ length: count }, () => Math.random() * Math.PI * 2);
  }, [count]);

  useFrame(({ clock }) => {
    if (!pointsRef.current) return;
    const t = clock.elapsedTime;
    const pos = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < count; i++) {
      pos.setY(i, positions[i * 3 + 1] + Math.sin(t * 0.8 + phases[i]) * 0.2);
    }
    pos.needsUpdate = true;
    // Parpadeo de opacidad
    const mat = pointsRef.current.material as THREE.PointsMaterial;
    mat.opacity = 0.5 + Math.sin(t * 2.2) * 0.3;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[new Float32Array(positions), 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#B5FF5A"
        transparent
        opacity={0.7}
        sizeAttenuation
      />
    </points>
  );
}

// ─── Escena principal ─────────────────────────────────────────────────────────
export default function IntroScene() {
  const { state, dispatch } = useGame();
  const isTalking = state.isDialogOpen;
  const dialogEverOpened = useRef(false);

  // Abrir diálogo introductorio al montar
  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch({ type: 'OPEN_DIALOG', dialog: DIALOG_INTRO });
    }, 1200);
    return () => clearTimeout(timer);
  }, []); // eslint-disable-line

  // Transición al mapa cuando el diálogo de intro termina
  useEffect(() => {
    if (state.isDialogOpen) {
      dialogEverOpened.current = true;
      return;
    }
    if (!dialogEverOpened.current || state.scene !== 'intro') return;
    const timer = setTimeout(() => {
      dispatch({ type: 'SET_SCENE', scene: 'world-map' });
    }, 600); // pausa dramática antes de abrir el mapa
    return () => clearTimeout(timer);
  }, [state.isDialogOpen, state.scene, dispatch]);

  const jugadorName = state.jugador?.nombreCompleto ?? '';

  return (
    <>
      {/* Controles orbitales para la escena de intro (sin zoom, giro limitado) */}
      <OrbitControls
        enablePan={false}
        enableZoom={false}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 2.2}
        target={[0, 0, 0]}
      />

      {/* ── Iluminación ─────────────────────────────────────────────────── */}
      <ambientLight intensity={0.35} color="#3A2060" />
      <directionalLight
        position={[5, 8, 3]}
        intensity={0.9}
        color="#FFF8E7"
        castShadow
        shadow-mapSize={[512, 512]}
        shadow-camera-far={30}
      />
      {/* Luz de luna */}
      <pointLight position={[-8, 10, -5]} intensity={0.4} color="#7B9EC4" />
      {/* Luz cálida cerca del jaguar */}
      <pointLight position={[0, 1.5, 1]} intensity={0.6} color="#F2C14E" distance={6} />

      {/* ── Suelo ────────────────────────────────────────────────────────── */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.55, 0]} receiveShadow>
        <planeGeometry args={[30, 30]} />
        <meshToonMaterial color="#1B4020" />
      </mesh>

      {/* Claro del bosque (zona iluminada donde está Kimi) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.545, 0]}>
        <circleGeometry args={[2.5, 16]} />
        <meshToonMaterial color="#2A5C2A" />
      </mesh>

      {/* ── Montañas de fondo ─────────────────────────────────────────────── */}
      <Montana position={[-9, 0, -12]} scale={[4, 5, 4]} color="#1A3A10" />
      <Montana position={[-4, 0, -14]} scale={[5, 7, 5]} color="#243D15" />
      <Montana position={[2,  0, -13]} scale={[6, 8, 6]} color="#1E3612" />
      <Montana position={[8,  0, -12]} scale={[4, 6, 4]} color="#2D5A1B" />
      <Montana position={[13, 0, -10]} scale={[3, 5, 3]} color="#1A3A10" />
      {/* Montañas laterales */}
      <Montana position={[-12, 0, -5]} scale={[3, 4, 3]} color="#1B3611" />
      <Montana position={[12,  0, -5]} scale={[3, 4, 3]} color="#1B3611" />

      {/* ── Pinos alrededor del claro ────────────────────────────────────── */}
      <PinoLowPoly position={[-3.5, -0.55, -1.5]} scale={1.2} />
      <PinoLowPoly position={[-4,   -0.55, 1]}    scale={1.5} />
      <PinoLowPoly position={[-2.8, -0.55, 2.5]}  scale={1.0} />
      <PinoLowPoly position={[3.5,  -0.55, -1]}   scale={1.3} />
      <PinoLowPoly position={[4,    -0.55, 1.5]}  scale={1.1} />
      <PinoLowPoly position={[2.8,  -0.55, 2.8]}  scale={0.9} />
      <PinoLowPoly position={[0.5,  -0.55, -3.5]} scale={1.4} />
      <PinoLowPoly position={[-0.8, -0.55, -3.8]} scale={1.2} />

      {/* ── Kimi — el jaguar guardián ────────────────────────────────────── */}
      <JaguarGuide3D
        position={[0, -0.1, 0]}
        rotation={[0, 0.3, 0]}
        scale={1.1}
        isTalking={isTalking}
        onClick={() => {
          if (!state.isDialogOpen) {
            dispatch({ type: 'OPEN_DIALOG', dialog: DIALOG_INTRO });
          }
        }}
      />

      {/* ── Luciérnagas ──────────────────────────────────────────────────── */}
      <Luciernagas count={35} />

      {/* ── Foggy atmosphere (niebla de la sierra) ───────────────────────── */}
      <fog attach="fog" args={['#0D1A0D', 12, 28]} />
    </>
  );
}
