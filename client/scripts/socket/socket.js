import { LocalDB } from "../localdb/localdb.js";
const io = window.io;
export let S;
export function ping(action, data) {
    return new Promise((r) => {
        S.emit(action, data, (response) => {
            r(response);
        });
    });
}
export function pingFrom(action, func) {
    if (S)
        S.on(action, async (data) => {
            await func(data);
        });
}
export async function connectSocket(callback, login) {
    const token = LocalDB.cookie.get('token');
    let reconnect = false;
    const socket = io('/', {
        auth: { token },
        query: { reconnect }
    });
    S = socket;
    socket.on('reconnect', () => {
        reconnect = true;
    });
    socket.on('recognize', (whatever) => {
        callback(whatever);
    });
    socket.on('unrecognized', ({ biomes }) => {
        window._biomes = biomes;
        login();
    });
    socket.on('disconnect', () => {
        reconnect = true;
    });
}
