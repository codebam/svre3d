import { basicVariables, parseVariable } from "../modules/variableMixer.js";
import { ResourceMap } from "./resources.js";
import { THREE } from "enable3d";
export class MaterialManager {
    static parseMaterial(mat, variables = {}) {
        const materialOptions = typeof mat == "string" ? Object.fromEntries(mat.split('(')
            .splice(1)
            .join('(')
            .split(')')
            .slice(0, -1)
            .join(')')
            .split('\\,').join(';')
            .split(',')
            .map(i => i.split(':').map(t => parseVariable(t.trim().split(';').join(','), variables)))) : mat;
        let fragment = null, vertex = null;
        if (materialOptions.shader) {
            fragment = materialOptions.shader?.fragment;
            vertex = materialOptions.shader?.vertex;
        }
        // console.log(mat, materialOptions);
        return MaterialManager.makeObjectMaterial({
            fragment,
            vertex,
            materialOptions
        }, variables);
    }
    static makeObjectMaterial(shader, variables = {}) {
        let { fragment, vertex, materialOptions } = shader;
        const uniforms = {
            gc_camRight: { value: new THREE.Vector3(1.0, 0.0, 0.0) },
            gc_camUp: { value: new THREE.Vector3(0.0, 1.0, 0.0) },
        };
        if (!fragment && materialOptions.fragment)
            fragment = ResourceMap.find(parseVariable(materialOptions.fragment, variables)) || materialOptions.fragment;
        if (!vertex && materialOptions.vertex)
            vertex = ResourceMap.find(parseVariable(materialOptions.vertex, variables)) || materialOptions.vertex;
        if (materialOptions.texture) {
            const texture = ResourceMap.find(parseVariable(materialOptions.texture, variables));
            // console.log(texture);
            if (texture) {
                uniforms.textureMap = { value: texture.texture.clone() };
                materialOptions.map = texture.texture.clone();
            }
            delete materialOptions.texture;
        }
        if (materialOptions.normalMap) {
            const texture = ResourceMap.find(parseVariable(materialOptions.normalMap, variables));
            console.log(texture, materialOptions.normalMap);
            if (texture) {
                uniforms.normalMap = { value: texture.texture.clone() };
                materialOptions.normalMap = texture.texture.clone();
            }
        }
        const mat = fragment && vertex ? new THREE.ShaderMaterial({
            fragmentShader: fragment,
            vertexShader: vertex,
            uniforms
        }) : new THREE.MeshStandardMaterial({
            ...MaterialManager.parseMaterialOptions(materialOptions, { ...variables, ...basicVariables })
        });
        mat.userData.source = { fragment, vertex, materialOptions };
        mat.userData.baseColor = materialOptions.baseColor || 0x000000;
        return mat;
    }
    static parseMaterialOptions(options, variables = {}) {
        const o = {};
        const keys = ['map', 'color', 'emissive', 'emissiveIntensity', 'metalness', 'opacity', 'color', 'roughness', 'wireframe', 'transparent', 'normalMap'];
        for (let i of keys)
            if (i in options)
                o[i] = parseVariable(options[i], variables);
        return o;
    }
    static parse(mat, variables) {
        return typeof mat == "string" ? mat.startsWith('mat(') ? MaterialManager.parseMaterial(mat, variables) : MaterialManager.makeObjectMaterial(ResourceMap.find(mat), variables) : MaterialManager.parseMaterial(mat, variables);
    }
    static makeSegmentMaterial(texture, biome, normalMap) {
        const { fragment, vertex, materialOptions } = biome?.ground?.shader || { materialOptions: {} };
        const uniforms = {
            textureMap: { value: texture },
            // shadowMap: { value: scene.lightSet.directionalLight.shadow.map }
        };
        const colorOptions = {};
        if (biome.tile?.variation_color && biome.tile?.variation_color !== 'none') {
            colorOptions.color = biome.tile.variation_color;
        }
        const mat = materialOptions ? new THREE.MeshStandardMaterial({
            ...MaterialManager.parseMaterialOptions(materialOptions),
            map: texture,
            normalMap,
            ...colorOptions
        }) : new THREE.ShaderMaterial({
            fragmentShader: fragment,
            vertexShader: vertex,
            uniforms
        });
        mat.userData.source = { fragment, vertex, materialOptions };
        mat.userData.baseColor = biome.tile.variation_color;
        return mat;
    }
    static applyMaterials(obj, mat, variables = {}) {
        const materialsRule = Array.isArray(mat) ? mat : [mat];
        const iterate = (child, index, parent) => {
            if (child.isGroup || child.isBone) {
                return child.children.forEach(iterate);
            }
            const mat = materialsRule.length > 1 ? materialsRule[index] : materialsRule[0];
            if (mat) {
                if (Array.isArray(child.material)) {
                    if (Array.isArray(mat))
                        child.material = materialsRule.map(mat => {
                            // console.log(mat);
                            return MaterialManager.parse(mat, variables);
                        });
                    else if (typeof mat == "object") {
                        if (mat.variables) {
                            variables = { ...variables, ...mat.variables };
                            delete mat.variables;
                        }
                        child.material = child.material.map(mate => {
                            if (mate.name in mat) {
                                return MaterialManager.parse(mat[mate.name], variables);
                            }
                            else {
                                return mate;
                            }
                        });
                    }
                    else {
                        child.material = MaterialManager.parse(mat, variables);
                    }
                }
                else {
                    child.material = typeof mat == 'object' && child.material.name in mat
                        ? MaterialManager.parse(mat[child.material.name], variables)
                        : MaterialManager.parse(mat, variables);
                }
            }
        };
        obj.children.forEach(iterate);
    }
    static calculateAverageColor(material) {
        const colorAccumulator = new THREE.Color(0, 0, 0);
        const _traverseMaterial = (material) => {
            if (material.color) {
                colorAccumulator.add(material.color);
            }
            else if (material.userData.baseColor) {
                colorAccumulator.add(new THREE.Color(material.userData.baseColor));
            }
        };
        if (Array.isArray(material)) {
            material.forEach(m => _traverseMaterial(m));
        }
        else {
            _traverseMaterial(material);
        }
        return colorAccumulator;
    }
    static getBaseColorMaterial(material) {
        const averageColor = MaterialManager.calculateAverageColor(material);
        return new THREE.MeshBasicMaterial({ color: averageColor });
    }
}
