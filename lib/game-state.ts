// ─── Tipos del juego 3D ───────────────────────────────────────────────────────
// Extiende la lógica de jugadores.ts sin modificar Firebase

import type { Jugador } from './jugadores';

export type GameScene =
  | 'login'        // Pantalla de login 2D
  | 'intro'        // Conoces a Kimi (jaguar) por primera vez
  | 'world-map'    // Mapa 3D de la Sierra Norte (Fase 2)
  | 'community'    // Escenario de comunidad específica (Fase 3)
  | 'minigame'     // Minijuego activo (Fase 3)
  | 'ranking';     // Ranking (reutiliza RankingSierra)

// ─── Misiones ─────────────────────────────────────────────────────────────────

export type MissionStatus = 'locked' | 'available' | 'active' | 'completed';

export type Objective = {
  id: string;
  text: string;
  completed: boolean;
};

export type Mission = {
  id: string;
  title: string;
  description: string;
  emoji: string;
  xpReward: number;
  status: MissionStatus;
  objectives: Objective[];
  prerequisite?: string; // ID de misión previa
};

// ─── Inventario ───────────────────────────────────────────────────────────────

export type InventoryItem = {
  id: string;
  name: string;
  emoji: string;
  description: string;
  quantity: number;
  comunidadOrigen?: string;
};

// ─── Logros ──────────────────────────────────────────────────────────────────

export type Achievement = {
  id: string;
  title: string;
  description: string;
  emoji: string;
  unlockedAt: Date | null;
};

// ─── Sistema de Diálogos ──────────────────────────────────────────────────────

export type DialogSpeaker = 'jaguar' | 'narrator' | 'npc';

export type DialogChoice = {
  text: string;
  nextId: string;
};

export type DialogNode = {
  id: string;
  speaker: DialogSpeaker;
  speakerName?: string;
  text: string;
  choices?: DialogChoice[];
  nextId?: string | null; // null = fin del diálogo
  onComplete?: string;  // ID de misión a activar al completar este nodo
};

export type DialogTree = {
  id: string;
  nodes: DialogNode[];
  startId: string;
};

// ─── Estado Global del Juego ──────────────────────────────────────────────────

export type GameState = {
  scene: GameScene;
  jugador: Jugador | null;

  // Misiones
  missions: Mission[];
  isMissionPanelOpen: boolean;

  // Inventario cultural y logros
  inventory: InventoryItem[];
  achievements: Achievement[];
  isInventoryOpen: boolean;
  toastAchievement: Achievement | null; // logro que se muestra como notificación

  // Sistema de diálogos
  activeDialog: DialogTree | null;
  activeNodeId: string | null;
  isDialogOpen: boolean;

  // Comunidad activa en mapa/escena
  activeCommunityLevel: number | null;
};

// ─── Estado inicial ───────────────────────────────────────────────────────────

export const INITIAL_GAME_STATE: GameState = {
  scene: 'login',
  jugador: null,
  missions: [],
  isMissionPanelOpen: false,
  inventory: [],
  achievements: [],
  isInventoryOpen: false,
  toastAchievement: null,
  activeDialog: null,
  activeNodeId: null,
  isDialogOpen: false,
  activeCommunityLevel: null,
};
