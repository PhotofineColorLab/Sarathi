import { Order, Product, Staff, User, ProductCategory, OrderStatus } from './types';

// Mock admin users for authentication
export const mockUsers: User[] = [
  {
    id: 'admin1',
    email: 'admin@electro.com',
    password: 'admin123',
    role: 'admin',
    name: 'Admin User'
  },
  {
    id: 'admin2',
    email: 'shubhamheda@sarathi.com',
    password: 'admin123',
    role: 'admin',
    name: 'Shubham Heda'
  },
  {
    id: 'staff1',
    email: 'jane@electro.com',
    password: 'staff123',
    role: 'staff',
    name: 'Jane Smith'
  },
    
];

// Mock products data
export const mockProducts: Product[] = [
  {
    id: 'prod1',
    name: 'LED Ceiling Light',
    description: 'Energy-efficient LED ceiling light with adjustable brightness',
    price: 49.99,
    category: 'Lights',
    imageUrl: 'https://img-getpocket.cdn.mozilla.net/404x202/filters:format(jpeg):quality(60):no_upscale():strip_exif()/https%3A%2F%2Fs3.us-east-1.amazonaws.com%2Fpocket-curatedcorpusapi-prod-images%2F9e4bf122-a05b-4b1d-a869-8ad32f0cf0a7.jpeg',
    stock: 25,
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod2',
    name: 'Wall Fan',
    description: 'Oscillating wall fan with 3 speed settings',
    price: 39.99,
    category: 'Fans',
    imageUrl: 'https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcRm8zEFA7zh86V5o6bWZlO1kelpzwiHlsASF1O53cXtk8OA0fTHK-V5iP3rvCbqH_rRJDscvgfAqIMzX8mvkkVaN8vTb4i6_XXJ9XIIu1oPI3bqbl0zEuk0b29ivSGS3eBV44SRQFo&usqp=CAc',
    stock: 15,
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod3',
    name: 'Copper Wire (10m)',
    description: 'High-quality copper wire for electrical installations',
    price: 12.99,
    category: 'Wires',
    imageUrl: 'https://m.media-amazon.com/images/I/51sME-HE8eL._AC_UF1000,1000_QL80_.jpg',
    stock: 50,
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod4',
    name: 'Smart Switch',
    description: 'WiFi-enabled smart switch compatible with voice assistants',
    price: 29.99,
    category: 'Switches',
    imageUrl: 'https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcTTl9pRvlMC_rnQ7_kNDVBj3xIO6_6SZt9Ac0f2vaeNaGJIVff-oERViF74W5aoKwLAVWbAuBaQUjHc6D21FIfG2GUvupkkmoq4GFrEYC-sm4N_kJVYKhIf',
    stock: 20,
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod5',
    name: 'USB Wall Socket',
    description: 'Wall socket with built-in USB charging ports',
    price: 19.99,
    category: 'Sockets',
    imageUrl: 'https://rukminim2.flixcart.com/image/1200/1200/l4n2oi80/electrical-socket/b/v/k/1-modular-usb-socket-usb-rapid-charging-single-socket-charger-original-imagfhwnqejvgemw.jpeg',
    stock: 30,
    createdAt: new Date().toISOString()
  }
];

// Mock staff data
export const mockStaff: Staff[] = [
  {
    id: 'staff1',
    name: 'Jane Smith',
    email: 'jane@electro.com',
    phone: '555-1234',
    password: 'staff123',
    createdAt: new Date()
  },
  {
    id: 'staff2',
    name: 'John Doe',
    email: 'john@electro.com',
    phone: '555-5678',
    password: 'staff123',
    createdAt: new Date()
  }
];

