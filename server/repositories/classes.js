import { Random } from "../common/rand.js";
import { seedrng } from "../constant/seed.js";
function setAt(obj, path, value) {
    const keys = path.split('.');
    let current = obj;
    for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) {
            current[keys[i]] = {};
        }
        current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;
}
var CLASSES;
(function (CLASSES) {
    CLASSES["RARE"] = "rare";
    CLASSES["UNCOMMON"] = "uncommon";
    CLASSES["COMMON"] = "common";
    CLASSES["ELITE"] = "elite";
    CLASSES["PRIME"] = "prime";
    CLASSES["UNIQUE"] = "unique";
})(CLASSES || (CLASSES = {}));
export class EntityClasses {
    static setClass(item, classname) {
        const classInfo = item.reference.class;
        if (!item.data._eclass_data) {
            const currentClass = classInfo[classname || item.data._eclass]?.value;
            if (typeof currentClass == 'object')
                for (let i in currentClass)
                    if (Array.isArray(currentClass[i]))
                        currentClass[i] = Random.pick(...currentClass[i]);
            item.data._eclass_data = currentClass;
        }
        setAt(item.reference, classInfo.at, item.data._eclass_data);
    }
    static _selectClass(classes) {
        const randomValue = seedrng();
        let cumulative = 0;
        for (const [key, item] of Object.entries(classes)) {
            cumulative += item.chance;
            if (randomValue <= cumulative) {
                return key;
            }
        }
    }
    static introduce(item) {
        const classes = item.reference.class;
        let at = classes.at;
        delete classes.at;
        const classSelected = this._selectClass(classes);
        classes.at = at;
        item.data._eclass = classSelected;
        this.setClass(item, classSelected);
    }
}
EntityClasses.CLASSES = CLASSES;
