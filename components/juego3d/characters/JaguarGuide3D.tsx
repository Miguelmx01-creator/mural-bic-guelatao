'use client';

// Kimi — Jaguar guardián de la Sierra Norte
// Postura antropomórfica bípeda con brazos cruzados.
// Rostro felino: pómulos/mandíbula/hocico esculpidos con esferas escaladas.
// Manchas orgánicas: planos ultra-delgados sobre la superficie de la piel.
// Sin GLTF ni texturas externas — solo geometrías nativas de Three.js.

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface Props {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  isTalking?: boolean;
  onClick?: () => void;
}

const C = {
  body:  '#D4883A',
  belly: '#F0DFB8',
  dark:  '#1A0A02',
  eye:   '#2E7D32',
  pupil: '#0D0D0D',
  ear:   '#C07830',
  gum:   '#E8A5A0',
  paw:   '#BA6E20',
} as const;

export default function JaguarGuide3D({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  isTalking = false,
  onClick,
}: Props) {
  const rootRef = useRef<THREE.Group>(null!);
  const bodyRef = useRef<THREE.Group>(null!);
  const headRef = useRef<THREE.Group>(null!);
  const tailRef = useRef<THREE.Group>(null!);
  const lEyeRef = useRef<THREE.Mesh>(null!);
  const rEyeRef = useRef<THREE.Mesh>(null!);
  const jawRef  = useRef<THREE.Mesh>(null!);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;

    if (rootRef.current) {
      rootRef.current.position.y = position[1] + Math.sin(t * 1.4) * 0.05;
    }
    if (bodyRef.current) {
      const breath = 1 + Math.sin(t * 1.6) * 0.015;
      bodyRef.current.scale.set(breath, 1 / breath, breath);
    }
    if (headRef.current && !isTalking) {
      headRef.current.rotation.y = Math.sin(t * 0.5) * 0.12;
    }
    if (isTalking) {
      if (jawRef.current) jawRef.current.rotation.x = Math.abs(Math.sin(t * 8)) * 0.22;
      if (headRef.current) headRef.current.rotation.z = Math.sin(t * 5) * 0.04;
    } else {
      if (jawRef.current) jawRef.current.rotation.x = 0;
    }
    if (tailRef.current) {
      tailRef.current.rotation.z = Math.sin(t * 2.5) * 0.4;
      tailRef.current.rotation.x = Math.sin(t * 1.8) * 0.15;
    }
    if (lEyeRef.current && rEyeRef.current) {
      const blinkPhase = t % 3.5;
      const scaleY = blinkPhase > 3.35 ? Math.max(0.05, 1 - (blinkPhase - 3.35) * 60) : 1;
      lEyeRef.current.scale.y = scaleY;
      rEyeRef.current.scale.y = scaleY;
    }
  });

  return (
    <group ref={rootRef} position={position} rotation={rotation} scale={scale} onClick={onClick}>

      {/* ── Cuerpo ───────────────────────────────────────────────────────── */}
      <group ref={bodyRef}>

        {/* Cadera */}
        <mesh position={[0, 0.02, -0.02]} castShadow receiveShadow>
          <boxGeometry args={[0.48, 0.17, 0.32]} />
          <meshToonMaterial color={C.body} />
        </mesh>

        {/* Torso — ancho, fuerte */}
        <mesh position={[0, 0.22, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.6, 0.44, 0.4]} />
          <meshToonMaterial color={C.body} />
        </mesh>

        {/* Panza más clara */}
        <mesh position={[0, 0.18, 0.205]}>
          <boxGeometry args={[0.34, 0.3, 0.01]} />
          <meshToonMaterial color={C.belly} />
        </mesh>

        {/* Ensanche de hombros */}
        <mesh position={[0, 0.43, 0]} castShadow>
          <boxGeometry args={[0.7, 0.1, 0.38]} />
          <meshToonMaterial color={C.body} />
        </mesh>

        {/* ── Manchas orgánicas sobre torso (planos ultra-delgados) ─────── */}
        <mesh position={[-0.14, 0.28, 0.205]} rotation={[0, 0, 0.45]}>
          <planeGeometry args={[0.12, 0.08]} />
          <meshToonMaterial color={C.dark} />
        </mesh>
        <mesh position={[0.17, 0.14, 0.205]} rotation={[0, 0, -0.3]}>
          <planeGeometry args={[0.1, 0.065]} />
          <meshToonMaterial color={C.dark} />
        </mesh>
        <mesh position={[-0.04, 0.37, 0.205]} rotation={[0, 0, 0.15]}>
          <planeGeometry args={[0.075, 0.05]} />
          <meshToonMaterial color={C.dark} />
        </mesh>
        <mesh position={[0.09, 0.32, -0.205]} rotation={[0, 0, 0.65]}>
          <planeGeometry args={[0.13, 0.065]} />
          <meshToonMaterial color={C.dark} />
        </mesh>
        <mesh position={[-0.11, 0.18, -0.205]} rotation={[0, 0, -0.45]}>
          <planeGeometry args={[0.09, 0.055]} />
          <meshToonMaterial color={C.dark} />
        </mesh>

        {/* ── Brazos cruzados ───────────────────────────────────────────── */}
        {/* Upper arm izquierdo */}
        <mesh position={[-0.4, 0.32, 0.04]} rotation={[0.15, 0, 0.7]} castShadow>
          <cylinderGeometry args={[0.072, 0.062, 0.28, 5]} />
          <meshToonMaterial color={C.body} />
        </mesh>
        {/* Antebrazo izquierdo — horizontal, cruza hacia la derecha */}
        <mesh position={[-0.06, 0.12, 0.19]} rotation={[0.1, 0.05, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.062, 0.055, 0.36, 5]} />
          <meshToonMaterial color={C.body} />
        </mesh>
        {/* Mano izquierda */}
        <mesh position={[0.13, 0.1, 0.2]}>
          <sphereGeometry args={[0.072, 5, 4]} />
          <meshToonMaterial color={C.paw} />
        </mesh>

        {/* Upper arm derecho */}
        <mesh position={[0.4, 0.32, 0.04]} rotation={[0.15, 0, -0.7]} castShadow>
          <cylinderGeometry args={[0.072, 0.062, 0.28, 5]} />
          <meshToonMaterial color={C.body} />
        </mesh>
        {/* Antebrazo derecho — horizontal, cruza hacia la izquierda (encima) */}
        <mesh position={[0.06, 0.15, 0.21]} rotation={[0.1, -0.05, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.062, 0.055, 0.36, 5]} />
          <meshToonMaterial color={C.body} />
        </mesh>
        {/* Mano derecha */}
        <mesh position={[-0.13, 0.13, 0.21]}>
          <sphereGeometry args={[0.072, 5, 4]} />
          <meshToonMaterial color={C.paw} />
        </mesh>

        {/* ── Piernas bípedas ────────────────────────────────────────────── */}
        {/* Muslo izquierdo */}
        <mesh position={[-0.15, -0.18, 0.02]} rotation={[0.12, 0, 0.03]} castShadow>
          <cylinderGeometry args={[0.1, 0.085, 0.33, 5]} />
          <meshToonMaterial color={C.body} />
        </mesh>
        {/* Espinilla izquierda */}
        <mesh position={[-0.16, -0.38, 0.08]} rotation={[-0.2, 0, 0.02]} castShadow>
          <cylinderGeometry args={[0.085, 0.07, 0.24, 5]} />
          <meshToonMaterial color={C.body} />
        </mesh>
        {/* Pata izquierda */}
        <mesh position={[-0.16, -0.52, 0.1]} castShadow>
          <boxGeometry args={[0.14, 0.065, 0.22]} />
          <meshToonMaterial color={C.paw} />
        </mesh>
        {/* Mancha muslo izq */}
        <mesh position={[-0.23, -0.17, 0.14]} rotation={[0.1, 0.1, 0.5]}>
          <planeGeometry args={[0.09, 0.055]} />
          <meshToonMaterial color={C.dark} />
        </mesh>

        {/* Muslo derecho */}
        <mesh position={[0.15, -0.18, 0.02]} rotation={[0.12, 0, -0.03]} castShadow>
          <cylinderGeometry args={[0.1, 0.085, 0.33, 5]} />
          <meshToonMaterial color={C.body} />
        </mesh>
        {/* Espinilla derecha */}
        <mesh position={[0.16, -0.38, 0.08]} rotation={[-0.2, 0, -0.02]} castShadow>
          <cylinderGeometry args={[0.085, 0.07, 0.24, 5]} />
          <meshToonMaterial color={C.body} />
        </mesh>
        {/* Pata derecha */}
        <mesh position={[0.16, -0.52, 0.1]} castShadow>
          <boxGeometry args={[0.14, 0.065, 0.22]} />
          <meshToonMaterial color={C.paw} />
        </mesh>
        {/* Mancha muslo der */}
        <mesh position={[0.24, -0.19, 0.12]} rotation={[-0.1, -0.1, -0.6]}>
          <planeGeometry args={[0.09, 0.055]} />
          <meshToonMaterial color={C.dark} />
        </mesh>
      </group>

      {/* ── Cuello ──────────────────────────────────────────────────────── */}
      <mesh position={[0, 0.52, 0.05]} castShadow>
        <cylinderGeometry args={[0.135, 0.165, 0.2, 6]} />
        <meshToonMaterial color={C.body} />
      </mesh>

      {/* ── Cabeza ──────────────────────────────────────────────────────── */}
      <group ref={headRef} position={[0, 0.68, 0.07]}>

        {/* Cráneo */}
        <mesh castShadow>
          <sphereGeometry args={[0.27, 8, 7]} />
          <meshToonMaterial color={C.body} />
        </mesh>

        {/* Pómulo izquierdo — esfera aplastada en Y, ensanchada en X */}
        <mesh position={[-0.2, -0.04, 0.14]} scale={[1.5, 0.72, 1.0]}>
          <sphereGeometry args={[0.1, 6, 5]} />
          <meshToonMaterial color={C.body} />
        </mesh>
        {/* Pómulo derecho */}
        <mesh position={[0.2, -0.04, 0.14]} scale={[1.5, 0.72, 1.0]}>
          <sphereGeometry args={[0.1, 6, 5]} />
          <meshToonMaterial color={C.body} />
        </mesh>

        {/* Mandíbula — esfera ancha y aplastada */}
        <mesh position={[0, -0.15, 0.08]} scale={[1.35, 0.58, 1.05]}>
          <sphereGeometry args={[0.16, 6, 5]} />
          <meshToonMaterial color={C.body} />
        </mesh>

        {/* Hocico — prominente, alargado en Z */}
        <mesh position={[0, -0.06, 0.24]} scale={[1.0, 0.78, 1.28]}>
          <sphereGeometry args={[0.148, 6, 5]} />
          <meshToonMaterial color={C.belly} />
        </mesh>

        {/* Nariz */}
        <mesh position={[0, -0.0, 0.4]}>
          <sphereGeometry args={[0.036, 5, 4]} />
          <meshToonMaterial color={C.dark} />
        </mesh>
        {/* Surco nasolabial */}
        <mesh position={[0, -0.055, 0.4]}>
          <boxGeometry args={[0.008, 0.055, 0.008]} />
          <meshToonMaterial color={C.dark} />
        </mesh>

        {/* Mandíbula inferior — animada al hablar */}
        <mesh ref={jawRef} position={[0, -0.17, 0.2]}>
          <boxGeometry args={[0.24, 0.065, 0.21]} />
          <meshToonMaterial color={C.belly} />
        </mesh>

        {/* Ojo izquierdo */}
        <mesh ref={lEyeRef} position={[-0.12, 0.065, 0.235]}>
          <sphereGeometry args={[0.058, 6, 5]} />
          <meshToonMaterial color={C.eye} />
        </mesh>
        <mesh position={[-0.12, 0.065, 0.29]}>
          <sphereGeometry args={[0.03, 5, 4]} />
          <meshToonMaterial color={C.pupil} />
        </mesh>
        <mesh position={[-0.105, 0.08, 0.3]}>
          <sphereGeometry args={[0.01, 4, 3]} />
          <meshToonMaterial color="white" />
        </mesh>

        {/* Ojo derecho */}
        <mesh ref={rEyeRef} position={[0.12, 0.065, 0.235]}>
          <sphereGeometry args={[0.058, 6, 5]} />
          <meshToonMaterial color={C.eye} />
        </mesh>
        <mesh position={[0.12, 0.065, 0.29]}>
          <sphereGeometry args={[0.03, 5, 4]} />
          <meshToonMaterial color={C.pupil} />
        </mesh>
        <mesh position={[0.135, 0.08, 0.3]}>
          <sphereGeometry args={[0.01, 4, 3]} />
          <meshToonMaterial color="white" />
        </mesh>

        {/* Oreja izquierda */}
        <mesh position={[-0.22, 0.25, 0.01]} rotation={[0, 0, -0.28]}>
          <coneGeometry args={[0.09, 0.21, 4]} />
          <meshToonMaterial color={C.ear} />
        </mesh>
        <mesh position={[-0.21, 0.27, 0.03]} rotation={[0, 0, -0.28]}>
          <coneGeometry args={[0.05, 0.13, 4]} />
          <meshToonMaterial color={C.gum} />
        </mesh>

        {/* Oreja derecha */}
        <mesh position={[0.22, 0.25, 0.01]} rotation={[0, 0, 0.28]}>
          <coneGeometry args={[0.09, 0.21, 4]} />
          <meshToonMaterial color={C.ear} />
        </mesh>
        <mesh position={[0.21, 0.27, 0.03]} rotation={[0, 0, 0.28]}>
          <coneGeometry args={[0.05, 0.13, 4]} />
          <meshToonMaterial color={C.gum} />
        </mesh>

        {/* Rayas mejilla izquierda — dos trazos */}
        <mesh position={[-0.24, -0.04, 0.15]} rotation={[0, 0.3, 0.72]}>
          <boxGeometry args={[0.022, 0.1, 0.022]} />
          <meshToonMaterial color={C.dark} />
        </mesh>
        <mesh position={[-0.26, -0.01, 0.1]} rotation={[0, 0.2, 0.52]}>
          <boxGeometry args={[0.018, 0.075, 0.018]} />
          <meshToonMaterial color={C.dark} />
        </mesh>

        {/* Rayas mejilla derecha */}
        <mesh position={[0.24, -0.04, 0.15]} rotation={[0, -0.3, -0.72]}>
          <boxGeometry args={[0.022, 0.1, 0.022]} />
          <meshToonMaterial color={C.dark} />
        </mesh>
        <mesh position={[0.26, -0.01, 0.1]} rotation={[0, -0.2, -0.52]}>
          <boxGeometry args={[0.018, 0.075, 0.018]} />
          <meshToonMaterial color={C.dark} />
        </mesh>

        {/* Mancha frente */}
        <mesh position={[0.05, 0.22, 0.26]} rotation={[0.3, 0, 0.38]}>
          <planeGeometry args={[0.1, 0.065]} />
          <meshToonMaterial color={C.dark} />
        </mesh>
      </group>

      {/* ── Cola ──────────────────────────────────────────────────────────── */}
      <group ref={tailRef} position={[0.06, 0.06, -0.24]}>
        <mesh rotation={[0.65, 0, 0.4]}>
          <cylinderGeometry args={[0.052, 0.028, 0.65, 5]} />
          <meshToonMaterial color={C.body} />
        </mesh>
        <mesh position={[0.18, 0.3, -0.28]}>
          <sphereGeometry args={[0.07, 5, 4]} />
          <meshToonMaterial color={C.dark} />
        </mesh>
      </group>

      {/* ── Sombra proyectada en el suelo ─────────────────────────────────── */}
      <mesh position={[0, -0.56, 0.08]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.38, 16]} />
        <meshBasicMaterial color="#000000" opacity={0.15} transparent />
      </mesh>
    </group>
  );
}
