import { chromium, Page } from "@playwright/test";
import { AmazonCredentials } from "./AmazonCredentials.js";
import { getInvoiceLinks } from "./getInvoiceLinks.js";
import { InvoiceParser } from "./InvoiceParser.js";
import { OrderIngestionResult } from "./OrderIngestionResult.js";
import { signIn } from "./signIn.js";

const orderListingUrl = "https://www.amazon.com/gp/your-account/order-history";
export class OrderCrawl {
  credentials: AmazonCredentials;
  page: Page;
  constructor(credentials: AmazonCredentials, page: Page) {
    this.credentials = credentials;
    this.page = page;
  }

  async crawl() {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    await page.goto(orderListingUrl);
    await signIn(page, this.credentials);
    const links = await getInvoiceLinks(page);
    let data = [] as OrderIngestionResult[];
    for (const link of links) {
      await page.goto(link);
      const invoiceParsing = new InvoiceParser(page);
      data = [...data, await invoiceParsing.parse()];
    }
    await browser.close();
    return data;
  }
}
