import { noise } from "../constant/seed.js";
export function generateChunkHeight(x, z, maxHeight, chunkSize) {
    const frequency = 0.01;
    const scaledX = x * frequency;
    const scaledZ = z * frequency;
    const noiseValue = noise.perlin3(scaledX, 0, scaledZ);
    const normalizedValue = (noiseValue + 1) / 2; // Map noise value from [-1, 1] to [0, 1]
    const height = Math.round(normalizedValue * maxHeight);
    return height;
}
