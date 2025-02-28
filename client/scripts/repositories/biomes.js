import { mixColors } from "../common/colors.js";
import { Chunks } from "./chunks.js";
import EffectManager from "./effects.js";
import { MaterialManager } from "./materials.js";
import { ResourceMap } from "./resources.js";
export class Biomes {
    static applyChunkBiome(chunk) {
        chunk.biome.biome.ground.texture = ResourceMap.find(chunk.biome.manifest.id).biome.ground.texture;
        const normalMap = chunk.biome.biome.ground.texture.resource.load?.[ResourceMap.find(chunk.biome.manifest.id).biome.normalMap];
        const materials = 'mapping' in chunk.biome.biome.ground ? chunk.biome.biome.ground.mapping.map(i => MaterialManager.makeSegmentMaterial(chunk.biome.biome.ground.texture.resource.load[i], chunk.biome.biome, normalMap)) : MaterialManager.makeSegmentMaterial(chunk.biome.biome.ground.texture.resource.load, chunk.biome.biome, normalMap);
        chunk.object3d.material = materials;
    }
    static find(name) {
        return ResourceMap
            .resources
            .filter(i => i.manifest.type == 'biome')
            .find(i => i.manifest.id == name);
    }
    static findAll() {
        return ResourceMap
            .resources
            .filter(i => i.manifest.type == 'biome');
    }
    static updateSky(v) {
        const chunk = Chunks.findChunkAtPosition(v);
        if (chunk) {
            const colors = chunk.biome.biome.colors;
            EffectManager.fog_color = mixColors(colors[0], '#ffffff', 0.4);
            for (let i in colors) {
                document.body.style.setProperty('--biome-colors-' + i, colors[i]);
            }
        }
    }
}
Biomes.firstUpdate = false;
