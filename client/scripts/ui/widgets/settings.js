import React, { useState } from "react";
import { Settings } from "../../settings/settings.js";
import { Separator } from "./sep.js";
export const SettingsUI = () => {
    // Initialize inputValues state
    const [currentTab, setCurrentTab] = useState('graphics');
    const [inputValues, setInputValues] = useState({});
    // Function to handle input change and update settings
    const handleInputChange = (key, value) => {
        if (value == null)
            return;
        let parsedValue;
        switch (Settings.type(key)) {
            case 'int':
                parsedValue = parseInt(value);
                break;
            case 'float':
                parsedValue = parseFloat(value);
                break;
            case 'bool':
                parsedValue = typeof value === 'boolean' ? value : value === 'true';
                break;
            default:
                parsedValue = value.toString();
        }
        // Update inputValues state
        setInputValues((prevInputValues) => ({
            ...prevInputValues,
            [key]: parsedValue,
        }));
        // Update settings
        Settings.set(key, parsedValue);
    };
    if (Object.keys(inputValues).length === 0) {
        const newInputValues = {};
        // Populate newInputValues with initial settings values
        Object.keys(Settings.settings).forEach((skey) => {
            Object.keys(Settings.settings[skey]).forEach(key => {
                newInputValues[skey + '.' + key] = Settings.get(skey + '.' + key);
            });
        });
        setInputValues(newInputValues);
    }
    return (React.createElement("div", null,
        React.createElement("h1", null, "Settings"),
        React.createElement(Separator, null),
        React.createElement("div", { className: "settings-container" },
            React.createElement("div", { className: "sidebar" }, Object.keys(Settings.settings).map((key) => (React.createElement("div", { onClick: () => setCurrentTab(key), className: "settings-tab " + (currentTab == key ? 'active' : ''), key: key },
                React.createElement("span", { className: "settings-icon" }),
                React.createElement("span", { className: "settings-title" }, (Settings.settings[key])._title.value.toString()))))),
            Object.keys(Settings.settings).map((skey) => {
                const setting = Settings.settings[skey];
                return React.createElement("div", { className: "settings-content " + (currentTab == skey ? 'active' : ''), key: skey },
                    React.createElement("div", { className: "setting-title" }, setting._title.value.toString()),
                    React.createElement("div", { className: "setting-group" }, Object.keys(setting).map((key) => key == '_title' ? null : (React.createElement("div", { key: key, className: "setting-item" },
                        React.createElement("label", null, Settings.getFull(skey + '.' + key).title || key),
                        React.createElement("div", { className: "input-wrapper" }, Settings.type(skey + '.' + key) === 'string' ? (React.createElement("input", { type: "text", value: inputValues[skey + '.' + key], onChange: (e) => handleInputChange(skey + '.' + key, e.target.value) })) : Settings.type(skey + '.' + key) === 'bool' ? (React.createElement("div", { className: "switch" },
                            React.createElement("input", { type: "checkbox", id: skey + '-' + key, checked: inputValues[skey + '.' + key], onChange: (e) => handleInputChange(skey + '.' + key, e.target.checked == true) }),
                            React.createElement("label", { htmlFor: skey + '-' + key }))) : Settings.type(skey + '.' + key) === 'int' || Settings.type(skey + '.' + key) === 'float' ?
                            Settings.getFull(skey + '.' + key).min && Settings.getFull(skey + '.' + key).max ? (React.createElement("div", null,
                                inputValues[skey + '.' + key],
                                React.createElement("input", { type: "range", min: Settings.getFull(skey + '.' + key).min, max: Settings.getFull(skey + '.' + key).max, step: Settings.type(skey + '.' + key) === 'int' ? '1' : '0.1', value: inputValues[skey + '.' + key], onChange: (e) => handleInputChange(skey + '.' + key, e.target.value) }))) : (React.createElement("input", { type: "number", step: Settings.type(skey + '.' + key) === 'int' ? '1' : '0.1', value: inputValues[skey + '.' + key], onChange: (e) => handleInputChange(skey + '.' + key, e.target.value) })) : (React.createElement("div", null))))))));
            }))));
};
