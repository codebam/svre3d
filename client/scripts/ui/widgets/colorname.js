import React from "react";
import { getColorName } from "../../data/color";
export function ColorName({ color }) {
    return React.createElement("span", { className: "color-text", style: { color } },
        React.createElement("span", { className: "color" }),
        getColorName(color));
}
