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
  }
];