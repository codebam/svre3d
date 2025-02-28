export class Settings {
    static on(type, f) {
        this._eventListeners.push({ type, f });
        return this;
    }
    static emit(type, ...args) {
        this._eventListeners
            .filter(e => e.type == type)
            .forEach(e => e.f(...args));
        return this;
    }
    static new(key, setting) {
        const group = key.split('.')[0];
        const name = key.split('.')[1];
        this.settings[group] = this.settings[group] || {};
        this.settings[group][name] = setting;
        this.emit('new', { [key]: setting.value });
        return this;
    }
    static type(key) {
        let val = this.get(key);
        if (typeof val == "number") {
            return val.toString().includes('.') ? 'float' : 'int';
        }
        else {
            return typeof val == 'boolean' ? 'bool' : typeof val;
        }
    }
    static get(key, defaultValue) {
        return (Settings.getFull(key).value ?? defaultValue);
    }
    static getFull(key) {
        const group = key.split('.')[0];
        const name = key.split('.')[1];
        return Settings.settings[group][name] || {};
    }
    static set(key, value, notify = true) {
        const group = key.split('.')[0];
        const name = key.split('.')[1];
        if (!Settings.settings[group][name])
            Settings.settings[group][name] = { value };
        else
            Settings.settings[group][name].value = value;
        // console.log('set', key, value);
        if (notify) {
            this.emit('change', { [key]: value });
            this.emit('change:' + key, value);
        }
        return this;
    }
    static setMap(map) {
        for (let i in map) {
            this.set(i, map[i]);
        }
        return this;
    }
}
Settings.settings = {
    graphics: {
        _title: { value: 'Graphics' },
        enablePixels: {
            value: false
        },
        pixelLevel: {
            title: 'Pixel Size',
            value: 2,
            min: 2,
            max: 10
        },
        enableBloom: {
            value: true
        },
        ssao: {
            value: false
        },
        fog: {
            value: false
        }
    },
    performance: {
        _title: { value: 'Performance' },
        renderDistance: {
            value: 6,
            min: 2,
            max: 64
        },
        detailsLimit: {
            value: 100,
            min: 10,
            max: 100
        }
    },
    controls: {
        _title: { value: 'Controls' },
        sensitivity: {
            value: 3,
            min: 2,
            max: 50
        },
    }
};
Settings._eventListeners = [];
