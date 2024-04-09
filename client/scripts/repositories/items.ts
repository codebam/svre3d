import { ServerData } from "../../../server/models/data";
import { ItemData } from "../../../server/models/item";
import { Item } from "../models/item";
import { ping } from "../socket/socket";
import { PlayerInfo } from "./player";
import { ResourceMap } from "./resources";



export class Items {

	static create(itemData: ItemData){

		const item = ServerData.create(Item, itemData);

		const ref = ResourceMap.find(item.itemID)!;

		item.setReference(ref);
		item.max = ref.config?.inventory?.max || 1;

		return item;
	}

	private static crafting_request: any;
	static crafting(...items: Item[]){
		if(this.crafting_request) Promise.resolve(this.crafting_request);
		this.crafting_request = ping('crafting:craft', {entity: PlayerInfo.entity.id,items:items.map(i => ({ itemID: i.itemID, max: i.max, quantity: i.quantity, id: i.id }))})
		.then((e) => {
			if(!e) return console.log('abort');
			this.crafting_request = null;
			console.log(e);
		});
	}

}