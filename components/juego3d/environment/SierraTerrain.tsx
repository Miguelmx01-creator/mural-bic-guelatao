'use client';

// Terreno estilizado de la Sierra Norte.
// Estilo: tablero de juego visto desde arriba, low-poly cartoon.
// Sin texturas externas — solo geometrías nativas de Three.js.

// ─── Montaña decorativa de fondo ─────────────────────────────────────────────
function Montana({
  position,
  scale,
  color,
}: {
  position: [number, number, number];
  scale: [number, number, number];
  color: string;
}) {
  return (
    <mesh position={position} scale={scale} castShadow>
      <coneGeometry args={[1, 2.2, 5]} />
      <meshToonMaterial color={color} />
    </mesh>
  );
}

// ─── Árbol del mapa — cluster de follaje irregular, múltiples verdes ─────────
const TREE_ROT = [0.4, 1.3, 2.2, 0.9, 1.7];

function MapTree({ position, rotY = 0 }: { position: [number, number, number]; rotY?: number }) {
  return (
    <group position={position} rotation={[0, rotY, 0]}>
      {/* Tronco */}
      <mesh position={[0, 0.1, 0]} castShadow>
        <cylinderGeometry args={[0.03, 0.06, 0.22, 5]} />
        <meshStandardMaterial color="#3A2010" roughness={0.95} />
      </mesh>
      {/* Follaje base — verde pino oscuro, inclinado */}
      <mesh position={[0.02, 0.36, -0.01]} rotation={[0.07, 0.8, -0.04]} castShadow>
        <coneGeometry args={[0.22, 0.36, 5]} />
        <meshStandardMaterial color="#1B4E18" roughness={0.9} />
      </mesh>
      {/* Follaje medio — esmeralda */}
      <mesh position={[-0.02, 0.59, 0.02]} rotation={[-0.05, 1.3, 0.05]} castShadow>
        <coneGeometry args={[0.14, 0.28, 5]} />
        <meshStandardMaterial color="#2D6A22" roughness={0.9} />
      </mesh>
      {/* Acento oliva — rompe simetría */}
      <mesh position={[0.09, 0.47, 0.08]} castShadow>
        <sphereGeometry args={[0.08, 4, 3]} />
        <meshStandardMaterial color="#3A6020" roughness={0.9} />
      </mesh>
    </group>
  );
}

// ─── Parche de bosque (cluster de árboles irregulares) ────────────────────────
function BosqueCluster({
  cx,
  cz,
  count = 4,
}: {
  cx: number;
  cz: number;
  count?: number;
}) {
  const ALL_OFFSETS: Array<[number, number]> = [
    [0, 0], [0.6, 0.3], [-0.5, 0.4], [0.2, -0.5], [-0.3, -0.3],
  ];
  const offsets = ALL_OFFSETS.slice(0, count);
  return (
    <>
      {offsets.map(([dx, dz], i) => (
        <MapTree key={i} position={[cx + dx, 0, cz + dz]} rotY={TREE_ROT[i]} />
      ))}
    </>
  );
}

// ─── Elevación (meseta hexagonal bajo cada comunidad) ─────────────────────────
export function Meseta({
  position,
  color = '#2A5530',
}: {
  position: [number, number, number];
  color?: string;
}) {
  return (
    <group position={position}>
      <mesh rotation={[0, Math.PI / 6, 0]} receiveShadow>
        <cylinderGeometry args={[1.1, 1.1, 0.22, 6]} />
        <meshToonMaterial color={color} />
      </mesh>
      {/* Borde de la meseta */}
      <mesh rotation={[0, Math.PI / 6, 0]} position={[0, -0.12, 0]}>
        <cylinderGeometry args={[1.2, 1.15, 0.1, 6]} />
        <meshToonMaterial color="#1A3A20" />
      </mesh>
    </group>
  );
}

