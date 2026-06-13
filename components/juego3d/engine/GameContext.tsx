'use client';

import { createContext, useContext, useReducer, useCallback, type ReactNode } from 'react';
import {
  type GameState,
  type GameScene,
  type DialogTree,
  type Mission,
  INITIAL_GAME_STATE,
} from '@/lib/game-state';
import { initMissionsForPlayer } from '@/lib/missions';
import { DIALOG_INTRO } from '@/lib/dialogs';
import type { Jugador } from '@/lib/jugadores';

// ─── Acciones ─────────────────────────────────────────────────────────────────

type GameAction =
  | { type: 'LOGIN';              jugador: Jugador }
  | { type: 'SET_SCENE';          scene: GameScene }
  | { type: 'OPEN_DIALOG';        dialog: DialogTree }
  | { type: 'ADVANCE_DIALOG';     nextId: string | null }
  | { type: 'CLOSE_DIALOG' }
  | { type: 'TOGGLE_MISSIONS' }
  | { type: 'COMPLETE_OBJECTIVE'; missionId: string; objectiveId: string }
  | { type: 'ACTIVATE_MISSION';   missionId: string }
  | { type: 'UPDATE_JUGADOR';     partial: Partial<Jugador> }
  | { type: 'SET_COMMUNITY';      nivel: number | null };

// ─── Reducer ──────────────────────────────────────────────────────────────────

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {

    case 'LOGIN': {
      const missions = initMissionsForPlayer(action.jugador.nivelActual);
      return {
        ...state,
        jugador: action.jugador,
        missions,
        scene: 'intro',
      };
    }

    case 'SET_SCENE':
      return { ...state, scene: action.scene };

    case 'OPEN_DIALOG':
      return {
        ...state,
        activeDialog: action.dialog,
        activeNodeId: action.dialog.startId,
        isDialogOpen: true,
      };

    case 'ADVANCE_DIALOG': {
      if (action.nextId === null) {
        return { ...state, activeDialog: null, activeNodeId: null, isDialogOpen: false };
      }
      return { ...state, activeNodeId: action.nextId };
    }

    case 'CLOSE_DIALOG':
      return { ...state, activeDialog: null, activeNodeId: null, isDialogOpen: false };

    case 'TOGGLE_MISSIONS':
      return { ...state, isMissionPanelOpen: !state.isMissionPanelOpen };

    case 'ACTIVATE_MISSION': {
      const missions = state.missions.map((m) =>
        m.id === action.missionId && m.status === 'available'
          ? { ...m, status: 'active' as const }
          : m
      );
      return { ...state, missions };
    }

    case 'COMPLETE_OBJECTIVE': {
      const missions = state.missions.map((m): Mission => {
        if (m.id !== action.missionId) return m;
        const objectives = m.objectives.map((o) =>
          o.id === action.objectiveId ? { ...o, completed: true } : o
        );
        const allDone = objectives.every((o) => o.completed);
        return {
          ...m,
          objectives,
          status: allDone ? 'completed' : m.status,
        };
      });
      // Desbloquear siguiente misión si hay prerequisito
      const completedId = action.missionId;
      const unlocked = state.missions.find((m) => m.prerequisite === completedId);
      const finalMissions = unlocked
        ? missions.map((m) =>
            m.id === unlocked.id ? { ...m, status: 'available' as const } : m
          )
        : missions;
      return { ...state, missions: finalMissions };
    }

    case 'UPDATE_JUGADOR':
      if (!state.jugador) return state;
      return { ...state, jugador: { ...state.jugador, ...action.partial } };

    case 'SET_COMMUNITY':
      return { ...state, activeCommunityLevel: action.nivel };

    default:
      return state;
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────

type GameContextValue = {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
  // Helpers de alto nivel
  startIntroDialog: () => void;
  advanceDialog: (nextId: string | null) => void;
};

const GameContext = createContext<GameContextValue | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, INITIAL_GAME_STATE);

  const startIntroDialog = useCallback(() => {
    dispatch({ type: 'OPEN_DIALOG', dialog: DIALOG_INTRO });
  }, []);

  const advanceDialog = useCallback((nextId: string | null) => {
    dispatch({ type: 'ADVANCE_DIALOG', nextId });
  }, []);

  return (
    <GameContext.Provider value={{ state, dispatch, startIntroDialog, advanceDialog }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame debe usarse dentro de GameProvider');
  return ctx;
}
