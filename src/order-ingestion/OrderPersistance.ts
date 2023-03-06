import { OrderIngestionResult } from "./OrderIngestionResult.js";

export class OrderPersistance {
  orders: OrderIngestionResult[];

  constructor(orders: OrderIngestionResult[]) {
    this.orders = orders;
  }

  async persist() {}
}
