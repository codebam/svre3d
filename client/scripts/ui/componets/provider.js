import { PlayerInfo } from "../../repositories/player.js";
import { Context } from "../data/context.js";
import React, { useEffect, useState } from "react";
import GlobalEmitter from "../../misc/globalEmitter.js";
import { pingFrom } from "../../socket/socket.js";
let listening = false;
export const MainUI = ({ children }) => {
    const [tab, setTab] = useState('map');
    const [inventory, setInventory] = useState([...(PlayerInfo.entity?.inventory || [])]);
    const [currentItem, setCurrentItem] = React.useState(null);
    const [currentBook, setCurrentBook] = useState(null);
    const [currentPage, setCurrentPage] = useState(null);
    const [chats, setChats] = useState([]);
    const addChat = (chat) => {
        setChats(prevChats => [...prevChats, chat]);
    };
    const removeChat = (chat) => {
        setChats(chats => chats.filter(c => chat.message.id !== c.message.id));
    };
    const editChatContent = (chat) => {
        setChats(chats => chats.map(c => {
            if (chat.message.id !== c.message.id) {
                c.message.text = chat.message.text;
            }
            return c;
        }));
    };
    const [crafting_selectItems, setcrafting_selectItems] = useState(-1);
    const [crafting_slotItems, crafting_setSlotItems] = useState([]);
    const crafting_setItemAtSlot = (index, item) => {
        if (item == null) {
            crafting_slotItems.splice(index, 1);
        }
        else
            crafting_slotItems[index] = item;
        crafting_setSlotItems(crafting_slotItems);
    };
    const data = {
        tab, setTab,
        inventory, setInventory,
        currentItem, setCurrentItem,
        currentBook, setCurrentBook,
        currentPage, setCurrentPage,
        chats, setChats,
        addChat, removeChat, editChatContent,
        crafting_slotItems, crafting_setSlotItemsC: (items) => {
            crafting_setSlotItems(items);
            GlobalEmitter.emit('crafting:slots:update', items);
        },
        crafting_setSlotItems,
        crafting_setItemAtSlot,
        crafting_selectItems, setcrafting_selectItems
    };
    useEffect(() => {
        if (listening)
            return;
        listening = true;
        PlayerInfo.entity?.on('inventory', () => {
            setInventory([...PlayerInfo.entity.inventory]);
        }).on('equip', () => {
            setInventory([...PlayerInfo.entity.inventory]);
        }).on('unequip', () => {
            setInventory([...PlayerInfo.entity.inventory]);
        });
        pingFrom('chat:send', (msg) => {
            addChat(msg);
        });
        GlobalEmitter.on('openChats', () => {
            setTab('chats');
        });
    }, []);
    // React.useEffect(() => {
    // 	Map2D.activeTab = tab;
    // }, [tab]);
    return React.createElement(Context.Provider, { value: data }, children);
};
