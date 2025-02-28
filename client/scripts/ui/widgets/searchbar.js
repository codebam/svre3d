import React from 'react';
export function SearchBar({ searchQuery, setSearchQuery, className, placeholder }) {
    return React.createElement("div", { className: "search-bar" + (className ? ' ' + className : '') },
        React.createElement("span", { className: "search-icon" }),
        React.createElement("input", { type: "text", placeholder: placeholder || "Search...", className: 'input-search-bar', value: searchQuery, onChange: (e) => setSearchQuery(e.target.value) }));
}
