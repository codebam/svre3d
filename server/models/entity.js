import { ServerData } from "./data.js";
class EntityData extends ServerData {
    constructor() {
        super();
        this.inventory = []; // Inventory of the entity
        this.ai = true;
        this.class = "common";
        this.attackInfo = {
            cooldown: 60,
            current: 0
        };
        this.stepOn = "";
        this.flags = ['entity'];
        this.data = {};
        this.restTime = {
            current: 0,
            max: 2000,
            min: 1000,
            currentMax: 1000
        };
        this.init = false;
        this.type = "";
        this.name = "";
        this.position = { x: 0, y: 0, z: 0 };
        this.inventory = [];
        this.variant = "";
        this.state = "Idle";
        this.isNeutral = false;
        this.buffs = [];
        this.health = { max: 1, current: 1 };
    }
    // Method to add an item to the inventory
    addToInventory(item) {
        const existingItem = this.findItemTypeInInventory(item);
        const addIt = () => {
            if (item.quantity > item.max) {
                const overflow = item.quantity - item.max;
                item.quantity = item.max;
                const hasUnMaxed = this.findItemTypeInInventoryMany(item).find(i => i.quantity < i.max);
                if (hasUnMaxed)
                    hasUnMaxed.quantity += overflow;
                else
                    this.addToInventory(item.clone({
                        quantity: overflow
                    }));
            }
            this.inventory.push(item);
            return 'add';
        };
        if (existingItem) {
            if (!isNaN(existingItem.quantity))
                existingItem.quantity = parseInt(existingItem.quantity);
            if (!isNaN(item.quantity))
                item.quantity = parseInt(item.quantity);
            if (existingItem.quantity + item.quantity <= existingItem.max) {
                existingItem.quantity += item.quantity;
                return 'increase';
            }
            else {
                const remainingCount = existingItem.max - existingItem.quantity;
                existingItem.quantity = existingItem.max;
                item.quantity -= remainingCount;
                return addIt();
            }
        }
        else {
            return addIt();
        }
    }
    // Method to remove an item from the inventory
    removeFromInventory(item, count = 1) {
        const existingItem = this.findItemTypeInInventory(item);
        if (!existingItem)
            return;
        if (existingItem.quantity > count) {
            existingItem.quantity -= count;
            this.mergeItemsInInventory(existingItem);
            return 'decrease';
        }
        else {
            let overflow = count - existingItem.quantity;
            this.inventory.splice(this.inventory.indexOf(existingItem), 1);
            if (overflow > 0) {
                this.removeFromInventory(existingItem.clone({ quantity: overflow }), overflow);
            }
            this.mergeItemsInInventory(existingItem);
            return 'remove';
        }
    }
    mergeItemsInInventory(item) {
        const itemsToMaximize = this.inventory.filter(i => i.itemID === item.itemID);
        const inventory = this.inventory;
        // Maximize these items from the overflow
        while (itemsToMaximize.length > 1)
            itemsToMaximize.forEach((itm, ind) => {
                let amountNeeded = itm.max - itm.quantity;
                let amountToAdd = itemsToMaximize[ind + 1] ? itemsToMaximize[ind + 1].quantity > amountNeeded ? amountNeeded : itemsToMaximize[ind + 1].quantity : 0;
                itm.quantity += amountToAdd;
                if (itemsToMaximize[ind + 1] && amountToAdd) {
                    itemsToMaximize[ind + 1].quantity -= amountToAdd;
                }
                if (itm.quantity < 1) {
                    inventory.splice(inventory.indexOf(itm), 1);
                    itemsToMaximize.splice(itemsToMaximize.indexOf(itm), 1);
                }
                else if (itm.quantity == itm.max) {
                    itemsToMaximize.splice(itemsToMaximize.indexOf(itm), 1);
                }
            });
    }
    countItemsInInventory(item) {
        const items = this.findItemTypeInInventoryMany(item);
        let count = 0;
        items.forEach(item => {
            count += item.quantity;
        });
        return count;
    }
    findItemTypeInInventory(item) {
        return this.inventory.find(i => i.itemID === item.itemID);
    }
    findItemTypeInInventoryMany(item) {
        return this.inventory.filter(i => i.itemID === item.itemID);
    }
    findItemInInventory(item) {
        return this.inventory.find(i => i.id === (typeof item == "string" ? item : item.id));
    }
    findItemByData(key, value) {
        return this.inventory.find(i => i.data[key] == value);
    }
}
export { EntityData };
