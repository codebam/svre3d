import { fileURLToPath } from 'url';
import path from "path";
import fs from "fs";
import { ResourceMap } from "../repositories/resources.js";
import { Parser } from "../lib/loader/Parser.class.js";
import { STD } from "../lib/loader/STD.class.js";
import { Package } from "../lib/loader/Package.class.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export function loadAllResources(map, serverData) {
    STD.registerMap(new Parser().parseYAML(path.resolve(__dirname, '../../packages/iovie/std.yaml')));
    const packagesPath = path.resolve(__dirname, '../../packages');
    const packages = fs.readdirSync(packagesPath);
    packages.forEach(file => {
        const packagePath = path.join(packagesPath, file);
        if (fs.existsSync(path.join(packagePath, 'main.yaml'))) {
            ResourceMap.addPackage(new Package(packagePath, serverData));
        }
    });
}
