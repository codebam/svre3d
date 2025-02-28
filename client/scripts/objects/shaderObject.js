import { THREE } from "enable3d";
import { ResourceMap } from "../repositories/resources";
export class ShaderStructure extends THREE.Mesh {
    constructor(options) {
        if (!options)
            options = {};
        if (!options.size)
            options.size = 1;
        super(new THREE.BoxGeometry(options.size, options.size, options.size));
        this.shader = options.shader;
        this.material = this.createMaterial(options);
    }
    createMaterial(options) {
        return new THREE.ShaderMaterial({
            defines: this.shader.defines || {},
            uniforms: THREE.UniformsUtils.clone(this.createUniforms(options)),
            vertexShader: this.shader.material.vertex,
            fragmentShader: this.shader.material.fragment,
            transparent: this.shader.material.transparent ?? false
        });
    }
    createUniforms(options) {
        const uniforms = {
            time: { value: 0 }
        };
        for (let i in this.shader.uniforms) {
            const uniform = this.shader.uniforms[i];
            if (uniform.o) {
                uniform.value = options[i] || uniform.value;
            }
            if (uniform.type == 't') {
                const tex = ResourceMap.find(uniform.value)?.resource.load;
                uniforms[i] = { value: uniform.index ? tex?.[uniform.index] : tex };
            }
            else if (uniform.type == 'c') {
                uniforms[i] = { value: uniform.value ? new THREE.Color(uniform.value) : new THREE.Color(0xffffff) };
            }
            else if (uniform.type?.startsWith('m')) {
                uniforms[i] = { value: uniform.value ? new THREE[uniform.type.endsWith('4') ? 'Matrix4' : 'Matrix3'](...uniform.value) : null };
            }
            else if (uniform.type?.startsWith('v')) {
                uniforms[i] = { value: uniform.value ? new THREE[uniform.type.endsWith('2') ? 'Vector2' : uniform.type.endsWith('4') ? 'Vector4' : 'Vector3'](...uniform.value) : null };
            }
            else if (uniform.type == 'v') {
                uniforms[i] = { value: options[uniform.value] };
            }
            else {
                uniforms[i] = { value: uniform.value };
            }
        }
        return uniforms;
    }
    update(time) {
        var invModelMatrix = this.material.uniforms.invModelMatrix.value;
        this.updateMatrixWorld();
        invModelMatrix.copy(this.matrixWorld).invert();
        if (time !== undefined) {
            this.material.uniforms.time.value = time;
        }
        this.material.uniforms.invModelMatrix.value = invModelMatrix;
        this.material.uniforms.scale.value = this.scale;
    }
    ;
}
