export type OrderStatus = 'Baking' | 'Decorating' | 'Ready';

export interface Order {
  phoneNumber: string;
  status: OrderStatus;
  customerName: string;
  cakeName: string;
}

export const orderDatabase: Order[] = [
  {
    phoneNumber: "9876543210",
    status: "Baking",
    customerName: "Aarav Sharma",
    cakeName: "Signature Dark Chocolate"
  },
  {
    phoneNumber: "9123456789",
    status: "Decorating",
    customerName: "Priya Patel",
    cakeName: "Red Velvet Rose"
  },
  {
    phoneNumber: "9988776655",
    status: "Ready",
    customerName: "Vikram Singh",
    cakeName: "Persian Saffron & Pistachio"
  }
];
