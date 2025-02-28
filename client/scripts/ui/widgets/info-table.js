import React, { useState } from "react";
import { ItemIcon } from "./slotitem";
import CraftingUI from "./craftui";
import { parseItemDataText } from "../misc/parsetext.tsx";
import { ClassText } from "./classtext.tsx";
import { ColorName } from "./colorname.tsx";
import { ItemActions } from "./actions.tsx";
import { ItemPreview } from "./item-preview.tsx";
export function InfoTable({ currentItem }) {
    const [currentTab, setCurrentTab] = useState('info');
    return (React.createElement("div", { className: "item-info-and-crafting-ui" },
        React.createElement("div", { className: "header" }, currentTab == 'info' ?
            (currentItem ? React.createElement(React.Fragment, null,
                React.createElement(ItemIcon, { item: currentItem }),
                currentItem.reference.item?.name || currentItem.itemID) : 'About items') : (currentTab == 'craft' ? 'Crafting' : currentTab == 'preview' ? 'Preview' : '')),
        React.createElement("div", { className: "tabs" },
            React.createElement("div", { className: "info-tab " + (currentTab == 'info' ? 'active' : ''), onClick: () => setCurrentTab('info') },
                React.createElement("div", { className: "icon c icon-content" })),
            React.createElement("div", { className: "info-tab " + (currentTab == 'craft' ? 'active' : ''), onClick: () => setCurrentTab('craft') },
                React.createElement("div", { className: "icon c icon-anvil" })),
            React.createElement("div", { className: "info-tab " + (currentTab == 'profile' ? 'active' : ''), onClick: () => setCurrentTab('profile') },
                React.createElement("div", { className: "icon c icon-bag" }))),
        React.createElement("div", { className: "content" },
            React.createElement("svg", { version: "1.1", viewBox: "0 7 210 30", id: "svg1", xmlns: "http://www.w3.org/2000/svg" },
                React.createElement("g", { id: "g1" },
                    React.createElement("path", { id: "rect1230", style: { fill: 'var(--var-bg-6)' }, d: "M 0,0 V 24.418187 H 5.8112675 V 34.989154 H 12.543873 V 24.418187 h 6.527502 v 5.749394 h 6.12055 v 4.821573 h 6.73152 V 24.418187 h 12.445118 v 5.749394 h 6.73152 v -5.749394 h 7.344661 v 16.320384 h 6.731521 V 24.418187 h 8.363665 v 10.570967 h 6.732607 V 24.418187 h 9.587779 v 16.320384 h 6.732605 6.323489 V 24.418187 h 19.58465 V 39.25509 h 6.73152 V 24.418187 h 6.73261 v 4.265935 h 6.73153 v -4.265935 h 7.95672 v 17.432711 h 6.73151 V 24.418187 h 7.9567 v 10.570967 h 6.73154 V 24.418187 H 183.0891 V 39.25509 h 6.73262 V 24.418187 h 8.36365 v 10.570967 h 6.73261 V 24.418187 H 210 V 0 Z" }))),
            React.createElement("div", { className: "tab-pane info " + (currentTab == 'info' ? 'active' : '') },
                React.createElement("div", { className: "content-data" }, currentItem ? (currentItem?.data?.content ? parseItemDataText(currentItem?.data?.content) : React.createElement("p", { className: "mt-4" }, "No item data")) : React.createElement("p", { className: "mt-4" }, "No item selected")),
                currentItem && React.createElement("div", { className: "item-preview" },
                    React.createElement(ItemPreview, { currentItem: currentItem })),
                React.createElement("div", { className: "flexbox" },
                    React.createElement("div", { className: "left" },
                        React.createElement("h4", null,
                            React.createElement("u", null, "Effects:")),
                        currentItem?.reference?.item?.boost && React.createElement("ul", null, Object
                            .keys(currentItem.reference.item.boost)
                            .map((key) => {
                            const value = currentItem.reference.item.boost[key];
                            const name = key.replace(key[0], key[0].toUpperCase());
                            return React.createElement("li", { className: value > 0 ? 'plus' : 'minus', key: key },
                                React.createElement("b", null, Math.abs(value)),
                                " ",
                                name);
                        }))),
                    React.createElement("div", { className: "right" },
                        React.createElement("ul", null,
                            currentItem?.data?._eclass && React.createElement("li", null,
                                React.createElement(ClassText, { classname: currentItem.data._eclass }),
                                " Class"),
                            currentItem?.data?.brush_color && React.createElement("li", null,
                                "Color ",
                                React.createElement(ColorName, { color: currentItem.data.brush_color }))))),
                currentItem && React.createElement(ItemActions, { item: currentItem })),
            React.createElement("div", { className: "tab-pane craftui " + (currentTab == 'craft' ? 'active' : '') },
                React.createElement(CraftingUI, null)),
            currentTab == 'profile' && React.createElement("div", { className: "tab-pane active" }))));
}
