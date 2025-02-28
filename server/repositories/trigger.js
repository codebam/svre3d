export const EventTrigger = () => { var _a; return _a = class {
        static on(event, fn) {
            this._events.push({ event, fn });
            return this;
        }
        static off(event, fn) {
            const ev = this._events.find(i => i.event == event && i.fn == fn);
            if (ev)
                this._events.splice(this._events.indexOf(ev), 1);
            return this;
        }
        static emit(event, data) {
            this._events.filter(i => i.event == event)
                .forEach(e => e.fn(data));
            return this;
        }
    },
    _a._events = [],
    _a; };
