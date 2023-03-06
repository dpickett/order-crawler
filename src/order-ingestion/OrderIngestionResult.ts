export interface OrderIngestionResult {
  orderId: string;
  totalCharged: number;
  orderedAt: Date;
  items: OrderIngestionResult[];
}
