
import * as THREE from 'three';
import { ModelType } from './types';

// Helper to generate random points inside mathematical shapes
export const generateParticles = (type: ModelType, count: number): Float32Array => {
  const positions = new Float32Array(count * 3);
  
  for (let i = 0; i < count; i++) {
    let x = 0, y = 0, z = 0;
    const idx = i * 3;
    const t = Math.random() * Math.PI * 2;
    const u = Math.random() * Math.PI * 2;
    const v = Math.random();

    switch (type) {
      case ModelType.HEART:
        // Heart formula
        const ht = Math.random() * Math.PI * 2;
        const hx = 16 * Math.pow(Math.sin(ht), 3);
        const hy = 13 * Math.cos(ht) - 5 * Math.cos(2 * ht) - 2 * Math.cos(3 * ht) - Math.cos(4 * ht);
        const hz = (Math.random() - 0.5) * 10; 
        x = hx * 0.15;
        y = hy * 0.15;
        z = hz * 0.2;
        break;

      case ModelType.FLOWER:
        // Rose curve / spherical mix
        const ft = Math.random() * Math.PI * 2;
        const fp = Math.random() * Math.PI;
        const radius = 2 + Math.sin(5 * ft) * Math.sin(5 * fp);
        x = radius * Math.sin(fp) * Math.cos(ft);
        y = radius * Math.sin(fp) * Math.sin(ft);
        z = radius * Math.cos(fp);
        break;

      case ModelType.SATURN:
        // Sphere + Ring
        if (Math.random() > 0.4) {
          const r = 1.5;
          const theta = Math.random() * Math.PI * 2;
          const phi = Math.acos(2 * Math.random() - 1);
          x = r * Math.sin(phi) * Math.cos(theta);
          y = r * Math.sin(phi) * Math.sin(theta);
          z = r * Math.cos(phi);
        } else {
          const r = 2.5 + Math.random() * 1.5;
          const theta = Math.random() * Math.PI * 2;
          x = r * Math.cos(theta);
          z = r * Math.sin(theta);
          y = (Math.random() - 0.5) * 0.1;
        }
        break;

      case ModelType.GALAXY:
        // Spiral arms
        const arms = 3;
        const armAngle = (Math.random() * Math.PI * 2) / arms;
        const spiralRadius = Math.random() * 4;
        const spin = spiralRadius * 2;
        const angle = spin + (i % arms) * ((Math.PI * 2) / arms);
        x = Math.cos(angle) * spiralRadius;
        z = Math.sin(angle) * spiralRadius;
        y = (Math.random() - 0.5) * (4 - spiralRadius) * 0.5;
        break;

      case ModelType.DNA:
         const dt = (i / count) * Math.PI * 10;
         const dr = 1.5;
         const strand = i % 2 === 0 ? 1 : -1;
         x = dr * Math.cos(dt + (strand * Math.PI));
         y = (i / count) * 8 - 4;
         z = dr * Math.sin(dt + (strand * Math.PI));
         x += (Math.random() - 0.5) * 0.2;
         z += (Math.random() - 0.5) * 0.2;
         break;
      
      case ModelType.FIREWORKS:
         // Multiple expanding shells
         const shells = 5;
         const shell = Math.floor(Math.random() * shells) + 1;
         const fr = shell * 0.8; 
         const ftheta = Math.random() * Math.PI * 2;
         const fphi = Math.acos(2 * Math.random() - 1);
         // Add randomness to radius for "fuzzy" shells
         const fr_var = fr + (Math.random() - 0.5) * 0.2;
         x = fr_var * Math.sin(fphi) * Math.cos(ftheta);
         y = fr_var * Math.sin(fphi) * Math.sin(ftheta);
         z = fr_var * Math.cos(fphi);
         break;

      case ModelType.PYRAMID:
         // Square based pyramid
         const ph = Math.random() * 4; // Height 0 to 4
         const baseHalf = (4 - ph) * 0.5; // Base gets smaller as H goes up
         x = (Math.random() - 0.5) * 2 * baseHalf;
         z = (Math.random() - 0.5) * 2 * baseHalf;
         y = ph - 2; // Center Y
         break;

      case ModelType.SKULL:
          // Approximate skull shape using deformed sphere
          const stheta = Math.random() * Math.PI * 2;
          const sphi = Math.acos(2 * Math.random() - 1);
          let rad = 2;
          
          // Jaw area (elongate bottom)
          if (sphi > 2) rad *= 1.2;
          // Cranium (widen top)
          if (sphi < 1.5) rad *= 1.1;
          
          x = rad * Math.sin(sphi) * Math.cos(stheta);
          y = rad * Math.sin(sphi) * Math.sin(stheta);
          z = rad * Math.cos(sphi);
          
          // Flatten face
          if (z > 1) z *= 0.6;
          // Eye sockets (simple holes)
          if (z > 0.5 && y > 0 && y < 1 && Math.abs(x) < 0.8 && Math.abs(x) > 0.2) {
             z -= 0.5; // Push eyes in
          }
          break;

      case ModelType.SPHERE:
      default:
        const sr = 2.5;
        const sstheta = Math.random() * Math.PI * 2;
        const ssphi = Math.acos(2 * Math.random() - 1);
        x = sr * Math.sin(ssphi) * Math.cos(sstheta);
        y = sr * Math.sin(ssphi) * Math.sin(sstheta);
        z = sr * Math.cos(ssphi);
        break;
    }

    positions[idx] = x;
    positions[idx + 1] = y;
    positions[idx + 2] = z;
  }
  return positions;
};
