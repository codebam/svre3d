// This completely overrides the @types/three package
declare module "three/src/Three.js" {}
declare module "three/src/Three" {}
declare module "three/src/Three.js" {}
declare module "three" {
    export class Vector3 {
        constructor(x?: number, y?: number, z?: number);
        x: number;
        y: number;
        z: number;
        set(x: number, y: number, z: number): this;
        copy(v: Vector3): this;
        clone(): Vector3;
        add(v: Vector3): this;
        sub(v: Vector3): this;
        multiply(v: Vector3): this;
        multiplyScalar(scalar: number): this;
        divide(v: Vector3): this;
        divideScalar(scalar: number): this;
        length(): number;
        lengthSq(): number;
        normalize(): this;
        distanceTo(v: Vector3): number;
        distanceToSquared(v: Vector3): number;
        subVectors(a: Vector3, b: Vector3): this;
    }

    export class Quaternion {
        constructor(x?: number, y?: number, z?: number, w?: number);
        x: number;
        y: number;
        z: number;
        w: number;
    }

    export class Euler {
        constructor(x?: number, y?: number, z?: number, order?: string);
        x: number;
        y: number;
        z: number;
        order: string;
    }
}