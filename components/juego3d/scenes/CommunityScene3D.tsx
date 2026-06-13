'use client';

// Escenario 3D por comunidad.
// Flujo: al montar (scene==='community') → abre diálogo de Kimi → cuando termina → SET_SCENE 'minigame'.
// Cuando scene==='minigame' el mismo escenario sigue renderizando como fondo dimido.

import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { useGame } from '../engine/GameContext';
import JaguarGuide3D from '../characters/JaguarGuide3D';
import { COMMUNITY_DIALOGS } from '@/lib/dialogs';

// ─── Árbol de pino (reutilizable aquí) ───────────────────────────────────────
function Pino({ position, s = 1 }: { position: [number, number, number]; s?: number }) {
  return (
    <group position={position} scale={s}>
      <mesh position={[0, -0.2, 0]} castShadow>
        <cylinderGeometry args={[0.07, 0.1, 0.55, 5]} />
        <meshToonMaterial color="#4A2D10" />
      </mesh>
      <mesh position={[0, 0.32, 0]} castShadow>
        <coneGeometry args={[0.52, 0.85, 6]} />
        <meshToonMaterial color="#1B5E20" />
      </mesh>
      <mesh position={[0, 0.82, 0]} castShadow>
        <coneGeometry args={[0.34, 0.65, 6]} />
        <meshToonMaterial color="#2E7D32" />
      </mesh>
      <mesh position={[0, 1.2, 0]} castShadow>
        <coneGeometry args={[0.2, 0.45, 6]} />
        <meshToonMaterial color="#388E3C" />
      </mesh>
    </group>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// NIVEL 1 — Capulalpam de Méndez
// Iglesia colonial, cabañas de ecoturismo, bosque de pinos, colores ámbar
// ═══════════════════════════════════════════════════════════════════════════════
function CapulalpamEnv() {
  return (
    <>
      <ambientLight intensity={0.45} color="#3A2A10" />
      <directionalLight position={[-5, 9, 4]} intensity={1.1} color="#FFE0A0" castShadow shadow-mapSize={[512, 512]} />
      <pointLight position={[2, 2, 2]} intensity={0.5} color="#F2C14E" distance={8} />
      <fog attach="fog" args={['#1A0E05', 14, 26]} />

      {/* Suelo */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.55, 0]} receiveShadow>
        <planeGeometry args={[40, 40]} />
        <meshToonMaterial color="#2A3818" />
      </mesh>

      {/* Iglesia colonial */}
      <group position={[-1.8, -0.55, -5]}>
        {/* Nave */}
        <mesh position={[0, 1.2, 0]} castShadow>
          <boxGeometry args={[2.4, 2.4, 3.2]} />
          <meshToonMaterial color="#D8C8A8" />
        </mesh>
        {/* Torre campanario */}
        <mesh position={[0.8, 3.0, -0.8]} castShadow>
          <boxGeometry args={[0.9, 1.8, 0.9]} />
          <meshToonMaterial color="#D8C8A8" />
        </mesh>
        {/* Techo de nave (pirámide baja) */}
        <mesh position={[0, 2.6, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
          <coneGeometry args={[1.9, 0.7, 4]} />
          <meshToonMaterial color="#A05030" />
        </mesh>
        {/* Techo torre */}
        <mesh position={[0.8, 4.2, -0.8]} rotation={[0, Math.PI / 4, 0]} castShadow>
          <coneGeometry args={[0.72, 0.9, 4]} />
          <meshToonMaterial color="#A05030" />
        </mesh>
        {/* Cruz */}
        <mesh position={[0.8, 5.25, -0.8]} castShadow>
          <boxGeometry args={[0.07, 0.55, 0.07]} />
          <meshToonMaterial color="#6B4914" />
        </mesh>
        <mesh position={[0.8, 5.25, -0.8]} castShadow>
          <boxGeometry args={[0.3, 0.07, 0.07]} />
          <meshToonMaterial color="#6B4914" />
        </mesh>
        {/* Arco de entrada */}
        <mesh position={[0, 0.55, 1.61]} castShadow>
          <boxGeometry args={[0.9, 1.4, 0.08]} />
          <meshToonMaterial color="#C8B898" />
        </mesh>
      </group>

      {/* Cabaña de ecoturismo izquierda */}
      <group position={[2.5, -0.55, -3.5]}>
        <mesh position={[0, 0.5, 0]} castShadow>
          <boxGeometry args={[1.2, 1, 1.2]} />
          <meshToonMaterial color="#6B3A1F" />
        </mesh>
        <mesh position={[0, 1.25, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
          <coneGeometry args={[1.0, 0.7, 4]} />
          <meshToonMaterial color="#3A200A" />
        </mesh>
      </group>

      {/* Cabaña derecha */}
      <group position={[3.5, -0.55, -5.5]}>
        <mesh position={[0, 0.5, 0]} castShadow>
          <boxGeometry args={[1.0, 0.9, 1.0]} />
          <meshToonMaterial color="#5C3219" />
        </mesh>
        <mesh position={[0, 1.1, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
          <coneGeometry args={[0.85, 0.6, 4]} />
          <meshToonMaterial color="#321508" />
        </mesh>
      </group>

      {/* Pinos de fondo */}
      <Pino position={[-4,  -0.55, -6.5]} s={1.3} />
      <Pino position={[-5.5,-0.55, -5]}   s={1.0} />
      <Pino position={[-3,  -0.55, -8]}   s={1.5} />
      <Pino position={[4.5, -0.55, -6]}   s={1.2} />
      <Pino position={[5.5, -0.55, -4.5]} s={0.9} />
      <Pino position={[-6,  -0.55, -2]}   s={1.1} />
      <Pino position={[6,   -0.55, -2]}   s={1.0} />
      <Pino position={[0,   -0.55, -9]}   s={1.6} />

      {/* Montañas de fondo */}
      {[[-9,-0.5,-11], [0,-0.5,-13], [9,-0.5,-11], [-13,-0.5,-6], [13,-0.5,-6]].map(([x,y,z], i) => (
        <mesh key={i} position={[x, y, z] as [number,number,number]} scale={[2.5+i*0.3, 3+i*0.5, 2.5+i*0.3]}>
          <coneGeometry args={[1, 2.2, 5]} />
          <meshToonMaterial color={i % 2 === 0 ? '#1A2A0A' : '#0F1A07'} />
        </mesh>
      ))}
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// NIVEL 2 — Chicomezuchil
// Milpa de maíz, casa de adobe, asamblea, colores teal/verde
// ═══════════════════════════════════════════════════════════════════════════════
function MilpaPlant({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.6, 0]} castShadow>
        <cylinderGeometry args={[0.045, 0.07, 1.3, 5]} />
        <meshToonMaterial color="#4CAF50" />
      </mesh>
      {/* Hojas */}
      {[[-0.28, 0.7, 0], [0.28, 0.5, 0], [0, 0.9, 0.22]].map(([lx, ly, lz], i) => (
        <mesh key={i} position={[lx, ly, lz] as [number,number,number]} rotation={[0.3, i * 1.1, 0.5 - i * 0.3]}>
          <coneGeometry args={[0.12, 0.7, 3]} />
          <meshToonMaterial color="#388E3C" />
        </mesh>
      ))}
      {/* Mazorca */}
      <mesh position={[0.18, 0.9, 0]} rotation={[0, 0, -0.4]}>
        <cylinderGeometry args={[0.085, 0.07, 0.35, 6]} />
        <meshToonMaterial color="#F5B222" />
      </mesh>
    </group>
  );
}

function ChicomezuchilEnv() {
  return (
    <>
      <ambientLight intensity={0.5} color="#0A1A18" />
      <directionalLight position={[4, 10, 3]} intensity={0.95} color="#D0FFE8" castShadow shadow-mapSize={[512, 512]} />
      <pointLight position={[-2, 2, 1]} intensity={0.4} color="#2FB89A" distance={8} />
      <fog attach="fog" args={['#081510', 13, 25]} />

      {/* Suelo */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.55, 0]} receiveShadow>
        <planeGeometry args={[40, 40]} />
        <meshToonMaterial color="#1A3020" />
      </mesh>

      {/* Casa de adobe */}
      <group position={[-2.5, -0.55, -5.5]}>
        <mesh position={[0, 0.85, 0]} castShadow>
          <boxGeometry args={[3, 1.7, 2.2]} />
          <meshToonMaterial color="#A0785A" />
        </mesh>
        {/* Techo plano con viga */}
        <mesh position={[0, 1.76, 0]} castShadow>
          <boxGeometry args={[3.2, 0.15, 2.4]} />
          <meshToonMaterial color="#6B4A30" />
        </mesh>
        {/* Puerta */}
        <mesh position={[0, 0.5, 1.12]}>
          <boxGeometry args={[0.65, 1.1, 0.08]} />
          <meshToonMaterial color="#4A2D10" />
        </mesh>
        {/* Ventana */}
        <mesh position={[0.9, 0.9, 1.12]}>
          <boxGeometry args={[0.5, 0.45, 0.06]} />
          <meshToonMaterial color="#7BB3C8" />
        </mesh>
      </group>

      {/* Milpa */}
      {[
        [1.5, -0.55, -3.5], [2.2, -0.55, -4.2], [2.9, -0.55, -3.8],
        [3.5, -0.55, -4.8], [1.8, -0.55, -5.4], [2.7, -0.55, -5.6],
        [3.8, -0.55, -5.2], [4.2, -0.55, -3.5], [1.2, -0.55, -6.2],
      ].map(([x, y, z], i) => (
        <MilpaPlant key={i} position={[x, y, z] as [number,number,number]} />
      ))}

      {/* Milpa segunda fila */}
      {[
        [3.8, -0.55, -6.5], [4.5, -0.55, -5.8], [5, -0.55, -4.5], [4.8, -0.55, -3.2],
      ].map(([x, y, z], i) => (
        <MilpaPlant key={`b${i}`} position={[x, y, z] as [number,number,number]} />
      ))}

      {/* Cerros de fondo */}
      {[[-8,-0.5,-10], [0,-0.5,-12], [8,-0.5,-10], [-12,-0.5,-5], [12,-0.5,-5]].map(([x,y,z], i) => (
        <mesh key={i} position={[x, y, z] as [number,number,number]} scale={[2+i*0.2, 3.5+i*0.4, 2+i*0.2]}>
          <coneGeometry args={[1, 2, 5]} />
          <meshToonMaterial color={i % 2 === 0 ? '#0A1A10' : '#081408'} />
        </mesh>
      ))}
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// NIVEL 3 — El Huamuchil
// Maguey/agave, manantial, adobe, colores terracota
// ═══════════════════════════════════════════════════════════════════════════════
function Agave({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Centro */}
      <mesh>
        <cylinderGeometry args={[0.08, 0.12, 0.4, 6]} />
        <meshToonMaterial color="#8FB840" />
      </mesh>
      {/* Pencas */}
      {[0, 60, 120, 180, 240, 300].map((deg, i) => {
        const rad = (deg * Math.PI) / 180;
        return (
          <mesh
            key={i}
            position={[Math.cos(rad) * 0.3, 0.1, Math.sin(rad) * 0.3] as [number,number,number]}
            rotation={[0.6, rad, 0]}
          >
            <coneGeometry args={[0.06, 0.9, 4]} />
            <meshToonMaterial color="#6A9020" />
          </mesh>
        );
      })}
    </group>
  );
}

function HuamuchilEnv() {
  return (
    <>
      <ambientLight intensity={0.4} color="#2A1808" />
      <directionalLight position={[6, 8, 2]} intensity={1.0} color="#FFD090" castShadow shadow-mapSize={[512, 512]} />
      <pointLight position={[-1.5, 1.5, 0]} intensity={0.6} color="#E5532E" distance={8} />
      <fog attach="fog" args={['#1A0D05', 14, 26]} />

      {/* Suelo árido-serrano */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.55, 0]} receiveShadow>
        <planeGeometry args={[40, 40]} />
        <meshToonMaterial color="#3A2D18" />
      </mesh>

      {/* Muro de adobe */}
      <mesh position={[-3, -0.05, -4.5]} castShadow>
        <boxGeometry args={[5, 1.2, 0.3]} />
        <meshToonMaterial color="#9B6B40" />
      </mesh>

      {/* Casa adobe simple */}
      <group position={[2.5, -0.55, -6]}>
        <mesh position={[0, 0.75, 0]} castShadow>
          <boxGeometry args={[2.5, 1.5, 2]} />
          <meshToonMaterial color="#B07840" />
        </mesh>
        <mesh position={[0, 1.58, 0]} castShadow>
          <boxGeometry args={[2.7, 0.2, 2.2]} />
          <meshToonMaterial color="#7A4A20" />
        </mesh>
      </group>

      {/* Manantial (charco) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0.5, -0.53, -2.5]}>
        <circleGeometry args={[0.7, 10]} />
        <meshToonMaterial color="#1565A4" />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0.5, -0.54, -2.5]}>
        <ringGeometry args={[0.7, 0.95, 10]} />
        <meshToonMaterial color="#2A5030" />
      </mesh>

      {/* Agaves */}
      {[
        [-2.5, -0.55, -2.8], [-3.5, -0.55, -4], [-1.8, -0.55, -5],
        [3.8, -0.55, -3.5], [4.5, -0.55, -5.2], [5, -0.55, -2.8],
        [-0.5, -0.55, -7], [1.5, -0.55, -7.5],
      ].map(([x, y, z], i) => (
        <Agave key={i} position={[x, y, z] as [number,number,number]} />
      ))}

      {/* Lomas de fondo */}
      {[[-9,-0.5,-10], [0,-0.5,-11], [9,-0.5,-10], [-13,-0.5,-5], [13,-0.5,-5]].map(([x,y,z], i) => (
        <mesh key={i} position={[x, y, z] as [number,number,number]} scale={[2.5+i*0.2, 2.5+i*0.6, 2.5+i*0.2]}>
          <coneGeometry args={[1, 1.8, 5]} />
          <meshToonMaterial color={i % 2 === 0 ? '#2A1808' : '#1A1005'} />
        </mesh>
      ))}
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// NIVEL 4 — Guelatao de Juárez
// Laguna Encantada, monumento a Juárez, pinos, luz dorada de amanecer
// ═══════════════════════════════════════════════════════════════════════════════
function GuelataoEnv() {
  const lagRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (lagRef.current) {
      (lagRef.current.material as THREE.MeshBasicMaterial).opacity =
        0.82 + Math.sin(state.clock.elapsedTime * 0.8) * 0.06;
    }
  });

  return (
    <>
      <ambientLight intensity={0.5} color="#1A1A30" />
      <directionalLight position={[-4, 9, 5]} intensity={1.1} color="#FFE0A0" castShadow shadow-mapSize={[512, 512]} />
      <pointLight position={[0, 1, -2]} intensity={0.7} color="#F2C14E" distance={10} />
      <fog attach="fog" args={['#0D0D1A', 14, 26]} />

      {/* Suelo */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.55, 0]} receiveShadow>
        <planeGeometry args={[40, 40]} />
        <meshToonMaterial color="#1E3020" />
      </mesh>

      {/* Laguna Encantada — círculo escalado para dar forma ovalada */}
      {/* Ribera (capa inferior) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-1, -0.535, -4.5]} scale={[1, 0.65, 1]}>
        <circleGeometry args={[3.2, 14]} />
        <meshToonMaterial color="#2A4828" />
      </mesh>
      {/* Agua (capa superior) */}
      <mesh ref={lagRef} rotation={[-Math.PI / 2, 0, 0]} position={[-1, -0.52, -4.5]} scale={[1, 0.65, 1]}>
        <circleGeometry args={[2.6, 14]} />
        <meshBasicMaterial color="#1A5A9A" transparent opacity={0.85} />
      </mesh>
      {/* Reflejo en el agua */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-0.5, -0.51, -4]}>
        <planeGeometry args={[0.8, 0.2]} />
        <meshBasicMaterial color="white" transparent opacity={0.18} />
      </mesh>

      {/* Monumento a Benito Juárez */}
      <group position={[2.5, -0.55, -5.5]}>
        {/* Pedestal */}
        <mesh position={[0, 0.7, 0]} castShadow>
          <boxGeometry args={[0.9, 1.4, 0.9]} />
          <meshToonMaterial color="#9A8B70" />
        </mesh>
        {/* Figura */}
        <mesh position={[0, 1.85, 0]} castShadow>
          <boxGeometry args={[0.35, 0.9, 0.25]} />
          <meshToonMaterial color="#3A3020" />
        </mesh>
        {/* Cabeza */}
        <mesh position={[0, 2.62, 0]} castShadow>
          <sphereGeometry args={[0.19, 7, 5]} />
          <meshToonMaterial color="#6B4520" />
        </mesh>
        {/* Libro */}
        <mesh position={[-0.2, 2.0, 0.15]} rotation={[0, 0, 0.3]} castShadow>
          <boxGeometry args={[0.22, 0.15, 0.06]} />
          <meshToonMaterial color="#1A1A2A" />
        </mesh>
      </group>

      {/* Pinos alrededor de la laguna */}
      <Pino position={[-4.5, -0.55, -5]} s={1.2} />
      <Pino position={[-5,   -0.55, -3]} s={0.9} />
      <Pino position={[1,    -0.55, -7]} s={1.3} />
      <Pino position={[-1.5, -0.55, -7.5]} s={1.1} />
      <Pino position={[4,    -0.55, -7]} s={1.0} />
      <Pino position={[5,    -0.55, -4]} s={0.85} />
      <Pino position={[-6.5, -0.55, -4]} s={1.4} />

      {/* Montañas */}
      {[[-9,-0.5,-11], [0,-0.5,-13], [9,-0.5,-11], [-13,-0.5,-5], [13,-0.5,-5]].map(([x,y,z], i) => (
        <mesh key={i} position={[x, y, z] as [number,number,number]} scale={[2.5, 4+i*0.5, 2.5]}>
          <coneGeometry args={[1, 2.5, 5]} />
          <meshToonMaterial color={i % 2 === 0 ? '#0A1205' : '#0F1A0A'} />
        </mesh>
      ))}
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// NIVEL 5 — San Cristóbal Lachirioag
// Cerro sagrado Yiawiz, bosque de niebla, colores teal
// ═══════════════════════════════════════════════════════════════════════════════
function ArbolNiebla({ position, s = 1 }: { position: [number, number, number]; s?: number }) {
  return (
    <group position={position} scale={s}>
      <mesh position={[0, -0.1, 0]} castShadow>
        <cylinderGeometry args={[0.06, 0.09, 0.5, 5]} />
        <meshToonMaterial color="#3A2810" />
      </mesh>
      <mesh position={[0, 0.55, 0]} castShadow>
        <sphereGeometry args={[0.55, 6, 5]} />
        <meshToonMaterial color="#1A4A38" />
      </mesh>
      <mesh position={[0, 0.92, 0]} castShadow>
        <sphereGeometry args={[0.38, 6, 5]} />
        <meshToonMaterial color="#2A6A50" />
      </mesh>
    </group>
  );
}

function LachirioagEnv() {
  const mistRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (mistRef.current) {
      (mistRef.current.material as THREE.MeshBasicMaterial).opacity =
        0.28 + Math.sin(state.clock.elapsedTime * 0.4) * 0.08;
    }
  });

  return (
    <>
      <ambientLight intensity={0.45} color="#0A1A18" />
      <directionalLight position={[3, 10, 4]} intensity={0.9} color="#C8FFE8" castShadow shadow-mapSize={[512, 512]} />
      <pointLight position={[-1, 2, 0.5]} intensity={0.5} color="#2FB89A" distance={9} />
      <fog attach="fog" args={['#051510', 12, 24]} />

      {/* Suelo bosque nublado */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.55, 0]} receiveShadow>
        <planeGeometry args={[40, 40]} />
        <meshToonMaterial color="#152818" />
      </mesh>

      {/* Yiawiz — Cerro Sagrado (cono grande, offset izquierda-fondo) */}
      <mesh position={[-3.5, 2.5, -9]} castShadow>
        <coneGeometry args={[4.5, 8, 5]} />
        <meshToonMaterial color="#0A2018" />
      </mesh>
      {/* Capa de niebla en el cerro */}
      <mesh ref={mistRef} rotation={[-Math.PI / 2, 0, 0]} position={[-3, 0.6, -8.5]}>
        <circleGeometry args={[4, 12]} />
        <meshBasicMaterial color="#2FB89A" transparent opacity={0.28} depthWrite={false} />
      </mesh>
      {/* Texto simbólico: roca con grabado */}
      <mesh position={[-2.5, -0.35, -2.5]} rotation={[0, 0.5, 0]} castShadow>
        <boxGeometry args={[0.5, 0.7, 0.2]} />
        <meshToonMaterial color="#2A3A30" />
      </mesh>

      {/* Bosque de niebla */}
      <ArbolNiebla position={[-4,  -0.55, -4]}   s={1.2} />
      <ArbolNiebla position={[-5.5,-0.55, -3]}   s={0.9} />
      <ArbolNiebla position={[-3.5,-0.55, -6]}   s={1.0} />
      <ArbolNiebla position={[3.5, -0.55, -4.5]} s={1.1} />
      <ArbolNiebla position={[5,   -0.55, -3.5]} s={0.95} />
      <ArbolNiebla position={[4.5, -0.55, -6]}   s={1.2} />
      <ArbolNiebla position={[2,   -0.55, -7]}   s={1.0} />
      <ArbolNiebla position={[-1.5,-0.55, -7.5]} s={1.15} />
      <ArbolNiebla position={[5.5, -0.55, -1.5]} s={0.85} />
      <ArbolNiebla position={[-5.5,-0.55, -1.5]} s={0.9} />

      {/* Plataforma comunitaria (losa ceremonial) */}
      <mesh position={[2.2, -0.48, -4]} castShadow rotation={[0, 0.3, 0]}>
        <cylinderGeometry args={[1.2, 1.2, 0.14, 6]} />
        <meshToonMaterial color="#1A3A2A" />
      </mesh>
    </>
  );
}

// ─── Selector de entorno ──────────────────────────────────────────────────────
function CommunityEnvironment({ nivel }: { nivel: number }) {
  switch (nivel) {
    case 1: return <CapulalpamEnv />;
    case 2: return <ChicomezuchilEnv />;
    case 3: return <HuamuchilEnv />;
    case 4: return <GuelataoEnv />;
    case 5: return <LachirioagEnv />;
    default: return <CapulalpamEnv />;
  }
}

// ─── Escena principal ─────────────────────────────────────────────────────────
export default function CommunityScene3D() {
  const { state, dispatch } = useGame();
  const nivel = state.activeCommunityLevel ?? 1;
  const isActive = state.scene === 'community';
  const dialogEverOpened = useRef(false);

  // Reset del ref cuando salimos de esta escena hacia el mapa
  useEffect(() => {
    if (!isActive && state.scene !== 'minigame') {
      dialogEverOpened.current = false;
    }
  }, [isActive, state.scene]);

  // Abrir diálogo de la comunidad al entrar (solo en 'community', no en 'minigame')
  useEffect(() => {
    if (!isActive) return;
    const dialog = COMMUNITY_DIALOGS[nivel];
    if (!dialog) {
      // Sin diálogo para esta comunidad → lanzar quiz directamente
      const t = setTimeout(() => dispatch({ type: 'SET_SCENE', scene: 'minigame' }), 800);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => {
      dispatch({ type: 'OPEN_DIALOG', dialog });
    }, 900);
    return () => clearTimeout(t);
  }, [isActive, nivel, dispatch]);

  // Cuando el diálogo termina → pasar al quiz
  useEffect(() => {
    if (!isActive) return;
    if (state.isDialogOpen) {
      dialogEverOpened.current = true;
      return;
    }
    if (!dialogEverOpened.current) return;
    const t = setTimeout(() => {
      dispatch({ type: 'SET_SCENE', scene: 'minigame' });
    }, 500);
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

      {/* Entorno específico de la comunidad */}
      <CommunityEnvironment nivel={nivel} />

      {/* Kimi aparece en el claro frente al entorno */}
      <JaguarGuide3D
        position={[0, -0.45, 1.2]}
        scale={0.85}
        isTalking={state.isDialogOpen}
        onClick={() => {}}
      />
    </>
  );
}
