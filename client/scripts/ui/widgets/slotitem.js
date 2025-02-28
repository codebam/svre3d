import * as React from "react";
import { generateItemIcon } from "../misc/itemicon.js";
export const ItemIcon = ({ item, onClick }) => {
    // Check if the item has an icon configuration
    const hasIcon = item?.reference?.ui?.icon;
    // CSS classes for styling based on whether the item has an icon
    const classNames = `${hasIcon ? ' item-icon-image c' : ''}`;
    // Inline styles for the item icon
    const iconStyle = generateItemIcon(hasIcon);
    return (React.createElement("div", { className: classNames, onClick: onClick ?? (() => { }), style: iconStyle }));
};
