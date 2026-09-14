export type EditSegment = {
  from: number;
  to: number;
  scale?: number;
  x?: number;
  y?: number;
};

export const editPlan: EditSegment[] = [
  // Codex replaces this after transcription and editorial analysis.
  {from: 0, to: 10, scale: 1.03, x: 0, y: 0},
];

export type Accent = {
  start: number;
  end: number;
  text: string;
  tone: 'olive' | 'terracotta';
};

export const accents: Accent[] = [];
