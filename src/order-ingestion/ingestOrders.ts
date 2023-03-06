import { Page, test } from "@playwright/test";
import { readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { Order } from "../models/Order.js";
import { OrderCrawl } from "./OrderCrawl.js";
import { OrderIngestionResult } from "./OrderIngestionResult.js";
import { OrderPersistence } from "./OrderPersistence.js";

export const ingestOrders = async () => {
  const credentials = JSON.parse(
    readFileSync(
      join(dirname(fileURLToPath(import.meta.url)), "../../credentials.json")
    ).toString()
  );

  try {
    credentials.forEach(async (credential) => {
      let orders: OrderIngestionResult[];
      await test("crawl orders", async ({ page }: { page: Page }) => {
        const orderIngestion = new OrderCrawl(credential, page);
        orders = await orderIngestion.crawl();

        const orderPersistance = new OrderPersistence(orders);
        await orderPersistance.persist();
      });
    });
  } finally {
    Order.getClient().$disconnect();
  }
};

await ingestOrders();
