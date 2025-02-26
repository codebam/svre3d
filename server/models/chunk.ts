import { stringifyChunkPosition } from "../common/chunk.js";
import { worldData } from "../constant/world.js";
import { ResourceSchema } from "../lib/loader/Schema.type.js";
import { BiomeData } from "./biome.js";
import { ServerData } from "./data.js";
import { EntityData } from "./entity.js";
import { jsonres } from "./jsonres.js";
import { xyz } from "./misc.xyz.js";
import { StructureData } from "./structure.js";

export class ChunkData extends ServerData {
	terrainHeightMap: number[][];
	structures: StructureData[];
	entities: EntityData[];
	position: xyz;
	biome!: ResourceSchema;

	chunkSize: number;

	data: any = {};

	flags: string[] = ['chunk'];

	constructor() {
		super();
		this.terrainHeightMap = [[]];
		this.structures = [];
		this.entities = [];
		this.position = { x: 0, y: 0, z: 0 };
		this.chunkSize = worldData.chunkSize;
	}

	stringify(){
		return stringifyChunkPosition(this.position);
	}
}
