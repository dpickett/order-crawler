import { Router } from "express";
import { parse } from "date-fns";
import { Order } from "../../../models/Order.js";

export const ordersRouter = Router({ mergeParams: true });

interface QueryParams {
  totalCharged: number;
  orderedAt: string;
}
ordersRouter.get<unknown, unknown, unknown, QueryParams>(
  "/",
  async (req, res) => {
    const { totalCharged, orderedAt } = req.query;
    const orders = await Order.findByTotalChargedAndDate({
      totalCharged,
      orderedAt: parse(orderedAt, "yyyy-MM-dd", new Date()),
    });
    res.json(orders);
  }
);
