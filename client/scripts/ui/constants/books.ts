import { Items } from "../../repositories/items";

export const DefaultBooks = () => [
  {
    name: 'Items',
    icon: 'book-2',
    id: 'm',
    defaultBook: true,
    isItemsList: true,
    pages: [
      {
        "title": "All Items",
        "children": Items.all().map(item => (
          {
            type: "inventory-item",
            item: item.id,
            quantity: 0,
            link: item.config?.book ? item.id : null
          }
        ))
      }
    ]
  }
];