import { noise } from "../constant/seed.js";
import { Chunks } from "../repositories/chunks.js";

export function generateChunkHeight(x: number, z: number, maxHeight: number, chunkSize: number): number {
	const frequency = 0.01;
	const scaledX = x * frequency;
	const scaledZ = z * frequency;

	const noiseValue = noise.perlin3(scaledX, 0, scaledZ);

	const normalizedValue = (noiseValue + 1) / 2; // Map noise value from [-1, 1] to [0, 1]
  	const height = Math.round(normalizedValue * maxHeight);

	return height;
}