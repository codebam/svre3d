import { createRoot } from "react-dom/client";
import * as React from "react";
export class Login {
    static init(S, types) {
        const roote = document.createElement('div');
        document.querySelector('body').appendChild(roote);
        const root = createRoot(roote);
        root.render(React.createElement(React.Fragment, null));
    }
}
