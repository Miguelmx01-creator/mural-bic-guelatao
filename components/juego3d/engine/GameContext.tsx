'use client';

import { createContext, useContext, useReducer, useCallback, type ReactNode } from 'react';
import {
  type GameState,
  type GameScene,
  type DialogTree,
  type Mission,
  type InventoryItem,
  type Achievement,
  INITIAL_GAME_STATE,
} from '@/lib/game-state';
import { initMissionsForPlayer } from '@/lib/missions';
import { initAchievementsForPlayer } from '@/lib/achievements';
import { DIALOG_INTRO } from '@/lib/dialogs';
import type { Jugador } from '@/lib/jugadores';

// ─── Acciones ─────────────────────────────────────────────────────────────────

type GameAction =
  | { type: 'LOGIN';               jugador: Jugador }
  | { type: 'SET_SCENE';           scene: GameScene }
  | { type: 'OPEN_DIALOG';         dialog: DialogTree }
  | { type: 'ADVANCE_DIALOG';      nextId: string | null }
  | { type: 'CLOSE_DIALOG' }
  | { type: 'TOGGLE_MISSIONS' }
  | { type: 'COMPLETE_OBJECTIVE';  missionId: string; objectiveId: string }
  | { type: 'ACTIVATE_MISSION';    missionId: string }
  | { type: 'UPDATE_JUGADOR';      partial: Partial<Jugador> }
  | { type: 'SET_COMMUNITY';       nivel: number | null }
  | { type: 'UNLOCK_ACHIEVEMENT';  id: string }
  | { type: 'COLLECT_ITEM';        item: InventoryItem }
  | { type: 'TOGGLE_INVENTORY' }
  | { type: 'CLEAR_TOAST' };

// ─── Reducer ──────────────────────────────────────────────────────────────────

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {

    case 'LOGIN': {
      const missions     = initMissionsForPlayer(action.jugador.nivelActual);
      const achievements = initAchievementsForPlayer(action.jugador);
      return { ...state, jugador: action.jugador, missions, achievements, scene: 'intro' };
    }

    case 'SET_SCENE':
      return { ...state, scene: action.scene };

    case 'OPEN_DIALOG':
      return {
        ...state,
        activeDialog:  action.dialog,
        activeNodeId:  action.dialog.startId,
        isDialogOpen:  true,
      };

    case 'ADVANCE_DIALOG':
      if (action.nextId === null) {
        return { ...state, activeDialog: null, activeNodeId: null, isDialogOpen: false };
      }
      return { ...state, activeNodeId: action.nextId };

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
        return { ...m, objectives, status: allDone ? 'completed' : m.status };
      });
      const completedId = action.missionId;
      const unlocked    = state.missions.find((m) => m.prerequisite === completedId);
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

    // ── Fase 4 ────────────────────────────────────────────────────────────────

    case 'UNLOCK_ACHIEVEMENT': {
      const achievement = state.achievements.find((a) => a.id === action.id);
      if (!achievement || achievement.unlockedAt !== null) return state;
      const now          = new Date();
      const achievements = state.achievements.map((a) =>
        a.id === action.id ? { ...a, unlockedAt: now } : a
      );
      // El último logro desbloqueado en un batch se muestra como toast
      return { ...state, achievements, toastAchievement: { ...achievement, unlockedAt: now } };
    }

    case 'COLLECT_ITEM': {
      const existing = state.inventory.find((i) => i.id === action.item.id);
      if (existing) {
        return {
          ...state,
          inventory: state.inventory.map((i) =>
            i.id === action.item.id ? { ...i, quantity: i.quantity + 1 } : i
          ),
        };
      }
      return { ...state, inventory: [...state.inventory, { ...action.item, quantity: 1 }] };
    }

    case 'TOGGLE_INVENTORY':
      return { ...state, isInventoryOpen: !state.isInventoryOpen };

    case 'CLEAR_TOAST':
      return { ...state, toastAchievement: null };

    default:
      return state;
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────

type GameContextValue = {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
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
