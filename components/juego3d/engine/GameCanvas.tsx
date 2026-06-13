'use client';

// Canvas principal de React Three Fiber.
// CanvasLayer: aplica blur/dim cuando el quiz está activo (minigame escena).
// OverlayLayer: gestiona todos los overlays 2D según la escena activa.

import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { AdaptiveDpr } from '@react-three/drei';
import { AnimatePresence } from 'framer-motion';
import { GameProvider, useGame } from './GameContext';
import IntroScene     from '../scenes/IntroScene';
import WorldMap3D     from '../scenes/WorldMap3D';
import CommunityScene3D from '../scenes/CommunityScene3D';
import HUD            from '../ui/HUD';
import DialogSystem   from '../ui/DialogSystem';
import MissionPanel   from '../ui/MissionPanel';
import CommunityInfoPanel from '../ui/CommunityInfoPanel';
import MinigameOverlay    from '../ui/MinigameOverlay';
import InventoryPanel     from '../ui/InventoryPanel';
import LoginJugador   from '@/components/juego/LoginJugador';
import RankingSierra  from '@/components/juego/RankingSierra';
import type { Jugador } from '@/lib/jugadores';

// ─── Escena 3D activa (dentro del Canvas) ────────────────────────────────────
function Scene3D() {
  const { state } = useGame();
  switch (state.scene) {
    case 'intro':
      return <IntroScene />;
    case 'world-map':
      return <WorldMap3D />;
    case 'community':
    case 'minigame':
      return <CommunityScene3D />;
    default:
      return null;
  }
}

// ─── Capa del Canvas 3D (con dim/blur en minijuego) ─────────────────────────
function CanvasLayer() {
  const { state } = useGame();
  const isMinigame = state.scene === 'minigame';

  return (
    <div
      className="absolute inset-0 transition-all duration-500"
      style={
        isMinigame
          ? { filter: 'brightness(0.22) blur(3px)', transform: 'scale(1.04)' }
          : {}
      }
    >
      <Canvas
        camera={{ position: [0, 1.5, 5], fov: 55, near: 0.1, far: 100 }}
        shadows
        dpr={[1, 1.5]}
        gl={{ antialias: true, powerPreference: 'low-power', alpha: false }}
        style={{ background: '#080614' }}
      >
        <AdaptiveDpr pixelated />
        <Suspense fallback={null}>
          <Scene3D />
        </Suspense>
      </Canvas>
    </div>
  );
}

// ─── Capa de overlays 2D (fuera del Canvas) ───────────────────────────────────
function OverlayLayer() {
  const { state, dispatch } = useGame();

  // Login: pantalla completa antes del Canvas
  if (state.scene === 'login') {
    return (
      <div className="absolute inset-0 z-50">
        <LoginJugador
          onLogin={(jugador: Jugador) => dispatch({ type: 'LOGIN', jugador })}
        />
      </div>
    );
  }

  // Ranking: vuelve al mapa (el jugador ya hizo el intro)
  if (state.scene === 'ranking' && state.jugador) {
    return (
      <div className="absolute inset-0 z-50">
        <RankingSierra
          jugadorActual={state.jugador}
          onVolver={() => {
            dispatch({ type: 'SET_COMMUNITY', nivel: null });
            dispatch({ type: 'SET_SCENE', scene: 'world-map' });
          }}
        />
      </div>
    );
  }

  // Minijuego: quiz slide-up sobre el fondo 3D dimido
  if (state.scene === 'minigame') {
    return (
      <AnimatePresence>
        <MinigameOverlay key="minigame" />
      </AnimatePresence>
    );
  }

  // HUD + diálogos + misiones + inventario + panel de comunidad
  return (
    <>
      <HUD />
      <DialogSystem />
      <MissionPanel />
      <InventoryPanel />
      {state.scene === 'world-map' && <CommunityInfoPanel />}
    </>
  );
}

// ─── Contenedor principal ─────────────────────────────────────────────────────
export default function GameCanvas() {
  return (
    <GameProvider>
      <div className="relative w-full h-full" style={{ background: '#060410' }}>
        <CanvasLayer />
        <OverlayLayer />
      </div>
    </GameProvider>
  );
}
