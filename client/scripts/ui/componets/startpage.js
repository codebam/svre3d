import * as React from "react";
import { BGLogin } from "../widgets/bgl";
import { BGStars } from "../widgets/bgs";
import { Cube } from "../widgets/cube";
import LoginForm from "../../login/form";
import { LocalDB } from "../../localdb/localdb";
import { S } from "../../socket/socket";
let f = 0;
export function StartPage({ start }) {
    const [currentPage, setCurentPage] = React.useState('start');
    const startGame = () => {
        start((page) => setCurentPage(page));
    };
    if (!f) {
        f = 1;
        startGame();
    }
    return currentPage == 'start' || currentPage == 'login' ? React.createElement("div", { id: "startpage" },
        (currentPage == 'start' || currentPage == 'login') && React.createElement("div", null,
            React.createElement(BGLogin, null),
            React.createElement(BGStars, null)),
        currentPage == 'start' && React.createElement(React.Fragment, null,
            React.createElement("div", { className: "start-button", onClick: startGame },
                React.createElement(Cube, { gloom: true, size: 30, color: '#09D0D0' }),
                React.createElement("span", null, "Start"))),
        currentPage == 'login' && React.createElement(React.Fragment, null,
            React.createElement(LoginForm, { types: window._biomes, onSubmit: ({ username, password, variant, email, register }, setRegister, setError) => {
                    if (register) {
                        S.emit('register', { username, password, variant, email }, (success) => {
                            if (success)
                                location.reload();
                            else
                                setError('Something went wrong');
                        });
                    }
                    else
                        S.emit('login', { username, password }, (token) => {
                            if (token) {
                                if (token == 'wrong') {
                                    setError('Password or username wrong');
                                }
                                else {
                                    LocalDB.cookie.set('token', token);
                                    location.reload();
                                }
                            }
                            else {
                                setRegister(true);
                            }
                        });
                } }))) : React.createElement(React.Fragment, null);
}
