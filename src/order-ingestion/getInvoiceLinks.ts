import { Page } from "@playwright/test";
import { InvoiceParser } from "./InvoiceParser.js";

export const getInvoiceLinks = async (page: Page) => {
  const orderLinkSelector =
    ".order-card .order-header .yohtmlc-order-level-connections a:last-child";
  await page.waitForSelector(orderLinkSelector);
  const anchors = await page.locator(orderLinkSelector).all();

  let data = [];
  const paths = await Promise.all(
    anchors.map(async (anchor) => anchor.getAttribute("href"))
  );
  const baseHost = page.url().match(/https:\/\/[^\/]*\//);

  return paths.map((path) => `${baseHost[0]}${path}`);
};
