'use client';

// Nodo interactivo de comunidad en el mapa 3D.
// Estados visuales:
//   locked    → gris/opaco, sin glow
//   available → color de comunidad, glow pulsante, corona de partículas (si es actual)
//   completed → dorado, estrella flotante

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Billboard } from '@react-three/drei';
import * as THREE from 'three';
import { useGame } from '../engine/GameContext';

// ─── Tipos ────────────────────────────────────────────────────────────────────
type NodeStatus = 'locked' | 'available' | 'completed';

interface CommunityNodeProps {
  nivel: number;             // 1-5
  nombre: string;
  emoji: string;
  color: string;             // color de la comunidad
  position: [number, number, number];
  status: NodeStatus;
  isCurrent: boolean;        // es el siguiente nivel a jugar
}

// ─── Paleta por estado ────────────────────────────────────────────────────────
const LOCKED_COLOR    = '#4A5040';
const COMPLETED_COLOR = '#F2C14E';

// ─── Anillo de partículas orbitando el nodo actual ───────────────────────────
function ParticleRing({ color }: { color: string }) {
  const ref = useRef<THREE.Points>(null);

  const { positions, colors: colorsAttr } = useMemo(() => {
    const count = 28;
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const c = new THREE.Color(color);
    const radiusBase = 1.05;

    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const r = radiusBase + (Math.random() - 0.5) * 0.12;
      pos[i * 3]     = Math.cos(angle) * r;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 0.4;
      pos[i * 3 + 2] = Math.sin(angle) * r;
      col[i * 3]     = c.r + (Math.random() - 0.5) * 0.2;
      col[i * 3 + 1] = c.g + (Math.random() - 0.5) * 0.2;
      col[i * 3 + 2] = c.b + (Math.random() - 0.5) * 0.2;
    }
    return { positions: pos, colors: col };
  }, [color]);

  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.y += dt * 0.7;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colorsAttr, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.055}
        vertexColors
        transparent
        opacity={0.9}
        depthWrite={false}
      />
    </points>
  );
}

