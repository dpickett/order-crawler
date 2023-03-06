import { Page, test } from "@playwright/test";
import { readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { OrderCrawl } from "./OrderCrawl.js";
import { OrderIngestionResult } from "./OrderIngestionResult.js";
import { OrderPersistance } from "./OrderPersistance.js";

export const ingestOrders = async () => {
  const credentials = JSON.parse(
    readFileSync(
      join(dirname(fileURLToPath(import.meta.url)), "../../credentials.json")
    ).toString()
  );

  credentials.forEach(async (credential) => {
    let orders: OrderIngestionResult[];
    test("crawl orders", async ({ page }: { page: Page }) => {
      const orderIngestion = new OrderCrawl(credential, page);
      const orders = await orderIngestion.crawl();
    });

    const orderPersistance = new OrderPersistance(orders);
    await orderPersistance.persist();
  });
};

await ingestOrders();
