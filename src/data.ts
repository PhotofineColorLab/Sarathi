import { Order } from './types';

export const mockOrders: Order[] = [
  {
    id: 'ORD001',
    customerName: 'John Smith',
    items: [
      { id: '1', name: 'LED Bulb 10W', quantity: 5, price: 9.99 },
      { id: '2', name: 'Extension Cord', quantity: 2, price: 15.99 }
    ],
    total: 81.93,
    status: 'pending',
    date: '2024-03-15',
    imageUrl: 'https://images.unsplash.com/photo-1575936123452-b67c3203c357?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aW1hZ2V8ZW58MHx8MHx8fDA%3D',
    createdBy: 'admin'
  },
  {
    id: 'ORD002',
    customerName: 'Sarah Johnson',
    items: [
      { id: '3', name: 'Circuit Breaker', quantity: 1, price: 45.99 },
      { id: '4', name: 'Wire Cable 50m', quantity: 1, price: 29.99 }
    ],
    total: 75.98,
    status: 'completed',
    date: '2024-03-14',
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ718nztPNJfCbDJjZG8fOkejBnBAeQw5eAUA&s',
    createdBy: 'admin'
  },
  {
    id: 'ORD003',
    customerName: 'Mike Wilson',
    items: [
      { id: '5', name: 'Power Socket', quantity: 3, price: 12.99 },
      { id: '6', name: 'Light Switch', quantity: 4, price: 8.99 }
    ],
    total: 74.93,
    status: 'processing',
    date: '2024-03-13',
    imageUrl: 'https://media.istockphoto.com/id/814423752/photo/eye-of-model-with-colorful-art-make-up-close-up.jpg?s=612x612&w=0&k=20&c=l15OdMWjgCKycMMShP8UK94ELVlEGvt7GmB_esHWPYE=',
    createdBy: 'admin'
  },
  {
    "id": "ORD004",
    "customerName": "Emily Brown",
    "items": [
      { "id": "7", "name": "Smartphone Charger", "quantity": 3, "price": 12.99 },
      { "id": "8", "name": "USB Cables", "quantity": 2, "price": 5.49 }
    ],
    "total": 46.95,
    "status": "pending",
    "date": "2024-03-15",
    "imageUrl": "https://www.pexels.com/photo/black-iphone-charger-cable-gear-584122/",
    "createdBy": "admin"
  },
  {
    "id": "ORD005",
    "customerName": "Lily Green",
    "items": [
      { "id": "9", "name": "Desk Lamp", "quantity": 1, "price": 29.99 },
      { "id": "10", "name": "Wireless Keyboard", "quantity": 1, "price": 49.99 }
    ],
    "total": 79.98,
    "status": "completed",
    "date": "2024-03-14",
    "imageUrl": "https://www.pexels.com/photo/gray-robot-pen-holder-gear-1408727/",
    "createdBy": "admin"
  },
  {
    "id": "ORD006",
    "customerName": "Oliver Gray",
    "items": [
      { "id": "11", "name": "Bluetooth Speaker", "quantity": 1, "price": 22.99 },
      { "id": "12", "name": "Headphones", "quantity": 2, "price": 15.49 }
    ],
    "total": 53.97,
    "status": "completed",
    "date": "2024-03-13",
    "imageUrl": "https://www.pexels.com/photo/black-headphones-on-wooden-surface-1284432/",
    "createdBy": "admin"
  },
  {
    "id": "ORD007",
    "customerName": "Sophia White",
    "items": [
      { "id": "13", "name": "Power Bank", "quantity": 2, "price": 19.99 },
      { "id": "14", "name": "Phone Stand", "quantity": 1, "price": 7.49 }
    ],
    "total": 47.47,
    "status": "processing",
    "date": "2024-03-12",
    "imageUrl": "https://www.pexels.com/photo/black-rectangle-power-bank-3077475/",
    "createdBy": "admin"
  },
  {
    "id": "ORD008",
    "customerName": "James Black",
    "items": [
      { "id": "15", "name": "Smartwatch", "quantity": 1, "price": 119.99 },
      { "id": "16", "name": "Wireless Mouse", "quantity": 1, "price": 20.99 }
    ],
    "total": 140.98,
    "status": "pending",
    "date": "2024-03-11",
    "imageUrl": "https://www.pexels.com/photo/black-smartwatch-on-white-surface-1302996/",
    "createdBy": "admin"
  },
  {
    "id": "ORD009",
    "customerName": "Henry Blue",
    "items": [
      { "id": "17", "name": "LED Light Strip", "quantity": 3, "price": 8.99 },
      { "id": "18", "name": "Power Adapter", "quantity": 2, "price": 5.99 }
    ],
    "total": 45.94,
    "status": "completed",
    "date": "2024-03-10",
    "imageUrl": "https://www.pexels.com/photo/silver-connector-and-electronic-circuit-board-7582829/",
    "createdBy": "admin"
  },
  {
    "id": "ORD010",
    "customerName": "Isla Red",
    "items": [
      { "id": "19", "name": "Electric Fan", "quantity": 1, "price": 35.99 },
      { "id": "20", "name": "LED Bulb 5W", "quantity": 4, "price": 3.99 }
    ],
    "total": 51.95,
    "status": "pending",
    "date": "2024-03-09",
    "imageUrl": "https://www.pexels.com/photo/close-up-of-electric-fan-3932324/",
    "createdBy": "admin"
  },
  {
    "id": "ORD011",
    "customerName": "Anna White",
    "items": [
      { "id": "21", "name": "Surge Protector", "quantity": 2, "price": 15.49 },
      { "id": "22", "name": "Extension Cord 5m", "quantity": 1, "price": 10.99 }
    ],
    "total": 41.97,
    "status": "processing",
    "date": "2024-03-08",
    "imageUrl": "https://www.pexels.com/photo/black-connector-and-circuit-board-847008/",
    "createdBy": "admin"
  },
  {
    "id": "ORD012",
    "customerName": "Gabriel Brown",
    "items": [
      { "id": "23", "name": "Air Conditioner", "quantity": 1, "price": 150.99 },
      { "id": "24", "name": "Heater Fan", "quantity": 1, "price": 79.99 }
    ],
    "total": 230.98,
    "status": "completed",
    "date": "2024-03-07",
    "imageUrl": "https://www.pexels.com/photo/silver-air-conditioner-1608537/",
    "createdBy": "admin"
  },
  {
    "id": "ORD013",
    "customerName": "Daniel Rose",
    "items": [
      { "id": "25", "name": "Vacuum Cleaner", "quantity": 1, "price": 99.99 },
      { "id": "26", "name": "Air Freshener", "quantity": 2, "price": 5.49 }
    ],
    "total": 110.97,
    "status": "pending",
    "date": "2024-03-06",
    "imageUrl": "https://www.pexels.com/photo/gray-vacuum-cleaner-3467740/",
    "createdBy": "admin"
  },
  {
    "id": "ORD014",
    "customerName": "Mia Gold",
    "items": [
      { "id": "27", "name": "Coffee Machine", "quantity": 1, "price": 75.99 },
      { "id": "28", "name": "Mug Warmer", "quantity": 1, "price": 20.49 }
    ],
    "total": 96.48,
    "status": "completed",
    "date": "2024-03-05",
    "imageUrl": "https://www.pexels.com/photo/black-and-silver-coffee-machine-2182638/",
    "createdBy": "admin"
  },
  {
    "id": "ORD015",
    "customerName": "Ethan Spark",
    "items": [
      { "id": "29", "name": "Refrigerator", "quantity": 1, "price": 350.99 },
      { "id": "30", "name": "Freezer", "quantity": 1, "price": 199.99 }
    ],
    "total": 550.98,
    "status": "pending",
    "date": "2024-03-04",
    "imageUrl": "https://www.pexels.com/photo/white-fridge-3196052/",
    "createdBy": "admin"
  },
  {
    "id": "ORD016",
    "customerName": "Lucy Jane",
    "items": [
      { "id": "31", "name": "Toaster", "quantity": 2, "price": 23.49 },
      { "id": "32", "name": "Coffee Grinder", "quantity": 1, "price": 39.99 }
    ],
    "total": 86.97,
    "status": "completed",
    "date": "2024-03-03",
    "imageUrl": "https://www.pexels.com/photo/white-electric-toaster-1276864/",
    "createdBy": "admin"
  },
  {
    "id": "ORD017",
    "customerName": "Jack Moore",
    "items": [
      { "id": "33", "name": "Juicer", "quantity": 1, "price": 89.99 },
      { "id": "34", "name": "Blender", "quantity": 1, "price": 59.99 }
    ],
    "total": 149.98,
    "status": "pending",
    "date": "2024-03-02",
    "imageUrl": "https://www.pexels.com/photo/black-and-silver-blender-and-juicer-2054067/",
    "createdBy": "admin"
  },
  {
    "id": "ORD018",
    "customerName": "Grace Miller",
    "items": [
      { "id": "35", "name": "Washing Machine", "quantity": 1, "price": 400.99 },
      { "id": "36", "name": "Dryer", "quantity": 1, "price": 249.99 }
    ],
    "total": 650.98,
    "status": "completed",
    "date": "2024-03-01",
    "imageUrl": "https://www.pexels.com/photo/close-up-photo-of-washing-machine-4227556/",
    "createdBy": "admin"
  },
  {
    "id": "ORD019",
    "customerName": "Samuel Stone",
    "items": [
      { "id": "37", "name": "Iron", "quantity": 2, "price": 27.99 },
      { "id": "38", "name": "Clothes Steamer", "quantity": 1, "price": 45.99 }
    ],
    "total": 101.97,
    "status": "pending",
    "date": "2024-02-28",
    "imageUrl": "https://www.pexels.com/photo/black-and-silver-steam-iron-2346985/",
    "createdBy": "admin"
  },
  {
    "id": "ORD020",
    "customerName": "Charlotte Pierce",
    "items": [
      { "id": "39", "name": "Hair Dryer", "quantity": 1, "price": 59.99 },
      { "id": "40", "name": "Electric Shaver", "quantity": 1, "price": 39.99 }
    ],
    "total": 99.98,
    "status": "completed",
    "date": "2024-02-27",
    "imageUrl": "https://www.pexels.com/photo/silver-hair-dryer-3143766/",
    "createdBy": "admin"
  }
];