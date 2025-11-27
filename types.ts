
export enum ModelType {
  HEART = 'Heart',
  FLOWER = 'Flower',
  SATURN = 'Saturn',
  GALAXY = 'Galaxy',
  SPHERE = 'Sphere',
  DNA = 'DNA',
  FIREWORKS = 'Fireworks',
  PYRAMID = 'Pyramid',
  SKULL = 'Skull',
  COUNTDOWN = 'Countdown',
  WORLD_MAP = 'World Map'
}

export enum GestureType {
  NONE = 'None',
  PINCH = 'Pinch (Select)',
  CLOSED_FIST = 'Fist (0)',
  ONE = 'One (1)',
  TWO = 'Two (2)',
  THREE = 'Three (3)',
  FOUR = 'Four (4)',
  FIVE = 'Five (5)'
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

export interface OfficeLocation {
  id: string;
  name: string;
  desc: string;
  lat: number;
  lng: number;
}
