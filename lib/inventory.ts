// Ítems culturales del inventario: uno por comunidad.
// Se recolectan al completar el nivel de cada comunidad.

import type { InventoryItem } from './game-state';

export const COMMUNITY_ITEMS: Record<number, Omit<InventoryItem, 'quantity'>> = {
  1: {
    id: 'arbol-comunal',
    name: 'Árbol Comunal',
    emoji: '🌲',
    description: 'El bosque de Capulalpam es controlado por la asamblea. Nadie lo toca sin permiso del pueblo.',
    comunidadOrigen: 'Capulalpam de Méndez',
  },
  2: {
    id: 'mazorca-tequio',
    name: 'Mazorca de Tequio',
    emoji: '🌽',
    description: 'Cultivada en trabajo comunitario obligatorio. El tequio zapoteco es la raíz del bien común.',
    comunidadOrigen: 'Chicomezuchil',
  },
  3: {
    id: 'maguey-mixteco',
    name: 'Maguey Mixteco',
    emoji: '🌵',
    description: 'Planta sagrada de la montaña baja. El Mixteco casi no se escucha, pero el maguey permanece.',
    comunidadOrigen: 'El Huamuchil',
  },
  4: {
    id: 'agua-laguna',
    name: 'Agua de la Laguna',
    emoji: '💧',
    description: 'Del manantial de Guelatao, tierra natal de Benito Juárez. El agua es el mayor tesoro.',
    comunidadOrigen: 'Guelatao de Juárez',
  },
  5: {
    id: 'canto-xhon',
    name: 'Canto Xhon',
    emoji: '🎵',
    description: 'Una melodía del Zapoteco Xhon de Lachirioag. Toda la comunidad lo habla — identidad viva.',
    comunidadOrigen: 'San Cristóbal Lachirioag',
  },
};
