import React, { useState } from "react";
import { Items } from "../../repositories/items.js";
import { prompt } from "../componets/prompt.js";
import { Context } from "../data/context.js";
import { InventoryItem } from "./inventory.js";
const Tool = ({ tool, activeTool, handleActiveToolChange }) => React.createElement("div", { onClick: () => handleActiveToolChange(tool), className: "tool " + tool + ' ' + (activeTool == tool ? 'active' : '') });
const CraftingUI = () => {
    const { crafting_selectItems, setcrafting_selectItems, crafting_slotItems, crafting_setSlotItems, crafting_setItemAtSlot, setCurrentItem, inventory } = React.useContext(Context);
    const [contentValue, setContentValue] = useState("");
    const [resultItem, setResultItem] = useState(null);
    const [activeTool, setActiveTool] = useState(null);
    const [brushColor, setBrushColor] = useState(null);
    // const [currentSlots, setCurrentSlots] = useState<any[]>([]);
    const handleBrushColor = (color) => {
        setBrushColor(color);
        crafting_slotItems.forEach(item => (item.options = (item.options || {})) && (item.options.brushColor = color));
    };
    const handleActiveToolChange = (tool) => {
        if (activeTool == tool) {
            setActiveTool(null);
            slotsUpdate(null);
            if (brushColor)
                handleBrushColor(null);
        }
        else {
            if (tool == 'brush') {
                prompt('Color', (c) => {
                    handleBrushColor(c);
                    setActiveTool(tool);
                    slotsUpdate(tool);
                });
            }
            else {
                setActiveTool(tool);
                slotsUpdate(tool);
            }
        }
    };
    const finishCraft = () => {
        // crafting_setSlotItems([]);
        // setContentValue("");
        // setResultItem(null);
        slotsUpdate();
    };
    const slotsUpdate = (tool = activeTool) => {
        if (!crafting_slotItems.length)
            return;
        Items.crafting(true, tool || '', ...crafting_slotItems)
            .then(i => {
            setResultItem(i ? Items.create({
                itemID: i.item.itemID || i.item.manifest.id,
                quantity: i.quantity
            }) : null);
        });
    };
    const craft = () => {
        Items.crafting(false, activeTool || '', ...crafting_slotItems)
            .then(i => {
            finishCraft();
        });
    };
    // useEffect(() => {
    //     console.log('updated');
    //     setCurrentSlots(crafting_slotItems);
    //     slotsUpdate();
    // }, [crafting_slotItems]);
    // useEffect(() => {
    //     GlobalEmitter.on('crafting:slots:update', (items) => {
    //         console.log(items);
    //         setCurrentSlots(items);
    //         slotsUpdate();
    //     });
    // }, []);
    const handleSlotClick = (index) => {
        if (crafting_slotItems[index])
            return;
        if (crafting_selectItems > -1) {
            setcrafting_selectItems(-1);
        }
        else {
            setcrafting_selectItems(index);
        }
    };
    const handleSlotRemove = (index, e = null) => {
        if (e)
            e.preventDefault();
        crafting_setItemAtSlot(index, null);
        setCurrentItem(null);
        setResultItem(null);
        slotsUpdate();
    };
    const handleInputChange = (e) => {
        setContentValue(e.target.value);
    };
    return (React.createElement("div", { id: "craft-ui" },
        React.createElement("div", { className: "slots" },
            React.createElement("div", { className: "slot empty " + (crafting_selectItems > -1 ? 'x' : ''), onClick: () => handleSlotClick(0), onContextMenu: (e) => handleSlotRemove(0, e) }, crafting_slotItems[0] && inventory.find(i => i.id == crafting_slotItems[0].id) ? React.createElement(React.Fragment, null,
                React.createElement(InventoryItem, { click: false, item: inventory.find(i => i.id == crafting_slotItems[0].id) })) : null),
            React.createElement("div", { className: "slot empty " + (crafting_selectItems > -1 ? 'x' : ''), onClick: () => handleSlotClick(1), onContextMenu: (e) => handleSlotRemove(1, e) }, crafting_slotItems[1] && inventory.find(i => i.id == crafting_slotItems[1].id) ? React.createElement(React.Fragment, null,
                React.createElement(InventoryItem, { click: false, item: inventory.find(i => i.id == crafting_slotItems[1].id) })) : null),
            React.createElement("div", { className: "slot tool" }, activeTool ? React.createElement(Tool, { handleActiveToolChange: () => { }, activeTool: '', tool: activeTool }) : React.createElement("div", { className: "icon" })),
            React.createElement("div", { className: "arrow" },
                React.createElement("div", { className: "icon icon-arrow-right" })),
            React.createElement("div", { className: "slot result", onClick: () => resultItem ? craft() : null }, resultItem ?
                React.createElement(InventoryItem, { item: resultItem })
                : null)),
        React.createElement("div", { className: "tools" },
            React.createElement("h3", null, "Tools"),
            React.createElement("div", { className: "tools-grid" },
                React.createElement("div", { className: "tool-list" },
                    React.createElement(Tool, { handleActiveToolChange: handleActiveToolChange, activeTool: activeTool, tool: "hammer" }),
                    React.createElement(Tool, { handleActiveToolChange: handleActiveToolChange, activeTool: activeTool, tool: "press" }),
                    React.createElement(Tool, { handleActiveToolChange: handleActiveToolChange, activeTool: activeTool, tool: "brush" }),
                    React.createElement(Tool, { handleActiveToolChange: handleActiveToolChange, activeTool: activeTool, tool: "melter" }),
                    React.createElement(Tool, { handleActiveToolChange: handleActiveToolChange, activeTool: activeTool, tool: "assembler" })),
                React.createElement("div", { className: "tool-info" },
                    React.createElement("div", { className: "liner" }),
                    React.createElement("div", { className: "content" },
                        React.createElement("h3", null, "Assembler"),
                        React.createElement("div", { className: "separator" },
                            React.createElement("div", { className: "line" }),
                            React.createElement("div", { className: "guy" }),
                            React.createElement("div", { className: "line" })),
                        React.createElement("p", null, "Lorem ipsum dolor sit amet consectetur adipisicing elit. Tenetur reprehenderit veniam cum quis doloremque quasi minus adipisci repellat, corporis voluptate, quas inventore alias eum, ipsa ab iste harum repellendus aperiam!")))))));
};
export default CraftingUI;
