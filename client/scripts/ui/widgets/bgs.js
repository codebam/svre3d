import * as React from "react";
export function BGStars() {
    return React.createElement("div", { className: "bg-stars" }, Array(75).fill(0).map((n, i) => i + 1)
        .map((i) => React.createElement("div", { className: "dotWrapper dotWrapper-" + i, key: i },
        React.createElement("div", { className: "dot dot-" + i }))));
}