// ─── Escena de terreno principal ──────────────────────────────────────────────
export default function SierraTerrain() {
  return (
    <>
      {/* ── Suelo base del mapa ──────────────────────────────────────────── */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[26, 26]} />
        <meshToonMaterial color="#1A4020" />
      </mesh>

      {/* ── Zona central del mapa (pradera más clara) ────────────────────── */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]}>
        <circleGeometry args={[5.5, 8]} />
        <meshToonMaterial color="#245428" />
      </mesh>

      {/* ── Laguna Encantada (referencia Guelatao de Juárez) ─────────────── */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-2.5, 0.012, 0.4]}>
        <circleGeometry args={[0.6, 10]} />
        <meshToonMaterial color="#1565A4" />
      </mesh>
      {/* Ribera del lago */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-2.5, 0.008, 0.4]}>
        <ringGeometry args={[0.6, 0.78, 10]} />
        <meshToonMaterial color="#2A6B3E" />
      </mesh>
      {/* Destello del agua */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-2.4, 0.016, 0.35]}>
        <planeGeometry args={[0.18, 0.08]} />
        <meshBasicMaterial color="white" opacity={0.3} transparent />
      </mesh>

      {/* ── Río (corriente entre comunidades) ────────────────────────────── */}
      {/* Segmento norte */}
      <mesh rotation={[-Math.PI / 2, 0, 0.6]} position={[-0.5, 0.01, -1.8]}>
        <planeGeometry args={[0.18, 2.5]} />
        <meshBasicMaterial color="#1A6B9A" opacity={0.7} transparent />
      </mesh>
      {/* Segmento sur */}
      <mesh rotation={[-Math.PI / 2, 0, -0.3]} position={[0.8, 0.01, 0.8]}>
        <planeGeometry args={[0.18, 3]} />
        <meshBasicMaterial color="#1A6B9A" opacity={0.6} transparent />
      </mesh>

      {/* ── Mesetas bajo las comunidades ─────────────────────────────────── */}
      <Meseta position={[-2.2, -0.1, -1.5]} color="#2D6035" />
      <Meseta position={[0.5, -0.1, -2.8]}  color="#2D6035" />
      <Meseta position={[-1.5, -0.1, 1.8]}  color="#2D6035" />
      <Meseta position={[-2.2, -0.1, 0.5]}  color="#2D6035" />
      <Meseta position={[2.8, -0.1, 0.3]}   color="#2D6035" />

      {/* ── Bosques perimetrales ──────────────────────────────────────────── */}
      <BosqueCluster cx={-7} cz={-4} count={5} />
      <BosqueCluster cx={-7} cz={0}  count={4} />
      <BosqueCluster cx={-7} cz={4}  count={5} />
      <BosqueCluster cx={6.5} cz={-3} count={4} />
      <BosqueCluster cx={6.8} cz={1}  count={5} />
      <BosqueCluster cx={6.5} cz={4}  count={4} />
      <BosqueCluster cx={-3}  cz={6.8} count={5} />
      <BosqueCluster cx={1}   cz={7}   count={4} />
      <BosqueCluster cx={4.5} cz={6.5} count={4} />
      <BosqueCluster cx={-1}  cz={-6.5} count={5} />
      <BosqueCluster cx={2.5} cz={-6.8} count={4} />

      {/* ── Montañas de fondo (horizonte) ────────────────────────────────── */}
      <Montana position={[-10.5, -0.5, -9.5]} scale={[2.8, 4, 2.8]}   color="#122A0E" />
      <Montana position={[-5.5,  -0.5, -12]}  scale={[3.2, 5, 3.2]}   color="#1A3A12" />
      <Montana position={[0,     -0.5, -13]}  scale={[4, 6.5, 4]}     color="#15300F" />
      <Montana position={[5.5,   -0.5, -12]}  scale={[3, 4.5, 3]}     color="#1A3A12" />
      <Montana position={[10.5,  -0.5, -9]}   scale={[2.5, 3.5, 2.5]} color="#122A0E" />
      <Montana position={[11.5,  -0.5, -2]}   scale={[2.2, 3.2, 2.2]} color="#1A3A12" />
      <Montana position={[11.5,  -0.5, 4]}    scale={[2, 2.8, 2]}     color="#15300F" />
      <Montana position={[-11.5, -0.5, -2]}   scale={[2.2, 3, 2.2]}   color="#122A0E" />
      <Montana position={[-11.5, -0.5, 4]}    scale={[2, 3.2, 2]}     color="#1A3A12" />
      <Montana position={[-5.5,  -0.5, 9.5]}  scale={[3, 4.5, 3]}     color="#15300F" />
      <Montana position={[3,     -0.5, 10.5]} scale={[2.5, 3.8, 2.5]} color="#1A3A12" />
      <Montana position={[9,     -0.5, 7]}    scale={[2, 3, 2]}       color="#122A0E" />

      {/* ── Rocas decorativas ────────────────────────────────────────────── */}
      {[
        [-4.5, 0, -3.2], [3.5, 0, -4], [-3, 0, 3.5], [4.5, 0, 2],
        [1.5, 0, 4.5], [-5, 0, 2.2],
      ].map(([x, , z], i) => (
        <mesh key={i} position={[x, 0.1, z]} rotation={[0, i * 0.8, 0]}>
          <dodecahedronGeometry args={[0.22, 0]} />
          <meshToonMaterial color="#3D5040" />
        </mesh>
      ))}

      {/* ── Niebla de sierra ──────────────────────────────────────────────── */}
      <fog attach="fog" args={['#060d0a', 5, 20]} />
    </>
  );
}
