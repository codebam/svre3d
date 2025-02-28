import React from 'react';
function parsePart(part, state) {
    if (part.trim().startsWith('- ')) {
        if (!state.inul) {
            state.inul = true;
            state.ulContent = [React.createElement("li", { key: state.key++ }, part.slice(2))];
        }
        else {
            state.ulContent.push(React.createElement("li", { key: state.key++ }, part.slice(2)));
        }
        return null;
    }
    else {
        if (state.inul) {
            state.inul = false;
            const ul = React.createElement("ul", { key: state.key++ }, state.ulContent);
            state.ulContent = [];
            return [ul, React.createElement("span", { key: state.key++ }, part)];
        }
        return React.createElement("span", { key: state.key++ }, part);
    }
}
export function parseItemDataText(string) {
    let state = {
        inul: true,
        ulContent: [],
        key: 0,
    };
    const parts = string.trim().split('\n').map((part) => {
        return parsePart(part, state);
    });
    if (state.inul) {
        parts.push(React.createElement("ul", { key: state.key++ }, state.ulContent));
    }
    return React.createElement("span", null, parts.flat());
}