// Mock orders data
export const mockOrders: Order[] = [
  {
    id: 'ord1',
    customerName: 'Alice Johnson',
    customerEmail: 'alice@example.com',
    customerPhone: '555-9876',
    items: [
      {
        id: 'item1',
        productId: 'prod1',
        name: 'LED Ceiling Light',
        quantity: 2,
        price: 49.99
      },
      {
        id: 'item2',
        productId: 'prod3',
        name: 'Copper Wire (10m)',
        quantity: 1,
        price: 12.99
      }
    ],
    total: 112.97,
    status: 'completed',
    createdAt: new Date(),
    activities: [
      {
        staffId: 'staff1',
        staffName: 'Jane Smith',
        action: 'viewed',
        timestamp: new Date()
      }
    ],
    date: new Date().toISOString().split('T')[0],
    imageUrl: '/images/orders/order1.jpg'
  },
  {
    id: 'ord2',
    customerName: 'Bob Williams',
    customerEmail: 'bob@example.com',
    customerPhone: '555-4321',
    items: [
      {
        id: 'item3',
        productId: 'prod2',
        name: 'Wall Fan',
        quantity: 1,
        price: 39.99
      }
    ],
    total: 39.99,
    status: 'pending',
    createdAt: new Date(),
    activities: [],
    date: new Date().toISOString().split('T')[0],
    imageUrl: '/images/orders/order2.jpg'
  },
  {
    id: 'ord3',
    customerName: 'Carol Davis',
    customerEmail: 'carol@example.com',
    customerPhone: '555-8765',
    items: [
      {
        id: 'item4',
        productId: 'prod4',
        name: 'Smart Switch',
        quantity: 3,
        price: 29.99
      },
      {
        id: 'item5',
        productId: 'prod5',
        name: 'USB Wall Socket',
        quantity: 2,
        price: 19.99
      }
    ],
    total: 129.95,
    status: 'processing',
    createdAt: new Date(),
    activities: [],
    date: new Date().toISOString().split('T')[0],
    imageUrl: '/images/orders/order3.jpg'
  },
  {
    "id": "ORD004",
    "customerName": "Emily Brown",
    "customerEmail": "emily@example.com",
    "customerPhone": "555-1111",
    "items": [
      { "id": "7", "productId": "prod1", "name": "Smartphone Charger", "quantity": 3, "price": 12.99 },
      { "id": "8", "productId": "prod2", "name": "USB Cables", "quantity": 2, "price": 5.49 }
    ],
    "total": 46.95,
    "status": "pending",
    "createdAt": new Date(),
    "activities": [],
    "date": "2024-03-15",
    "imageUrl": "https://www.pexels.com/photo/black-iphone-charger-cable-gear-584122/"
  },
  {
    "id": "ORD005",
    "customerName": "Lily Green",
    "customerEmail": "lily@example.com",
    "customerPhone": "555-2222",
    "items": [
      { "id": "9", "productId": "prod3", "name": "Desk Lamp", "quantity": 1, "price": 29.99 },
      { "id": "10", "productId": "prod4", "name": "Wireless Keyboard", "quantity": 1, "price": 49.99 }
    ],
    "total": 79.98,
    "status": "completed",
    "createdAt": new Date(),
    "activities": [],
    "date": "2024-03-14",
    "imageUrl": "https://www.pexels.com/photo/gray-robot-pen-holder-gear-1408727/"
  },
  {
    "id": "ORD006",
    "customerName": "Oliver Gray",
    "customerEmail": "oliver@example.com",
    "customerPhone": "555-3333",
    "items": [
      { "id": "11", "productId": "prod5", "name": "Bluetooth Speaker", "quantity": 1, "price": 22.99 },
      { "id": "12", "productId": "prod1", "name": "Headphones", "quantity": 2, "price": 15.49 }
    ],
    "total": 53.97,
    "status": "completed",
    "createdAt": new Date(),
    "activities": [],
    "date": "2024-03-13",
    "imageUrl": "https://www.pexels.com/photo/black-headphones-on-wooden-surface-1284432/"
  },
  {
    "id": "ORD007",
    "customerName": "Sophia White",
    "customerEmail": "sophia@example.com",
    "customerPhone": "555-4444",
    "items": [
      { "id": "13", "productId": "prod2", "name": "Power Bank", "quantity": 2, "price": 19.99 },
      { "id": "14", "productId": "prod3", "name": "Phone Stand", "quantity": 1, "price": 7.49 }
    ],
    "total": 47.47,
    "status": "processing",
    "createdAt": new Date(),
    "activities": [],
    "date": "2024-03-12",
    "imageUrl": "https://www.pexels.com/photo/black-rectangle-power-bank-3077475/"
  },
  {
    "id": "ORD008",
    "customerName": "James Black",
    "customerEmail": "james@example.com",
    "customerPhone": "555-5555",
    "items": [
      { "id": "15", "productId": "prod4", "name": "Smartwatch", "quantity": 1, "price": 119.99 },
      { "id": "16", "productId": "prod5", "name": "Wireless Mouse", "quantity": 1, "price": 20.99 }
    ],
    "total": 140.98,
    "status": "pending",
    "createdAt": new Date(),
    "activities": [],
    "date": "2024-03-11",
    "imageUrl": "https://www.pexels.com/photo/black-smartwatch-on-white-surface-1302996/"
  },
  {
    "id": "ORD009",
    "customerName": "Henry Blue",
    "customerEmail": "henry@example.com",
    "customerPhone": "555-6666",
    "items": [
      { "id": "17", "productId": "prod1", "name": "LED Light Strip", "quantity": 3, "price": 8.99 },
      { "id": "18", "productId": "prod2", "name": "Power Adapter", "quantity": 2, "price": 5.99 }
    ],
    "total": 45.94,
    "status": "completed",
    "createdAt": new Date(),
    "activities": [],
    "date": "2024-03-10",
    "imageUrl": "https://www.pexels.com/photo/silver-connector-and-electronic-circuit-board-7582829/"
  },
  {
    "id": "ORD010",
    "customerName": "Isla Red",
    "customerEmail": "isla@example.com",
    "customerPhone": "555-7777",
    "items": [
      { "id": "19", "productId": "prod3", "name": "Electric Fan", "quantity": 1, "price": 35.99 },
      { "id": "20", "productId": "prod4", "name": "LED Bulb 5W", "quantity": 4, "price": 3.99 }
    ],
    "total": 51.95,
    "status": "pending",
    "createdAt": new Date(),
    "activities": [],
    "date": "2024-03-09",
    "imageUrl": "https://www.pexels.com/photo/close-up-of-electric-fan-3932324/"
  },
  {
    "id": "ORD011",
    "customerName": "Anna White",
    "customerEmail": "anna@example.com",
    "customerPhone": "555-8888",
    "items": [
      { "id": "21", "productId": "prod5", "name": "Surge Protector", "quantity": 2, "price": 15.49 },
      { "id": "22", "productId": "prod1", "name": "Extension Cord 5m", "quantity": 1, "price": 10.99 }
    ],
    "total": 41.97,
    "status": "processing",
    "createdAt": new Date(),
    "activities": [],
    "date": "2024-03-08",
    "imageUrl": "https://www.pexels.com/photo/black-connector-and-circuit-board-847008/"
  },
  {
    "id": "ORD012",
    "customerName": "Gabriel Brown",
    "customerEmail": "gabriel@example.com",
    "customerPhone": "555-9999",
    "items": [
      { "id": "23", "productId": "prod2", "name": "Air Conditioner", "quantity": 1, "price": 150.99 },
      { "id": "24", "productId": "prod3", "name": "Heater Fan", "quantity": 1, "price": 79.99 }
    ],
    "total": 230.98,
    "status": "completed",
    "createdAt": new Date(),
    "activities": [],
    "date": "2024-03-07",
    "imageUrl": "https://www.pexels.com/photo/silver-air-conditioner-1608537/"
  },
  {
    "id": "ORD013",
    "customerName": "Daniel Rose",
    "customerEmail": "daniel@example.com",
    "customerPhone": "555-0000",
    "items": [
      { "id": "25", "productId": "prod4", "name": "Vacuum Cleaner", "quantity": 1, "price": 99.99 },
      { "id": "26", "productId": "prod5", "name": "Air Freshener", "quantity": 2, "price": 5.49 }
    ],
    "total": 110.97,
    "status": "pending",
    "createdAt": new Date(),
    "activities": [],
    "date": "2024-03-06",
    "imageUrl": "https://www.pexels.com/photo/gray-vacuum-cleaner-3467740/"
  },
  {
    "id": "ORD014",
    "customerName": "Mia Gold",
    "customerEmail": "mia@example.com",
    "customerPhone": "555-1212",
    "items": [
      { "id": "27", "productId": "prod1", "name": "Coffee Machine", "quantity": 1, "price": 75.99 },
      { "id": "28", "productId": "prod2", "name": "Mug Warmer", "quantity": 1, "price": 20.49 }
    ],
    "total": 96.48,
    "status": "completed",
    "createdAt": new Date(),
    "activities": [],
    "date": "2024-03-05",
    "imageUrl": "https://www.pexels.com/photo/black-and-silver-coffee-machine-2182638/"
  },
  {
    "id": "ORD015",
    "customerName": "Ethan Spark",
    "customerEmail": "ethan@example.com",
    "customerPhone": "555-2323",
    "items": [
      { "id": "29", "productId": "prod3", "name": "Refrigerator", "quantity": 1, "price": 350.99 },
      { "id": "30", "productId": "prod4", "name": "Freezer", "quantity": 1, "price": 199.99 }
    ],
    "total": 550.98,
    "status": "pending",
    "createdAt": new Date(),
    "activities": [],
    "date": "2024-03-04",
    "imageUrl": "https://www.pexels.com/photo/white-fridge-3196052/"
  },
  {
    "id": "ORD016",
    "customerName": "Lucy Jane",
    "customerEmail": "lucy@example.com",
    "customerPhone": "555-3434",
    "items": [
      { "id": "31", "productId": "prod5", "name": "Toaster", "quantity": 2, "price": 23.49 },
      { "id": "32", "productId": "prod1", "name": "Coffee Grinder", "quantity": 1, "price": 39.99 }
    ],
    "total": 86.97,
    "status": "completed",
    "createdAt": new Date(),
    "activities": [],
    "date": "2024-03-03",
    "imageUrl": "https://www.pexels.com/photo/white-electric-toaster-1276864/"
  },
  {
    "id": "ORD017",
    "customerName": "Jack Moore",
    "customerEmail": "jack@example.com",
    "customerPhone": "555-4545",
    "items": [
      { "id": "33", "productId": "prod2", "name": "Juicer", "quantity": 1, "price": 89.99 },
      { "id": "34", "productId": "prod3", "name": "Blender", "quantity": 1, "price": 59.99 }
    ],
    "total": 149.98,
    "status": "pending",
    "createdAt": new Date(),
    "activities": [],
    "date": "2024-03-02",
    "imageUrl": "https://www.pexels.com/photo/black-and-silver-blender-and-juicer-2054067/"
  },
  {
    "id": "ORD018",
    "customerName": "Grace Miller",
    "customerEmail": "grace@example.com",
    "customerPhone": "555-5656",
    "items": [
      { "id": "35", "productId": "prod4", "name": "Washing Machine", "quantity": 1, "price": 400.99 },
      { "id": "36", "productId": "prod5", "name": "Dryer", "quantity": 1, "price": 249.99 }
    ],
    "total": 650.98,
    "status": "completed",
    "createdAt": new Date(),
    "activities": [],
    "date": "2024-03-01",
    "imageUrl": "https://www.pexels.com/photo/close-up-photo-of-washing-machine-4227556/"
  },
  {
    "id": "ORD019",
    "customerName": "Samuel Stone",
    "customerEmail": "samuel@example.com",
    "customerPhone": "555-6767",
    "items": [
      { "id": "37", "productId": "prod1", "name": "Iron", "quantity": 2, "price": 27.99 },
      { "id": "38", "productId": "prod2", "name": "Clothes Steamer", "quantity": 1, "price": 45.99 }
    ],
    "total": 101.97,
    "status": "pending",
    "createdAt": new Date(),
    "activities": [],
    "date": "2024-02-28",
    "imageUrl": "https://www.pexels.com/photo/black-and-silver-steam-iron-2346985/"
  },
  {
    "id": "ORD020",
    "customerName": "Charlotte Pierce",
    "customerEmail": "charlotte@example.com",
    "customerPhone": "555-7878",
    "items": [
      { "id": "39", "productId": "prod3", "name": "Hair Dryer", "quantity": 1, "price": 59.99 },
      { "id": "40", "productId": "prod4", "name": "Electric Shaver", "quantity": 1, "price": 39.99 }
    ],
    "total": 99.98,
    "status": "completed",
    "createdAt": new Date(),
    "activities": [],
    "date": "2024-02-27",
    "imageUrl": "https://www.pexels.com/photo/silver-hair-dryer-3143766/"
  }
];