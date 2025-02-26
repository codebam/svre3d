import * as Noise from 'noisejs';
import seedrandom from 'seedrandom';
import { Entity } from "../models/entity.js";
import { Biomes } from "../repositories/biomes.js";

import { THREE } from "enable3d";
import { Equipments } from '../repositories/equipments.js';
import { Random } from '../../../server/common/rand.js';
import { ResourceMap } from '../repositories/resources.js';


export class SkinPlayer {

	static createCanvasImage(player: Entity, colors: string[], side: number,
		width = 1000, height = 1000) {
		const canvas = document.createElement('canvas');
		const ctx = canvas.getContext('2d')!;

		const rng = seedrandom(player.data.username + (side || '-').toString());
		const noise = new Noise.Noise(rng());

		canvas.width = width;
		canvas.height = height;

		const grid: Record<string, string> = {};

		const pixelSize = 10;
		for (let y = 0; y < height; y += pixelSize) {
			for (let x = 0; x < width; x += pixelSize) {

				const color = Random.pick(
					...colors,
					() => Math.abs(noise.perlin2(x * 0.01, y * 0.01) * 10)
				) || colors[0];
				grid[x + '-' + y] = color;

				ctx.fillStyle = color;

				ctx.fillRect(x, y, pixelSize, pixelSize);
			}
		}

		const texture = new THREE.CanvasTexture(canvas);

		// document.body.innerHTML = `<img src="${canvas.toDataURL()}" />`;

		return { texture, grid };
	}

	static createNormalMap(grid: Record<string, string>, colors: string[], width = 1000, height = 1000) {
		const canvas = document.createElement('canvas');
		const ctx = canvas.getContext('2d')!;

		console.log(grid);

		canvas.width = width;
		canvas.height = height;

		const pixelSize = 10;

		const imageData = ctx.createImageData(width, height);
		const data = imageData.data;

		function getHeight(x: number, y: number) {
			const closestPixel = x + '-' + y;
			return grid[closestPixel] ? (
				grid[closestPixel] == colors[0] ? 0x000000 : 0xffffff
			) : 0;
		}

		for (let y = 0; y < height; y += pixelSize) {
			for (let x = 0; x < width; x += pixelSize) {
				const hL = getHeight(x - pixelSize, y);
				const hR = getHeight(x + pixelSize, y);
				const hT = getHeight(x, y - pixelSize);
				const hB = getHeight(x, y + pixelSize);

				const dx = (hR - hL) * 128 + 128;
				const dy = (hB - hT) * 128 + 128;
				const dz = 255;

				for (let offsetY = 0; offsetY < pixelSize; offsetY++) {
					for (let offsetX = 0; offsetX < pixelSize; offsetX++) {
						const index = ((y + offsetY) * width + (x + offsetX)) * 4;
						data[index] = dx;
						data[index + 1] = dy;
						data[index + 2] = dz;
						data[index + 3] = 255;
					}
				}
			}
		}


		ctx.putImageData(imageData, 0, 0);

		const texture = new THREE.CanvasTexture(canvas);
		// document.body.innerHTML = `<img src="${canvas.toDataURL()}" />`;
		return texture;
	}



	static skinPlayer(player: Entity) {

		console.log(player.variant);

		const biome = Biomes.find(player.variant);

		if (!biome) return; // If biome doesn't exist

		const colors = Array.isArray(biome.biome.colors) ? [...biome.biome.colors] : [biome.biome.colors];
		if (player.data.color) colors.push(player.data.color);

		const settings = {
			emissiveIntensity: 0,
			emissive: 0x000000,
			color: 0xbbbbbb,
			toneMapped: false
		}

		const body = Equipments.entityBody('body', player);

		const bodyMap = this.createCanvasImage(player, colors, 1001);

		body.children[0].material = new THREE.MeshToonMaterial({
			map: bodyMap.texture,
			normalMap: this.createNormalMap(bodyMap.grid, colors, 1001, 1001),
			...settings
		});
		colors.pop();
		body.children[3].material = new THREE.MeshToonMaterial({
			map: this.createCanvasImage(player, colors, 110, 150, 400).texture,
			...settings
		});
	}

}

