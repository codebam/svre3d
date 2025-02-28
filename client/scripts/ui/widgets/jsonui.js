import * as React from "react";
import { parseVariable } from "../../common/stringparse.js";
import { UIResources } from "../misc/uires.js";
const elements = {
    text: ({ widget, children, variables }) => React.createElement("div", { className: "text" },
        parseVariable(widget.text, variables),
        children),
    span: ({ widget, children, variables }) => React.createElement("span", { className: widget.class ? parseVariable(widget.class, variables) : '' },
        parseVariable(widget.text, variables),
        children),
    bar: ({ widget, children, variables }) => React.createElement("div", { className: "" + (widget.class || ''), style: {
            '--active': Math.min(Math.max(parseFloat(parseVariable(widget.bar.current, variables)) / parseFloat(parseVariable(widget.bar.max, variables)) * 100, 0), 100) + '%',
            '--accent': widget.bar.color ? parseVariable(widget.bar.color, variables) : '#70c70d',
        } },
        React.createElement("div", { className: "inner" }),
        children),
    normal: ({ children, widget }) => React.createElement("div", { style: {
            ...(widget.style || {})
        }, className: widget.class || "" }, children)
};
const widgetChildren = (widget) => {
    return (widget.widgets || [])
        .concat(widget.children ? UIResources.parent(widget.children).map(i => i.ui) : []);
};
export const JSONUIWidget = ({ json, variables }) => {
    const renderWidget = (widget) => {
        const Element = elements[widget.type] || elements['normal'];
        return React.createElement(Element, { variables: variables, key: Math.random(), widget: widget }, widgetChildren(widget).map((childWidget, index) => (React.createElement(React.Fragment, { key: index }, renderWidget(childWidget)))));
    };
    return React.createElement("div", null, renderWidget(json));
};
