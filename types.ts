
export enum ModelType {
  HEART = 'Heart',
  FLOWER = 'Flower',
  SATURN = 'Saturn',
  GALAXY = 'Galaxy',
  SPHERE = 'Sphere',
  DNA = 'DNA',
  FIREWORKS = 'Fireworks',
  PYRAMID = 'Pyramid',
  SKULL = 'Skull'
}

export enum GestureType {
  NONE = 'None',
  PINCH = 'Pinch (Scale)',
  OPEN_HAND = 'Open Hand (Reset)',
  CLOSED_FIST = 'Fist (Boom)',
  POINTING = 'Index (Snow)',
  VICTORY = 'Victory (Flow)'
}

export enum SceneEffect {
  NONE = 'None',
  SNOW = 'Romantic Snow',
  FLOW = 'Tech Flow',
  EXPLOSION = 'Explosion',
  INK = 'Ink Smudge'
}

export interface ParticleConfig {
  model: ModelType;
  effect: SceneEffect;
  color: string;
  particleCount: number;
  particleSize: number;
  speed: number;
  noise: number; // Displace amount
  opacity: number;
  interactionSensitivity: number;
}

export interface HandData {
  isDetected: boolean;
  pinchDistance: number; // 0 to 1
  centerX: number; // -1 to 1
  centerY: number; // -1 to 1
  gesture: GestureType;
}