// ─── Estrella de completado (nodo dorado) ────────────────────────────────────
function CompletadoStar() {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.position.y = 1.9 + Math.sin(state.clock.elapsedTime * 1.8) * 0.08;
    ref.current.rotation.y += 0.02;
  });
  return (
    <group ref={ref}>
      {/* Cuerpo de estrella: octaedro pequeño dorado */}
      <mesh>
        <octahedronGeometry args={[0.14, 0]} />
        <meshToonMaterial color="#F2C14E" emissive="#E5A020" emissiveIntensity={0.5} />
      </mesh>
    </group>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────
export default function CommunityNode({
  nivel,
  nombre,
  emoji,
  color,
  position,
  status,
  isCurrent,
}: CommunityNodeProps) {
  const { dispatch } = useGame();
  const groupRef = useRef<THREE.Group>(null);
  const orbRef   = useRef<THREE.Mesh>(null);
  const glowRef  = useRef<THREE.Mesh>(null);
  const lightRef = useRef<THREE.PointLight>(null);

  const isInteractable = status !== 'locked';
  const nodeColor = status === 'locked'
    ? LOCKED_COLOR
    : status === 'completed'
      ? COMPLETED_COLOR
      : color;

  // Hover state (mouse/touch down scale)
  const scaleRef = useRef(1);

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    // Levitación del orb
    if (orbRef.current) {
      orbRef.current.position.y = 1.25 + Math.sin(t * 1.4 + nivel) * 0.1;
      if (isInteractable) {
        orbRef.current.rotation.y += 0.008;
      }
    }

    // Pulso del glow (solo nodos desbloqueados)
    if (glowRef.current && isInteractable) {
      const s = 1 + Math.sin(t * 2.2 + nivel) * 0.12;
      glowRef.current.scale.setScalar(s);
      (glowRef.current.material as THREE.MeshBasicMaterial).opacity =
        0.18 + Math.sin(t * 2.2 + nivel) * 0.08;
    }

    // Pulso de la luz puntual
    if (lightRef.current && isInteractable) {
      lightRef.current.intensity = isCurrent
        ? 1.4 + Math.sin(t * 2.2 + nivel) * 0.4
        : 0.6 + Math.sin(t * 1.6) * 0.15;
    }

    // Escala del nodo actual (bounce suave)
    if (groupRef.current && isCurrent) {
      const bounce = 1 + Math.sin(t * 1.8) * 0.025;
      groupRef.current.scale.setScalar(bounce * scaleRef.current);
    }
  });

  function handleClick() {
    if (!isInteractable) return;
    dispatch({ type: 'SET_COMMUNITY', nivel });
  }

  return (
    <group
      ref={groupRef}
      position={position}
      onClick={handleClick}
      onPointerDown={() => { if (isInteractable) { scaleRef.current = 0.92; } }}
      onPointerUp={() => { scaleRef.current = 1; }}
      onPointerOut={() => { scaleRef.current = 1; }}
    >
      {/* ── Plataforma hexagonal ──────────────────────────────────────────── */}
      <mesh position={[0, 0.11, 0]} rotation={[0, Math.PI / 6, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.82, 0.82, 0.22, 6]} />
        <meshToonMaterial color={nodeColor} />
      </mesh>
      {/* Borde inferior */}
      <mesh position={[0, -0.01, 0]} rotation={[0, Math.PI / 6, 0]}>
        <cylinderGeometry args={[0.9, 0.82, 0.1, 6]} />
        <meshToonMaterial
          color={isInteractable ? nodeColor : '#2E3530'}
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* ── Orb central flotante ──────────────────────────────────────────── */}
      <mesh ref={orbRef} position={[0, 1.25, 0]} castShadow>
        <sphereGeometry args={[0.36, 8, 6]} />
        <meshToonMaterial
          color={nodeColor}
          emissive={isInteractable ? nodeColor : '#000000'}
          emissiveIntensity={isInteractable ? 0.3 : 0}
        />
      </mesh>

      {/* Glow del orb (solo desbloqueado) */}
      {isInteractable && (
        <mesh ref={glowRef} position={[0, 1.25, 0]}>
          <sphereGeometry args={[0.52, 8, 6]} />
          <meshBasicMaterial
            color={nodeColor}
            transparent
            opacity={0.18}
            side={THREE.BackSide}
            depthWrite={false}
          />
        </mesh>
      )}

      {/* ── Luz puntual del nodo ──────────────────────────────────────────── */}
      {isInteractable && (
        <pointLight
          ref={lightRef}
          position={[0, 1.4, 0]}
          color={nodeColor}
          intensity={isCurrent ? 1.6 : 0.6}
          distance={3.5}
          decay={2}
        />
      )}

      {/* ── Número de nivel ───────────────────────────────────────────────── */}
      <Billboard position={[0, 0.95, 0]}>
        <Text
          fontSize={0.32}
          color={status === 'locked' ? '#6B7A60' : '#FFFFFF'}
          font={undefined}
          anchorX="center"
          anchorY="middle"
          outlineColor="#000000"
          outlineWidth={0.02}
        >
          {nivel}
        </Text>
      </Billboard>

      {/* ── Nombre de la comunidad (Billboard para que siempre mire) ─────── */}
      <Billboard position={[0, -0.32, 0]}>
        <Text
          fontSize={0.2}
          color={isInteractable ? '#FFFFFF' : '#5A6B52'}
          anchorX="center"
          anchorY="middle"
          outlineColor="#000000"
          outlineWidth={0.015}
          maxWidth={2.2}
        >
          {nombre}
        </Text>
      </Billboard>

      {/* ── Emoji de comunidad ────────────────────────────────────────────── */}
      <Billboard position={[0, 1.25, 0.38]}>
        <Text fontSize={0.22} anchorX="center" anchorY="middle">
          {emoji}
        </Text>
      </Billboard>

      {/* ── Corona de partículas (nodo actual) ───────────────────────────── */}
      {isCurrent && <ParticleRing color={color} />}

      {/* ── Indicador "AQUÍ" para el nodo actual ─────────────────────────── */}
      {isCurrent && (
        <Billboard position={[0, 2.1, 0]}>
          <Text
            fontSize={0.17}
            color={color}
            anchorX="center"
            anchorY="middle"
            outlineColor="#000000"
            outlineWidth={0.015}
          >
            {'▼ TAP'}
          </Text>
        </Billboard>
      )}

      {/* ── Estrella de completado ─────────────────────────────────────────── */}
      {status === 'completed' && <CompletadoStar />}

      {/* ── Candado en nodos bloqueados ───────────────────────────────────── */}
      {status === 'locked' && (
        <Billboard position={[0, 1.7, 0]}>
          <Text fontSize={0.28} anchorX="center" anchorY="middle">
            🔒
          </Text>
        </Billboard>
      )}

      {/* ── Sombra proyectada en el suelo ─────────────────────────────────── */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <circleGeometry args={[0.85, 10]} />
        <meshBasicMaterial
          color="#000000"
          transparent
          opacity={0.12}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}
