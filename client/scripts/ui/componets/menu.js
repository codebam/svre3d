import * as React from "react";
import { Tab, TabPane } from "../widgets/tabs.js";
import { Map2DWidget } from "../widgets/map.js";
import Inventory from "../widgets/inventory.js";
import CraftingUI from "../widgets/craftui.js";
import BookComponent from "../widgets/books.js";
import { ResourceMap } from "../../repositories/resources.js";
import { DefaultBooks } from "../constants/books.js";
import { Context } from "../data/context.js";
import ChatsUI from "../chats/chats.js";
import { SettingsUI } from "../widgets/settings.js";
import { Separator } from "../widgets/sep.js";
import { InfoTable } from "../widgets/info-table.js";
export const Menu = () => {
    const { tab, setTab, currentItem, setCurrentItem, inventory, crafting_selectItems, setcrafting_selectItems, crafting_setItemAtSlot } = React.useContext(Context);
    return (React.createElement("div", { className: "player-menu", id: "full-menu" },
        React.createElement("div", { className: "sidebar " + (crafting_selectItems > -1 ? 'disabled' : '') },
            React.createElement(Tab, { tab: "inventory", setActiveTab: setTab, activeTab: tab },
                React.createElement("b", { className: "icon big icon-bag" })),
            React.createElement(Tab, { tab: "map", setActiveTab: setTab, activeTab: tab },
                React.createElement("b", { className: "icon big icon-map" })),
            React.createElement(Tab, { tab: "book", setActiveTab: setTab, activeTab: tab },
                React.createElement("b", { className: "icon big icon-book" })),
            React.createElement(Tab, { tab: "chats", setActiveTab: setTab, activeTab: tab },
                React.createElement("b", { className: "icon big icon-mail" })),
            React.createElement(Tab, { tab: "settings", setActiveTab: setTab, activeTab: tab },
                React.createElement("b", { className: "icon big icon-settings" }))),
        React.createElement("div", { className: "menu-content " + (crafting_selectItems > -1 ? "full" : '') },
            React.createElement(TabPane, { tab: "inventory", activeTab: tab },
                React.createElement("h1", null, "Inventory"),
                React.createElement(Separator, null),
                React.createElement("div", { className: "inventory-tab" },
                    React.createElement(Inventory, { className: crafting_selectItems > -1 ? "select" : '', selectItem: (item) => setCurrentItem(item), unselectItem: () => setCurrentItem(null), selectedItem: currentItem, inventory: inventory, onClick: (item) => {
                            if (crafting_selectItems > -1) {
                                crafting_setItemAtSlot(crafting_selectItems, item);
                                setCurrentItem(item);
                                setcrafting_selectItems(-1);
                                return 'no_aftereffect';
                            }
                        } }),
                    React.createElement(InfoTable, { currentItem: currentItem }))),
            React.createElement(TabPane, { id: "craft-ui", tab: "crafting", activeTab: tab },
                React.createElement(CraftingUI, null)),
            React.createElement(TabPane, { tab: "map", activeTab: tab, id: "map" },
                React.createElement(Map2DWidget, { activeTab: tab })),
            React.createElement(TabPane, { tab: "book", activeTab: tab },
                React.createElement(BookComponent, { books: ResourceMap.resources.filter(i => i?.book).map(i => ({ id: i.book }))
                        .concat(DefaultBooks()) })),
            React.createElement(TabPane, { tab: "chats", activeTab: tab },
                React.createElement(ChatsUI.init, null)),
            React.createElement(TabPane, { tab: "settings", activeTab: tab },
                React.createElement(SettingsUI, null)))));
};
