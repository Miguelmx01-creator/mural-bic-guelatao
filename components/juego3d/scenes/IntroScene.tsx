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

// ─── Árbol de pino — cluster escultórico, follaje irregular de múltiples verdes ─
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
      <mesh position={[0, -0.4, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.07, 0.11, 0.65, 5]} />
        <meshStandardMaterial color="#3D2010" roughness={0.95} />
      </mesh>
      {/* Masa base — verde pino oscuro, inclinada */}
      <mesh position={[0.05, 0.12, -0.04]} rotation={[0.08, 0.6, -0.05]} castShadow>
        <coneGeometry args={[0.58, 0.82, 6]} />
        <meshStandardMaterial color="#1E5018" roughness={0.9} />
      </mesh>
      {/* Capa media — esmeralda, eje distinto */}
      <mesh position={[-0.06, 0.56, 0.07]} rotation={[-0.07, 1.1, 0.06]} castShadow>
        <coneGeometry args={[0.43, 0.68, 5]} />
        <meshStandardMaterial color="#2D6B22" roughness={0.9} />
      </mesh>
      {/* Esfera oliva — rompe la simetría */}
      <mesh position={[-0.2, 0.52, 0.16]} castShadow>
        <sphereGeometry args={[0.2, 5, 4]} />
        <meshStandardMaterial color="#3B6020" roughness={0.9} />
      </mesh>
      {/* Copa superior asimétrica */}
      <mesh position={[0.04, 0.97, -0.04]} rotation={[0.1, 0.4, 0.09]} castShadow>
        <coneGeometry args={[0.24, 0.52, 5]} />
        <meshStandardMaterial color="#3E8028" roughness={0.9} />
      </mesh>
      {/* Mini brote — pino quemado oscuro */}
      <mesh position={[0.18, 0.78, 0.13]} rotation={[0.15, -0.5, -0.1]} castShadow>
        <coneGeometry args={[0.11, 0.28, 4]} />
        <meshStandardMaterial color="#28451A" roughness={0.9} />
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

      {/* ── Iluminación cinemática — bosque noche serrana ────────────────── */}
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
      {/* Luna — lateral fría, genera sombras duras */}
      <pointLight position={[-10, 12, -6]} intensity={0.5} color="#5a7aaa" />
      {/* Calor de Kimi — foco cálido bajo */}
      <pointLight position={[0, 1.2, 1]} intensity={0.9} color="#F2C14E" distance={5} />

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
      <fog attach="fog" args={['#060a14', 5, 20]} />
    </>
  );
}
