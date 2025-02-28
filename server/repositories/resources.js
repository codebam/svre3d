export class ResourceMap {
    static addPackage(pkg) {
        ResourceMap.resources.push(pkg);
    }
    static findResource(id, type) {
        return ResourceMap.resources.find(i => i.findById(id))?.findById(id);
    }
    static all() {
        const res = [];
        this.resources.forEach(i => res.push(...i.data.filter(i => i.manifest.type !== 'book')));
        return res;
    }
}
ResourceMap.resources = [];
