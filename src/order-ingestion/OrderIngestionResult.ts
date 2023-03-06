import { OrderItemIngestionResult } from "./OrderItemIngestionResult.js";

export interface OrderIngestionResult {
  orderId: string;
  totalCharged: number;
  orderedAt: Date;
  orderItems: OrderItemIngestionResult[];
}
