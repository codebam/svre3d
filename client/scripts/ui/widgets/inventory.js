import React from 'react';
import { ItemIcon } from './slotitem';
export const InventoryItem = ({ selectItem, unselectItem, item, free = false, mouse = false, click = true, counter = true, selectedItem = {}, onClick, secondaryClick = (any) => { } }) => {
    const onclick = () => {
        if (onClick) {
            const result = onClick(item);
            if (result == 'no_aftereffect')
                return;
        }
        if (!click)
            return;
        selectItem?.(item);
        // if (item?.reference?.equipment) {
        //   if (item?.data.wid) {
        //     Equipments.unequip(PlayerInfo.entity, item?.reference!.equipment!.type!, item);
        //   } else {
        //     Equipments.equip(PlayerInfo.entity, item?.reference!.equipment!.type!, item);
        //   }
        // }
    };
    return (React.createElement("div", { onClick: onclick, onMouseEnter: () => mouse ? selectItem?.(item) : null, 
        // onContextMenu={(e) => {
        //   e.preventDefault();
        //   secondaryClick(item);
        // }}
        className: (free ? '' : "inventory-item") + ' ' + (selectedItem ? (selectedItem.id == item.id ? 'active' : '') : '') },
        item.reference.item.achievement && React.createElement("div", { className: "item-badge" },
            React.createElement("div", { className: "icon c sm icon-ribbon" })),
        React.createElement("div", { className: "item-icon" },
            React.createElement(ItemIcon, { item: item })),
        React.createElement("div", { className: "item-info", style: item.data?.brush_color ? {
                borderLeft: '1px solid ' + item.data?.brush_color
            } : {} },
            React.createElement("div", { className: "item-name" }, item.reference?.item?.name || item.itemID),
            React.createElement("div", { className: "item-quantity" }, item.data?.wid ? React.createElement(React.Fragment, null,
                React.createElement("span", { className: "icon c xsm icon-tshirt" })) : item.quantity))));
};
const Inventory = ({ inventory, selectItem, unselectItem, onClick, className = '', selectedItem = {} }) => {
    return (React.createElement("div", { className: "inventory " + className }, inventory.map((item, index) => React.createElement(InventoryItem, { key: index, selectedItem: selectedItem, selectItem: selectItem, unselectItem: unselectItem, item: item, onClick: onClick }))));
};
export default Inventory;
