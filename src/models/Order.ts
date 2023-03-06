import { OrderIngestionResult } from "../order-ingestion/OrderIngestionResult.js";
import { Model } from "./Model.js";

export class Order extends Model {
  static async findByOrderId(orderId: string) {
    return this.getClient().order.findFirst({
      where: { orderId: { equals: orderId } },
    });
  }

  static async findByTotalChargedAndDate({
    totalCharged,
    orderedAt,
  }: {
    totalCharged: number;
    orderedAt: Date;
  }) {
    return this.getClient().order.findMany({
      where: {
        totalCharged: { equals: totalCharged },
        orderedAt: { equals: orderedAt },
      },
      include: { orderItems: true },
    });
  }

  static async create(order: OrderIngestionResult) {
    const modifiedOrder = {
      ...order,
      orderItems: {
        create: order.orderItems,
      },
    };
    return this.getClient().order.create({ data: modifiedOrder });
  }
}
