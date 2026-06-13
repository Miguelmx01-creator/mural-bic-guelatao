'use client';

// Canvas principal de React Three Fiber.
// Gestiona qué escena 3D se muestra según el estado del juego.
// Los overlays 2D (HUD, dialogs, missions) se montan FUERA del Canvas.

import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, AdaptiveDpr } from '@react-three/drei';
import { GameProvider, useGame } from './GameContext';
import IntroScene from '../scenes/IntroScene';
import HUD from '../ui/HUD';
import DialogSystem from '../ui/DialogSystem';
import MissionPanel from '../ui/MissionPanel';
import LoginJugador from '@/components/juego/LoginJugador';
import RankingSierra from '@/components/juego/RankingSierra';
import type { Jugador } from '@/lib/jugadores';

// ─── Selector de escena 3D ────────────────────────────────────────────────────
// (Dentro del Canvas, solo contenido WebGL)
function Scene3D() {
  const { state } = useGame();

  switch (state.scene) {
    case 'intro':
    case 'world-map': // Fase 2: reemplazar con <WorldMap3D />
      return <IntroScene />;
    default:
      return null;
  }
}

// ─── Overlays 2D fuera del Canvas ─────────────────────────────────────────────
function Overlays() {
  const { state, dispatch } = useGame();

  // Pantalla de login (antes del Canvas)
  if (state.scene === 'login') {
    return (
      <div className="absolute inset-0 z-50">
        <LoginJugador
          onLogin={(jugador: Jugador) => dispatch({ type: 'LOGIN', jugador })}
        />
      </div>
    );
  }

  // Ranking (reutiliza componente existente)
  if (state.scene === 'ranking' && state.jugador) {
    return (
      <div className="absolute inset-0 z-50">
        <RankingSierra
          jugadorActual={state.jugador}
          onVolver={() => dispatch({ type: 'SET_SCENE', scene: 'intro' })}
        />
      </div>
    );
  }

  // HUD + dialogs + misiones sobre el Canvas
  return (
    <>
      <HUD />
      <DialogSystem />
      <MissionPanel />
    </>
  );
}

// ─── Contenedor principal ─────────────────────────────────────────────────────
export default function GameCanvas() {
  return (
    <GameProvider>
      <div className="relative w-full h-full" style={{ background: '#060410' }}>

        {/* ── Canvas 3D ─────────────────────────────────────────────────── */}
        <Canvas
          camera={{ position: [0, 1.5, 5], fov: 55, near: 0.1, far: 100 }}
          shadows
          dpr={[1, 1.5]}          // Performance: cap pixel ratio para móvil
          gl={{
            antialias: true,
            powerPreference: 'low-power', // Ahorra batería en móvil
            alpha: false,
          }}
          style={{ background: '#080614' }}
        >
          {/* Adapta la resolución automáticamente según frame rate */}
          <AdaptiveDpr pixelated />

          {/* Controles orbitales (táctiles en móvil) */}
          <OrbitControls
            enablePan={false}
            enableZoom={false}
            minPolarAngle={Math.PI / 6}
            maxPolarAngle={Math.PI / 2.2}
            target={[0, 0, 0]}
          />

          {/* Escena activa */}
          <Suspense fallback={null}>
            <Scene3D />
          </Suspense>
        </Canvas>

        {/* ── Overlays 2D (fuera del Canvas, no consumen GPU) ──────────── */}
        <Overlays />
      </div>
    </GameProvider>
  );
}
