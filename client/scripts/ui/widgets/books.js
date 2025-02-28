import React, { useState, useEffect, useContext } from 'react';
import { ItemIcon } from './slotitem.js';
import { Items } from '../../repositories/items.js';
import { InventoryItem } from './inventory.js';
import { Context } from '../data/context.js';
import { SearchBar } from './searchbar.js';
import { ResourceMap } from '../../repositories/resources.js';
import { Separator } from './sep.js';
const fetchedBooks = [];
const filterFunction = (query) => {
    return (i) => (i.type == 'item' || i.type == 'inventory-item')
        &&
            (i.itemReference ||
                (i.itemReference = Items.all().find(i2 => i.item == i2.manifest.id)))
        ?
            (i.itemReference
                .item?.name?.toLocaleLowerCase().match(query.toLocaleLowerCase()) || i.itemReference
                .manifest?.id?.toLocaleLowerCase().match(query.toLocaleLowerCase()))
        :
            ((i?.content || i?.name || i?.title)
                ?.toLocaleLowerCase().match(query.toLocaleLowerCase()));
};
function PageContent({ children, selectBook, searchQuery = null }) {
    const navTo = (to) => to ? () => {
        selectBook(to);
    } : () => { };
    return (React.createElement(React.Fragment, null, children
        .filter(searchQuery ? filterFunction(searchQuery) : i => i)
        .map((child, index) => (child.type === 'link' ? React.createElement("a", { key: index, onClick: () => {
            if (child.page) {
                selectBook(child.page);
            }
        }, href: '#' }, child.content) : child.type === 'inventory-item' ? React.createElement(InventoryItem, { item: Items.create({
            itemID: child.item,
            quantity: child.quantity || 1,
        }), mouse: false, counter: child.quantity > 0, key: index, selectItem: navTo(child.link), unselectItem: () => { } }) : React.createElement("div", { key: index },
        child.type === 'image' && (React.createElement("img", { onClick: navTo(child.link), src: child.image, alt: child.title || 'image' })),
        child.type === 'text' && (React.createElement("p", { onClick: navTo(child.link) }, child.content)),
        child.type === 'wrapper' && (React.createElement("div", { onClick: navTo(child.link), className: child.row ? 'row' : 's' }, child.content)),
        child.type === 'item' && (React.createElement(ItemIcon, { item: Items.create({
                itemID: child.item,
                quantity: child.quantity || 1,
            }), onClick: navTo(child.link) })),
        child.children && (React.createElement(PageContent, { selectBook: selectBook, children: child.children })))))));
}
async function fetchBook(id) {
    if (id) {
        let book = fetchedBooks.find(b => b.id == id);
        if (!book) {
            let rawBook = await fetch('/books/' + id).then(r => r.json());
            book = {
                id: rawBook.manifest.id,
                icon: ResourceMap.find(rawBook.book.icon)?.resource.load,
                name: rawBook.book.name,
                pages: rawBook.pages
            };
            fetchedBooks.push(book);
        }
        return book;
    }
    return await fetch('/books').then(r => r.json());
}
function BookComponent({ books }) {
    const { currentBook, setCurrentBook, currentPage, setCurrentPage } = useContext(Context);
    const [allBooks, setAllBooks] = useState(books.filter(book => Object.keys(book).length > 1));
    const [searchQuery, setSearchQuery] = useState('');
    const handleBookSelection = (book) => {
        setCurrentBook(book);
        if (book)
            setCurrentPage(book.pages[0]); // Set the first page as the initial page
    };
    const handlePageSelection = (page) => {
        setCurrentPage(page);
    };
    useEffect(() => {
        (async () => {
            for (let bookIndex in books) {
                const book = books[bookIndex];
                if (Object.keys(book).length == 1 && book.id) {
                    books[bookIndex] = await fetchBook(book.id);
                }
            }
            setAllBooks(books);
        })();
    }, [books]);
    return (React.createElement("div", { className: "book-component" + (currentBook ? ' has-flex' : '') },
        currentBook ? null : (React.createElement("div", { className: 'main-list' },
            React.createElement(SearchBar, { className: 'absolute', placeholder: "Search for a book...", searchQuery: searchQuery, setSearchQuery: (e) => setSearchQuery(e) }),
            React.createElement("h1", null, "Books"),
            React.createElement(Separator, null),
            React.createElement("div", { className: 'books-items' }, allBooks.filter(book => book.name?.toLowerCase().includes(searchQuery.toLowerCase())).map((book) => (React.createElement("div", { className: 'book-item', key: book.name, onClick: () => handleBookSelection(book) },
                React.createElement("img", { src: book.icon.image?.src }),
                React.createElement("div", { className: "title" }, book.name))))))),
        currentBook && !currentBook.isItemsList && React.createElement(React.Fragment, null,
            React.createElement("h1", null,
                React.createElement("span", { className: 'icon c icon-back', onClick: () => { setCurrentBook(null); setCurrentPage(null); } }),
                " Books > ",
                currentBook.name),
            React.createElement(Separator, null),
            React.createElement("div", { className: "grid-book" },
                React.createElement("div", { className: "sidebar" }, currentBook && (React.createElement("div", null,
                    React.createElement("h3", null, "Pages"),
                    React.createElement("ul", null, currentBook.pages.map((page, index) => (React.createElement("li", { key: index, className: currentPage?.title == page.title ? 'active' : '', onClick: () => handlePageSelection(page) }, page.title))))))),
                React.createElement("div", { className: "main-content" }, currentPage && (React.createElement("div", null,
                    React.createElement("h2", null, currentPage.title),
                    React.createElement(PageContent, { selectBook: (itemID) => handleBookSelection(allBooks.find(i => i.id == itemID) || null), children: currentPage.children })))))),
        currentBook && currentBook.isItemsList && React.createElement(React.Fragment, null,
            React.createElement("h1", null,
                React.createElement("span", { className: 'icon c icon-back', onClick: () => { setCurrentBook(null); setCurrentPage(null); } }),
                " ",
                currentBook.name),
            React.createElement(Separator, null),
            React.createElement(SearchBar, { placeholder: "Search...", searchQuery: searchQuery, setSearchQuery: (e) => setSearchQuery(e), className: 'absolute' }),
            React.createElement("div", { className: 'items-list' },
                React.createElement(PageContent, { selectBook: (itemID) => handleBookSelection(allBooks.find(i => i.id == itemID) || null), children: currentBook.pages[0].children, searchQuery: searchQuery })))));
}
export default BookComponent;
