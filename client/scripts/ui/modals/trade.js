import { createRoot } from "react-dom/client";
import UI from "../uiman";
import React, { useState } from "react";
import { ItemIcon } from "../widgets/slotitem";
import { Items } from "../../repositories/items";
import { PlayerInfo } from "../../repositories/player";
import GlobalEmitter from "../../misc/globalEmitter";
export const TradeList = ({ list, close }) => {
    const [selectedItem, setSelectedItem] = useState(null);
    const hasAllItems = (tradeItem) => tradeItem.costs.every(i => PlayerInfo.entity?.countItemsInInventory({ itemID: i.item }) || 0 >= i.quantity);
    const trade = () => {
        if (selectedItem) {
            const has = hasAllItems(selectedItem);
            if (has) {
                selectedItem.costs.forEach(cost => {
                    PlayerInfo.entity.removeFromInventory(Items.create({
                        itemID: cost.item,
                        quantity: cost.quantity,
                    }), cost.quantity);
                });
                selectedItem.items.forEach(item => {
                    PlayerInfo.entity.addToInventory(Items.create({
                        itemID: item.item,
                        quantity: item.quantity,
                    }));
                });
            }
        }
    };
    return (React.createElement("div", { className: "trade-modal" },
        React.createElement("div", { className: "trade-list" },
            React.createElement("h2", null, list.name),
            React.createElement("div", { className: "main-grid" },
                React.createElement("div", { className: "trader-face" },
                    selectedItem && React.createElement("div", { className: "items-list" }, selectedItem.items.map((item, index) => (React.createElement(ItemIcon, { key: index, item: Items.create({
                            itemID: item.item,
                            quantity: item.quantity,
                        }) })))),
                    selectedItem && React.createElement("div", { className: "trade-button", onClick: trade }, "Trade")),
                React.createElement("div", { className: "trade-items" }, list.items.map((tradeItem, index) => (React.createElement("div", { key: index, className: "trade-item " + (hasAllItems(tradeItem) ? '' : 'locked'), onClick: () => hasAllItems(tradeItem) ? setSelectedItem(tradeItem) : {} },
                    React.createElement("div", { className: "costs items-list" }, tradeItem.costs.map((cost, costIndex) => (React.createElement(ItemIcon, { key: costIndex, item: Items.create({
                            itemID: cost.item,
                            quantity: cost.quantity,
                        }) })))),
                    React.createElement("div", { className: "items items-list" }, tradeItem.items.map((item, itemIndex) => (React.createElement(ItemIcon, { key: itemIndex, item: Items.create({
                            itemID: item.item,
                            quantity: item.quantity,
                        }) }))))))))),
            React.createElement("div", { className: "close", onClick: close }))));
};
export default class TradeUI {
    static open(tradeMenu) {
        const container = document.createElement('div');
        UI.uiRoot.appendChild(container);
        const root = createRoot(container);
        GlobalEmitter.emit('menu:open', {
            close: () => removeComponent()
        });
        const removeComponent = () => {
            root.unmount();
            UI.uiRoot.removeChild(container);
            GlobalEmitter.emit('menu:close');
        };
        const list = React.createElement(TradeList, { list: tradeMenu, close: removeComponent });
        root.render(list);
    }
}
