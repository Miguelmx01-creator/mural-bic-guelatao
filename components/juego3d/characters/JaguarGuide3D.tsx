'use client';

// Kimi — Jaguar guardián de la Sierra Norte
// Construido 100% con geometrías nativas de Three.js (sin GLTF, sin texturas externas).
// Estilo: Low-poly cartoon con MeshToonMaterial.

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

// Paleta del jaguar
const C = {
  body:    '#D4883A', // ámbar cálido
  belly:   '#F0DFB8', // crema
  dark:    '#2A1005', // café oscuro (manchas, nariz, pupilas)
  eye:     '#2E7D32', // verde selva
  pupil:   '#0D0D0D',
  ear:     '#C07830',
  gum:     '#E8A5A0',
} as const;

export default function JaguarGuide3D({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  isTalking = false,
  onClick,
}: Props) {
  const rootRef   = useRef<THREE.Group>(null!);
  const bodyRef   = useRef<THREE.Group>(null!);
  const headRef   = useRef<THREE.Group>(null!);
  const tailRef   = useRef<THREE.Group>(null!);
  const lEyeRef   = useRef<THREE.Mesh>(null!);
  const rEyeRef   = useRef<THREE.Mesh>(null!);
  const jawRef    = useRef<THREE.Mesh>(null!);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;

    // Flotación suave del cuerpo completo
    if (rootRef.current) {
      rootRef.current.position.y = position[1] + Math.sin(t * 1.4) * 0.05;
    }

    // Respira — el cuerpo se expande ligeramente
    if (bodyRef.current) {
      const breath = 1 + Math.sin(t * 1.6) * 0.015;
      bodyRef.current.scale.set(breath, 1 / breath, breath);
    }

    // Giro leve de la cabeza (idle look)
    if (headRef.current && !isTalking) {
      headRef.current.rotation.y = Math.sin(t * 0.5) * 0.12;
    }

    // Animación de hablar (jaw + head nod)
    if (isTalking) {
      if (jawRef.current) {
        jawRef.current.rotation.x = Math.abs(Math.sin(t * 8)) * 0.18;
      }
      if (headRef.current) {
        headRef.current.rotation.z = Math.sin(t * 5) * 0.04;
      }
    } else {
      if (jawRef.current) jawRef.current.rotation.x = 0;
    }

    // Cola: meneo
    if (tailRef.current) {
      tailRef.current.rotation.z = Math.sin(t * 2.5) * 0.4;
      tailRef.current.rotation.x = Math.sin(t * 1.8) * 0.15;
    }

    // Parpadeo cada ~3.5 s
    if (lEyeRef.current && rEyeRef.current) {
      const blinkPhase = t % 3.5;
      const scaleY = blinkPhase > 3.35 ? Math.max(0.05, 1 - (blinkPhase - 3.35) * 60) : 1;
      lEyeRef.current.scale.y = scaleY;
      rEyeRef.current.scale.y = scaleY;
    }
  });

  return (
    <group
      ref={rootRef}
      position={position}
      rotation={rotation}
      scale={scale}
      onClick={onClick}
    >
      {/* ── Cuerpo ──────────────────────────────────────────────────────── */}
      <group ref={bodyRef}>
        {/* Torso principal */}
        <mesh castShadow receiveShadow position={[0, 0, 0]}>
          <boxGeometry args={[0.55, 0.42, 0.82]} />
          <meshToonMaterial color={C.body} />
        </mesh>

        {/* Panza (más clara) */}
        <mesh position={[0, -0.08, 0.08]}>
          <boxGeometry args={[0.34, 0.28, 0.6]} />
          <meshToonMaterial color={C.belly} />
        </mesh>

        {/* Mancha dorsal */}
        <mesh position={[0, 0.22, -0.05]}>
          <boxGeometry args={[0.25, 0.04, 0.45]} />
          <meshToonMaterial color={C.dark} />
        </mesh>
      </group>

      {/* ── Cabeza ──────────────────────────────────────────────────────── */}
      <group ref={headRef} position={[0, 0.42, 0.32]}>

        {/* Cráneo */}
        <mesh castShadow>
          <sphereGeometry args={[0.27, 7, 6]} />
          <meshToonMaterial color={C.body} />
        </mesh>

        {/* Hocico */}
        <mesh position={[0, -0.06, 0.2]} scale={[1, 0.7, 0.85]}>
          <sphereGeometry args={[0.165, 6, 5]} />
          <meshToonMaterial color={C.belly} />
        </mesh>

        {/* Nariz */}
        <mesh position={[0, -0.01, 0.38]}>
          <sphereGeometry args={[0.04, 5, 4]} />
          <meshToonMaterial color={C.dark} />
        </mesh>

        {/* Mandíbula inferior (animada al hablar) */}
        <mesh ref={jawRef} position={[0, -0.12, 0.18]}>
          <boxGeometry args={[0.22, 0.07, 0.2]} />
          <meshToonMaterial color={C.belly} />
        </mesh>

        {/* Ojo izquierdo */}
        <mesh ref={lEyeRef} position={[-0.11, 0.07, 0.23]}>
          <sphereGeometry args={[0.055, 6, 5]} />
          <meshToonMaterial color={C.eye} />
        </mesh>
        <mesh position={[-0.11, 0.07, 0.285]}>
          <sphereGeometry args={[0.028, 5, 4]} />
          <meshToonMaterial color={C.pupil} />
        </mesh>
        {/* Brillo ocular */}
        <mesh position={[-0.095, 0.085, 0.295]}>
          <sphereGeometry args={[0.01, 4, 3]} />
          <meshToonMaterial color="white" />
        </mesh>

        {/* Ojo derecho */}
        <mesh ref={rEyeRef} position={[0.11, 0.07, 0.23]}>
          <sphereGeometry args={[0.055, 6, 5]} />
          <meshToonMaterial color={C.eye} />
        </mesh>
        <mesh position={[0.11, 0.07, 0.285]}>
          <sphereGeometry args={[0.028, 5, 4]} />
          <meshToonMaterial color={C.pupil} />
        </mesh>
        <mesh position={[0.125, 0.085, 0.295]}>
          <sphereGeometry args={[0.01, 4, 3]} />
          <meshToonMaterial color="white" />
        </mesh>

        {/* Oreja izquierda */}
        <mesh position={[-0.2, 0.24, 0.02]} rotation={[0, 0, -0.25]}>
          <coneGeometry args={[0.08, 0.18, 4]} />
          <meshToonMaterial color={C.ear} />
        </mesh>
        {/* Interior oreja izquierda */}
        <mesh position={[-0.2, 0.26, 0.04]} rotation={[0, 0, -0.25]}>
          <coneGeometry args={[0.045, 0.1, 4]} />
          <meshToonMaterial color={C.gum} />
        </mesh>

        {/* Oreja derecha */}
        <mesh position={[0.2, 0.24, 0.02]} rotation={[0, 0, 0.25]}>
          <coneGeometry args={[0.08, 0.18, 4]} />
          <meshToonMaterial color={C.ear} />
        </mesh>
        <mesh position={[0.2, 0.26, 0.04]} rotation={[0, 0, 0.25]}>
          <coneGeometry args={[0.045, 0.1, 4]} />
          <meshToonMaterial color={C.gum} />
        </mesh>

        {/* Rayas en mejillas */}
        <mesh position={[-0.21, -0.02, 0.12]} rotation={[0, 0.3, 0.8]}>
          <boxGeometry args={[0.03, 0.1, 0.03]} />
          <meshToonMaterial color={C.dark} />
        </mesh>
        <mesh position={[0.21, -0.02, 0.12]} rotation={[0, -0.3, -0.8]}>
          <boxGeometry args={[0.03, 0.1, 0.03]} />
          <meshToonMaterial color={C.dark} />
        </mesh>
      </group>

      {/* ── Patas delanteras ──────────────────────────────────────────────── */}
      {/* Pata delantera izquierda */}
      <mesh position={[-0.22, -0.32, 0.28]} castShadow>
        <cylinderGeometry args={[0.075, 0.065, 0.38, 5]} />
        <meshToonMaterial color={C.body} />
      </mesh>
      {/* Pata delantera derecha */}
      <mesh position={[0.22, -0.32, 0.28]} castShadow>
        <cylinderGeometry args={[0.075, 0.065, 0.38, 5]} />
        <meshToonMaterial color={C.body} />
      </mesh>

      {/* ── Patas traseras ────────────────────────────────────────────────── */}
      <mesh position={[-0.22, -0.32, -0.28]} castShadow>
        <cylinderGeometry args={[0.075, 0.065, 0.38, 5]} />
        <meshToonMaterial color={C.body} />
      </mesh>
      <mesh position={[0.22, -0.32, -0.28]} castShadow>
        <cylinderGeometry args={[0.075, 0.065, 0.38, 5]} />
        <meshToonMaterial color={C.body} />
      </mesh>

      {/* ── Cola ──────────────────────────────────────────────────────────── */}
      <group ref={tailRef} position={[0.06, 0.12, -0.5]}>
        <mesh rotation={[0.6, 0, 0.4]}>
          <cylinderGeometry args={[0.055, 0.03, 0.65, 5]} />
          <meshToonMaterial color={C.body} />
        </mesh>
        {/* Punta de la cola */}
        <mesh position={[0.18, 0.3, -0.28]}>
          <sphereGeometry args={[0.07, 5, 4]} />
          <meshToonMaterial color={C.dark} />
        </mesh>
      </group>

      {/* ── Sombra proyectada en el suelo (círculo) ───────────────────────── */}
      <mesh position={[0, -0.52, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.38, 16]} />
        <meshBasicMaterial color="#000000" opacity={0.15} transparent />
      </mesh>
    </group>
  );
}
