import { create } from 'zustand';
import { Product } from '../types';
import { useNotificationStore } from './notificationStore';

// Sample product data
const mockProducts: Product[] = [
  {
    "id": "PROD001",
    "name": "Ceiling Fan",
    "description": "High-quality ceiling fan with 3-speed settings",
    "price": 89.99,
    "category": "Fans",
    "imageUrl": "https://images.unsplash.com/photo-1591543620767-582b2e76369e?q=80&w=400",
    "stock": 15,
    "createdAt": "2024-03-15T10:00:00Z"
  },
  {
    "id": "PROD002",
    "name": "LED Bulb Pack",
    "description": "Energy-efficient LED bulbs, pack of 4",
    "price": 19.99,
    "category": "Lights",
    "imageUrl": "https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?q=80&w=400",
    "stock": 50,
    "createdAt": "2024-03-15T10:05:00Z"
  },
  {
    "id": "PROD003",
    "name": "Copper Wire Roll",
    "description": "100m roll of high-quality copper wire",
    "price": 45.99,
    "category": "Wires",
    "imageUrl": "https://images.unsplash.com/photo-1601814933824-fd0b574dd592?q=80&w=400",
    "stock": 20,
    "createdAt": "2024-03-15T10:10:00Z"
  },
  {
    "id": "PROD004",
    "name": "LED Desk Lamp",
    "description": "Adjustable LED desk lamp with touch control",
    "price": 35.49,
    "category": "Lights",
    "imageUrl": "https://plus.unsplash.com/premium_photo-1685287731216-a7a0fae7a41a?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "stock": 30,
    "createdAt": "2024-03-15T10:15:00Z"
  },
  {
    "id": "PROD005",
    "name": "Smart Switch",
    "description": "Wi-Fi enabled smart light switch",
    "price": 29.99,
    "category": "Switches",
    "imageUrl": "https://plus.unsplash.com/premium_photo-1685287731216-a7a0fae7a41a?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "stock": 25,
    "createdAt": "2024-03-15T10:20:00Z"
  },
  {
    "id": "PROD006",
    "name": "Power Extension Cord",
    "description": "5-meter heavy-duty extension cord",
    "price": 12.49,
    "category": "Wires",
    "imageUrl": "https://plus.unsplash.com/premium_photo-1685287731216-a7a0fae7a41a?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "stock": 45,
    "createdAt": "2024-03-15T10:25:00Z"
  },
  {
    "id": "PROD007",
    "name": "Surge Protector",
    "description": "6-outlet surge protector with USB ports",
    "price": 22.99,
    "category": "Sockets",
    "imageUrl": "https://plus.unsplash.com/premium_photo-1685287731216-a7a0fae7a41a?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "stock": 40,
    "createdAt": "2024-03-15T10:30:00Z"
  },
  {
    "id": "PROD008",
    "name": "Portable Fan",
    "description": "Compact and portable rechargeable fan",
    "price": 18.99,
    "category": "Fans",
    "imageUrl": "https://plus.unsplash.com/premium_photo-1685287731216-a7a0fae7a41a?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "stock": 60,
    "createdAt": "2024-03-15T10:35:00Z"
  },
  {
    "id": "PROD009",
    "name": "Smart Light Bulb",
    "description": "RGB smart light bulb, compatible with Alexa and Google Home",
    "price": 23.99,
    "category": "Lights",
    "imageUrl": "https://plus.unsplash.com/premium_photo-1685287731216-a7a0fae7a41a?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "stock": 35,
    "createdAt": "2024-03-15T10:40:00Z"
  },
  {
    "id": "PROD010",
    "name": "Smart Plug",
    "description": "Smart Wi-Fi plug for controlling appliances remotely",
    "price": 14.49,
    "category": "Sockets",
    "imageUrl": "https://plus.unsplash.com/premium_photo-1685287731216-a7a0fae7a41a?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "stock": 55,
    "createdAt": "2024-03-15T10:45:00Z"
  },
  {
    "id": "PROD011",
    "name": "Electric Heater Fan",
    "description": "Compact space heater with fan function",
    "price": 69.99,
    "category": "Fans",
    "imageUrl": "https://plus.unsplash.com/premium_photo-1685287731216-a7a0fae7a41a?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "stock": 12,
    "createdAt": "2024-03-15T10:50:00Z"
  },
  {
    "id": "PROD012",
    "name": "Heavy Duty Extension Cord",
    "description": "10-meter heavy-duty outdoor extension cord",
    "price": 25.49,
    "category": "Wires",
    "imageUrl": "https://plus.unsplash.com/premium_photo-1685287731216-a7a0fae7a41a?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "stock": 30,
    "createdAt": "2024-03-15T10:55:00Z"
  },
  {
    "id": "PROD013",
    "name": "Chandelier Light",
    "description": "Elegant chandelier with crystal details",
    "price": 149.99,
    "category": "Lights",
    "imageUrl": "https://plus.unsplash.com/premium_photo-1685287731216-a7a0fae7a41a?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "stock": 8,
    "createdAt": "2024-03-15T11:00:00Z"
  },
  {
    "id": "PROD014",
    "name": "Wall Socket",
    "description": "Basic single wall socket",
    "price": 3.99,
    "category": "Sockets",
    "imageUrl": "https://plus.unsplash.com/premium_photo-1685287731216-a7a0fae7a41a?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "stock": 100,
    "createdAt": "2024-03-15T11:05:00Z"
  },
  {
    "id": "PROD015",
    "name": "Ceiling Light",
    "description": "Modern ceiling light with adjustable brightness",
    "price": 55.99,
    "category": "Lights",
    "imageUrl": "https://plus.unsplash.com/premium_photo-1685287731216-a7a0fae7a41a?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "stock": 25,
    "createdAt": "2024-03-15T11:10:00Z"
  },
  {
    "id": "PROD016",
    "name": "Energy Saving Fan",
    "description": "Energy-efficient tower fan with quiet operation",
    "price": 79.99,
    "category": "Fans",
    "imageUrl": "https://plus.unsplash.com/premium_photo-1685287731216-a7a0fae7a41a?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "stock": 22,
    "createdAt": "2024-03-15T11:15:00Z"
  },
  {
    "id": "PROD017",
    "name": "Solar Garden Light",
    "description": "Solar-powered garden light, pack of 4",
    "price": 29.99,
    "category": "Lights",
    "imageUrl": "https://plus.unsplash.com/premium_photo-1685287731216-a7a0fae7a41a?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "stock": 50,
    "createdAt": "2024-03-15T11:20:00Z"
  },
  {
    "id": "PROD018",
    "name": "Smart Power Socket",
    "description": "Wi-Fi controlled power socket",
    "price": 19.99,
    "category": "Sockets",
    "imageUrl": "https://plus.unsplash.com/premium_photo-1685287731216-a7a0fae7a41a?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "stock": 40,
    "createdAt": "2024-03-15T11:25:00Z"
  },
  {
    "id": "PROD019",
    "name": "Wall Mount Fan",
    "description": "Quiet wall-mounted fan, 3-speed settings",
    "price": 49.99,
    "category": "Fans",
    "imageUrl": "https://plus.unsplash.com/premium_photo-1685287731216-a7a0fae7a41a?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "stock": 10,
    "createdAt": "2024-03-15T11:30:00Z"
  },
  {
    "id": "PROD020",
    "name": "Extension Cable",
    "description": "15-meter heavy-duty extension cable",
    "price": 18.99,
    "category": "Wires",
    "imageUrl": "https://plus.unsplash.com/premium_photo-1685287731216-a7a0fae7a41a?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "stock": 60,
    "createdAt": "2024-03-15T11:35:00Z"
  },
  {
    "id": "PROD021",
    "name": "USB Power Strip",
    "description": "Power strip with 4 USB ports",
    "price": 24.99,
    "category": "Sockets",
    "imageUrl": "https://plus.unsplash.com/premium_photo-1685287731216-a7a0fae7a41a?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "stock": 30,
    "createdAt": "2024-03-15T11:40:00Z"
  },
  {
    "id": "PROD022",
    "name": "Wireless Light Switch",
    "description": "Wireless light switch for smart home setup",
    "price": 25.99,
    "category": "Switches",
    "imageUrl": "https://plus.unsplash.com/premium_photo-1685287731216-a7a0fae7a41a?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "stock": 15,
    "createdAt": "2024-03-15T11:45:00Z"
  },
  {
    "id": "PROD023",
    "name": "Touch Switch",
    "description": "Sleek touch-sensitive light switch",
    "price": 29.49,
    "category": "Switches",
    "imageUrl": "https://plus.unsplash.com/premium_photo-1685287731216-a7a0fae7a41a?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "stock": 12,
    "createdAt": "2024-03-15T11:50:00Z"
  },
  {
    "id": "PROD024",
    "name": "Multiplug Extension Socket",
    "description": "Extension socket with 6 outlets and surge protection",
    "price": 21.99,
    "category": "Sockets",
    "imageUrl": "https://plus.unsplash.com/premium_photo-1685287731216-a7a0fae7a41a?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "stock": 50,
    "createdAt": "2024-03-15T11:55:00Z"
  },
  {
    "id": "PROD025",
    "name": "Portable Air Conditioner",
    "description": "Compact and portable air conditioner",
    "price": 299.99,
    "category": "Fans",
    "imageUrl": "https://plus.unsplash.com/premium_photo-1685287731216-a7a0fae7a41a?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "stock": 5,
    "createdAt": "2024-03-15T12:00:00Z"
  }
];

