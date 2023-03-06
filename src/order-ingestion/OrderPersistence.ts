import { Order } from "../models/Order.js";
import { OrderIngestionResult } from "./OrderIngestionResult.js";

export class OrderPersistence {
  orders: OrderIngestionResult[];

  constructor(orders: OrderIngestionResult[]) {
    this.orders = orders;
  }

  async persist() {
    return Promise.all(this.orders.map((order) => this.persistOrder(order)));
  }

  protected async persistOrder(order: OrderIngestionResult) {
    const foundOrder = await Order.findByOrderId(order.orderId);
    if (!foundOrder) {
      return await Order.create(order);
    }
    return foundOrder;
  }
}
