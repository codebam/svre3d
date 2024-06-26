import { Entity } from "../models/entity";
import { Item } from "../models/item";
import { Items } from "./items";
import * as uuid from "uuid";
import { MaterialManager } from "./materials";
import { cloneGltf } from "../lib/gltfclone";
import { THREE } from "enable3d";

export class Equipments {

	static brows = {};

	static entity(entity: Entity){

		if(!entity.data.equipment.brow) entity.data.equipment.brow = 'i:normal-brow';

		for(let i in entity.data.equipment){
			let item = i == 'brow' ? Items.create({
				itemID: entity.data.equipment[i]
			} as any) : entity.findItemByData('wid', entity.data.equipment[i]);

			const ref = item?.reference;

			if(ref?.equipment?.type == i){
				Equipments.equip(entity, i, item as Item);
			}

			if(i == 'brow'){
				Equipments.brows[item?.data.wid] = item?.itemID;
			}

		}

	}

	static equip(entity: Entity, type: string, item: Item){
		const wid = item.data.wid ||  uuid.v4();
		if(item.data.wid != wid) item.data.wid = wid;

		entity.data.equipment[type] = wid;

		const bodyMesh = Equipments.entityBody('body', entity);

		const equipmentMesh = item.reference!.resource.loader == 'gltf' ? cloneGltf(item.reference.resource!.load) : item.reference!.resource.mesh.clone();
		
		// console.log(item.reference!.load)

		const ref = item?.reference;

		if(item.reference?.animation){
			Items.initItemAnimation(item, equipmentMesh);
		}

		bodyMesh.add(equipmentMesh);

		if(ref.config?.material){
			const mat = ref.config?.material;
			if(typeof mat == 'string'){
				const material = MaterialManager.parse(mat, {...entity.data, ...item.data});
				
				equipmentMesh.traverse(i => {
					equipmentMesh.material = i.material = material;
				});
			} else if(typeof mat == 'object'){
				for(let i in mat){
					const material = mat[i];
					const part = Equipments.entityBody(
						i,
						{ ...item, object3d: equipmentMesh } as any,
					);
					part.material = MaterialManager.parse(material, {...entity.data, ...item.data})
				}
			}
		}

		equipmentMesh.position.x += ref.view.object.position.x;
		equipmentMesh.position.y += ref.view.object.position.y;
		equipmentMesh.position.z += ref.view.object.position.z;

		if(ref.view.object!.scale){
			equipmentMesh.scale.x = ref.view.object!.scale.x;
			equipmentMesh.scale.y = ref.view.object!.scale.y;
			equipmentMesh.scale.z = ref.view.object!.scale.z;
		}

		if(ref.view.object!.rotateY) {
			equipmentMesh.rotation.y = THREE.MathUtils.degToRad(ref.view.object!.rotateY);
		}

		item.data.wmeshid = equipmentMesh.uuid;

		entity.emit('equip');
	}

	static unequip(entity: Entity, type: string, item: Item){
		delete entity.data.equipment[type];

		const bodyMesh = Equipments.entityBody('body', entity);

		const equipmentMesh = bodyMesh.children.find(i => i.uuid == item.data.wmeshid)!;

		bodyMesh.remove(equipmentMesh);

		delete item.data.wmeshid;
		delete item.data.wid;

		entity.data.uneqiupped = item;
		entity.emit('unequip');
	}

	static entityBody(partname: string, entity: Entity, fallback: string = ''){

		let ref = entity.reference;

		let part = ref.view?.object?.[partname] || fallback;

		const referee = part ? part.split('.') : [];
		let object = entity.object3d;
		referee.forEach(r => {
			object = object.children[r] || object;
		});

		return object;
	}

}