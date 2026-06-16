'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Billboard } from '@react-three/drei';
import * as THREE from 'three';
import { useGame } from '../engine/GameContext';

type NodeStatus = 'locked' | 'available' | 'completed';

interface CommunityNodeProps {
  nivel:    number;
  nombre:   string;
  emoji:    string;
  color:    string;
  position: [number, number, number];
  status:   NodeStatus;
  isCurrent: boolean;
}

// ─── Anillo de partículas orbitando el nodo activo ───────────────────────────
function ParticleRing({ color }: { color: string }) {
  const ref = useRef<THREE.Points>(null!);
  const { positions, colors: col } = useMemo(() => {
    const count = 32;
    const pos = new Float32Array(count * 3);
    const clr = new Float32Array(count * 3);
    const c = new THREE.Color(color);
    for (let i = 0; i < count; i++) {
      const a = (i / count) * Math.PI * 2;
      const r = 1.0 + (Math.random() - 0.5) * 0.1;
      pos[i * 3]     = Math.cos(a) * r;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 0.3;
      pos[i * 3 + 2] = Math.sin(a) * r;
      clr[i * 3]     = Math.min(1, c.r + Math.random() * 0.2);
      clr[i * 3 + 1] = Math.min(1, c.g + Math.random() * 0.2);
      clr[i * 3 + 2] = Math.min(1, c.b + Math.random() * 0.2);
    }
    return { positions: pos, colors: clr };
  }, [color]);

  useFrame((_, dt) => { if (ref.current) ref.current.rotation.y += dt * 0.8; });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color"    args={[col, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.06} vertexColors transparent opacity={0.9} depthWrite={false} />
    </points>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────
export default function CommunityNode({
  nivel, nombre, emoji, color, position, status, isCurrent,
}: CommunityNodeProps) {
  const { dispatch } = useGame();
  const groupRef = useRef<THREE.Group>(null!);
  const orbRef   = useRef<THREE.Mesh>(null!);
  const glowRef  = useRef<THREE.Mesh>(null!);
  const lightRef = useRef<THREE.PointLight>(null!);
  const scaleRef = useRef(1);

  const isInteractable = status !== 'locked';
  const nodeColor = status === 'locked' ? '#3A4535' : status === 'completed' ? '#F2C14E' : color;

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (orbRef.current) {
      orbRef.current.position.y = 1.3 + Math.sin(t * 1.4 + nivel) * 0.1;
      if (isInteractable) orbRef.current.rotation.y += 0.01;
    }
    if (glowRef.current && isInteractable) {
      const s = 1 + Math.sin(t * 2.2 + nivel) * 0.12;
      glowRef.current.scale.setScalar(s);
      (glowRef.current.material as THREE.MeshBasicMaterial).opacity =
        0.15 + Math.sin(t * 2.2 + nivel) * 0.07;
    }
    if (lightRef.current && isInteractable) {
      lightRef.current.intensity = isCurrent
        ? 1.8 + Math.sin(t * 2.2 + nivel) * 0.5
        : 0.7 + Math.sin(t * 1.6) * 0.15;
    }
    if (groupRef.current && isCurrent) {
      groupRef.current.scale.setScalar(1 + Math.sin(t * 1.8) * 0.02);
    }
  });

  function handleClick() {
    if (!isInteractable) return;
    dispatch({ type: 'SET_COMMUNITY', nivel });
  }

  const platColor = isInteractable ? nodeColor : '#252E22';

  return (
    <group
      ref={groupRef}
      position={position}
      onClick={handleClick}
      onPointerDown={() => { if (isInteractable) scaleRef.current = 0.92; }}
      onPointerUp={() => { scaleRef.current = 1; }}
      onPointerOut={() => { scaleRef.current = 1; }}
    >
      {/* ── Plataforma hexagonal procedural ──────────────────────────────── */}
      <mesh position={[0, 0.08, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[0.72, 0.82, 0.16, 6]} />
        <meshStandardMaterial color={platColor} roughness={0.6} metalness={0.1} />
      </mesh>
      {/* segundo nivel */}
      <mesh position={[0, 0.22, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[0.52, 0.65, 0.12, 6]} />
        <meshStandardMaterial color={platColor} roughness={0.5} metalness={0.15} />
      </mesh>

      {/* ── Pilar central ────────────────────────────────────────────────── */}
      <mesh position={[0, 0.65, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.1, 0.8, 8]} />
        <meshStandardMaterial color={isInteractable ? nodeColor : '#252E22'} roughness={0.4} metalness={0.3} />
      </mesh>

      {/* ── Orb flotante (dodecaedro) ─────────────────────────────────────── */}
      <mesh ref={orbRef} position={[0, 1.3, 0]} castShadow>
        <dodecahedronGeometry args={[0.26, 0]} />
        <meshStandardMaterial
          color={nodeColor}
          emissive={isInteractable ? nodeColor : '#000000'}
          emissiveIntensity={isInteractable ? 0.4 : 0}
          roughness={0.2}
          metalness={0.5}
        />
      </mesh>

      {/* Glow del orb */}
      {isInteractable && (
        <mesh ref={glowRef} position={[0, 1.3, 0]}>
          <sphereGeometry args={[0.42, 8, 6]} />
          <meshBasicMaterial color={nodeColor} transparent opacity={0.15} side={THREE.BackSide} depthWrite={false} />
        </mesh>
      )}

      {/* ── Luz puntual ───────────────────────────────────────────────────── */}
      {isInteractable && (
        <pointLight ref={lightRef} position={[0, 1.5, 0]} color={nodeColor}
          intensity={isCurrent ? 1.8 : 0.7} distance={3.5} decay={2} />
      )}

      {/* ── Número de nivel ───────────────────────────────────────────────── */}
      <Billboard position={[0, 0.95, 0]}>
        <Text fontSize={0.26} color={isInteractable ? '#FFFFFF' : '#5A6B52'}
          anchorX="center" anchorY="middle" outlineColor="#000000" outlineWidth={0.02}>
          {nivel}
        </Text>
      </Billboard>

      {/* ── Nombre ────────────────────────────────────────────────────────── */}
      <Billboard position={[0, -0.25, 0]}>
        <Text fontSize={0.18} color={isInteractable ? '#E8E8E8' : '#4A5840'}
          anchorX="center" anchorY="middle" outlineColor="#000000" outlineWidth={0.012} maxWidth={2.4}>
          {nombre}
        </Text>
      </Billboard>

      {/* ── Emoji ─────────────────────────────────────────────────────────── */}
      <Billboard position={[0, 1.3, 0.3]}>
        <Text fontSize={0.18} anchorX="center" anchorY="middle">{emoji}</Text>
      </Billboard>

      {/* ── Partículas si es el nodo activo ──────────────────────────────── */}
      {isCurrent && <ParticleRing color={color} />}

      {/* ── TAP ──────────────────────────────────────────────────────────── */}
      {isCurrent && (
        <Billboard position={[0, 2.1, 0]}>
          <Text fontSize={0.15} color={color} anchorX="center" anchorY="middle"
            outlineColor="#000000" outlineWidth={0.012}>
            {'▼ TAP'}
          </Text>
        </Billboard>
      )}

      {/* ── Candado ───────────────────────────────────────────────────────── */}
      {status === 'locked' && (
        <Billboard position={[0, 1.75, 0]}>
          <Text fontSize={0.26} anchorX="center" anchorY="middle">🔒</Text>
        </Billboard>
      )}

      {/* ── Sombra en suelo ───────────────────────────────────────────────── */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]}>
        <circleGeometry args={[0.85, 6]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.18} depthWrite={false} />
      </mesh>
    </group>
  );
}
