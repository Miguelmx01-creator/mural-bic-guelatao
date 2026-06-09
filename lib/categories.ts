export type Category = {
  id: string;
  label: string;
  bg: string;
  text: string;
  hint: string;
  /** Sugerencia de qué foto subir para esta categoría */
  imageHint: string;
};

export const CATEGORIES: Category[] = [
  {
    id: 'identidad-raices',
    label: 'Identidad y raíces',
    bg: '#7E57C2',
    text: '#F3E5F5',
    hint: 'Tu comunidad de origen, cómo se le dice a su gente, tu lengua materna y algo que aprendiste de tus abuelos que te da fuerza.',
    imageHint: 'Foto de tu comunidad, de tu familia, de un anciano o de algo que represente tus raíces.',
  },
  {
    id: 'dimension-social',
    label: 'Dimensión social',
    bg: '#C0392B',
    text: '#FFEBEE',
    hint: 'Familia, migración (¿se va la gente a trabajar o estudiar?, ¿a dónde?), redes de apoyo, educación, desigualdad.',
    imageHint: 'Foto de la escuela, la familia, el mercado o un lugar donde la gente se reúne.',
  },
  {
    id: 'dimension-politica',
    label: 'Dimensión política',
    bg: '#1565C0',
    text: '#E3F2FD',
    hint: 'Cómo se organizan: asamblea, tequio, usos y costumbres, cargos y autoridades. ¿Participan los jóvenes?',
    imageHint: 'Foto de una asamblea, un tequio, el palacio municipal o una autoridad comunitaria.',
  },
  {
    id: 'dimension-cultural',
    label: 'Dimensión cultural',
    bg: '#E67E22',
    text: '#FFF3E0',
    hint: 'Fiesta principal y su fecha, banda/danza/son, comida y bebida típica, tradiciones, leyendas, lengua viva.',
    imageHint: 'Foto de la fiesta patronal, la comida típica, la banda, una danza o un traje tradicional.',
  },
  {
    id: 'dimension-ambiental',
    label: 'Dimensión ambiental',
    bg: '#2E7D32',
    text: '#E8F5E9',
    hint: 'Cerro, río o lugar natural importante; animal y planta de la zona; clima; y problemas: basura, falta de agua, tala, sequía.',
    imageHint: 'Foto de un cerro, río, manantial, planta, animal de la zona o un problema ambiental.',
  },
  {
    id: 'dimension-tecnologica',
    label: 'Dimensión tecnológica',
    bg: '#00838F',
    text: '#E0F7FA',
    hint: 'Internet, señal de celular, luz; brecha digital; cómo usan las redes sociales los jóvenes de tu comunidad.',
    imageHint: 'Foto de antenas, celular, computadora en la escuela o un lugar con/sin señal.',
  },
  {
    id: 'problema-detectado',
    label: 'Problema detectado',
    bg: '#455A64',
    text: '#ECEFF1',
    hint: 'Redacta así: En mi comunidad existe ___, afecta principalmente a ___, debido a ___, generando como consecuencia ___.',
    imageHint: 'Foto del problema: basura, falta de agua, camino dañado, tala u otro daño visible.',
  },
  {
    id: 'propuesta-mejora',
    label: 'Propuesta de mejora',
    bg: '#00897B',
    text: '#E0F2F1',
    hint: '¿Qué se podría hacer para mejorar el entorno? ¿Quién tendría que participar (jóvenes, autoridades, escuela, familias)?',
    imageHint: 'Foto de un proyecto, actividad comunitaria, boceto o lugar que quieran mejorar.',
  },
];

export const getCategoryById = (id: string): Category | undefined =>
  CATEGORIES.find((c) => c.id === id);
