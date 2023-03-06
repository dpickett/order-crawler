import { OrderItem } from "./OrderItem";

export interface Order {
  id: number;
  orderId: string;
  orderedAt: string;
  totalCharged: string;
  orderItems: OrderItem[];
}
