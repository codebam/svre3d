import { pingFrom } from "../ping/ping.js";
import * as uuid from 'uuid';
import Commands from "./commands.js";
import { Sockets } from "../ping/sockets.js";
import { Entities } from "./entities.js";
export class Chats {
    static lookUpCommands(text, data) {
        if (text.startsWith('/')) {
            const command = text.slice(1).split(' ').shift();
            if (Commands.has(command)) {
                const player = Entities.entities.find(e => e.data.username == data.username);
                Commands.execute(command, text.trim(), {
                    reply: (text) => {
                        Sockets.emit('chat:send', this.prepareMessage({
                            chatid: data.chatid,
                            message: text,
                            username: 'Server'
                        }));
                    },
                    username: data.username,
                    position: player.position,
                    self: { type: 'id', value: player.id }
                });
            }
        }
        else { }
    }
    static prepareMessage(data) {
        return {
            chatid: data.chatid || 'public',
            message: {
                text: data.message,
                id: uuid.v4()
            },
            reply: data.reply,
            time: Date.now(),
            username: data.username
        };
    }
    static startPing(socket) {
        pingFrom(socket, 'chat:send', async (data) => {
            if (!data)
                return;
            const msg = Chats.prepareMessage(data);
            socket.emit('chat:send', msg);
            socket.broadcast.emit('chat:send', msg);
            Chats.lookUpCommands(data.message, data);
        });
    }
}