interface ProductStore {
  products: Product[];
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
}

export const useProductStore = create<ProductStore>((set) => ({
  products: mockProducts,
  addProduct: (productData) => {
    const notificationStore = useNotificationStore.getState();
    const newProduct: Product = {
      id: Math.random().toString(36).substr(2, 9),
      ...productData,
      createdAt: new Date().toISOString()
    };
    
    set((state) => ({
      products: [newProduct, ...state.products]
    }));

    // Trigger notification
    notificationStore.addNotification({
      title: 'New Product Added',
      message: `${newProduct.name} has been added to the inventory`,
      type: 'success'
    });
  },
  updateProduct: (id, productData) => {
    const notificationStore = useNotificationStore.getState();
    set((state) => ({
      products: state.products.map((product) =>
        product.id === id
          ? { ...product, ...productData }
          : product
      )
    }));

    // Trigger notification
    notificationStore.addNotification({
      title: 'Product Updated',
      message: `Product #${id} has been updated`,
      type: 'info'
    });
  },
  deleteProduct: (id) => {
    const notificationStore = useNotificationStore.getState();
    set((state) => ({
      products: state.products.filter((product) => product.id !== id)
    }));

    // Trigger notification
    notificationStore.addNotification({
      title: 'Product Deleted',
      message: `Product #${id} has been deleted`,
      type: 'warning'
    });
  }
})); 