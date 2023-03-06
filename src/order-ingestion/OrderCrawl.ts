import { chromium, Page } from "@playwright/test";
import { AmazonCredentials } from "./AmazonCredentials.js";
import { getBaseHost } from "./getBaseHost.js";
import { getInvoiceLinks } from "./getInvoiceLinks.js";
import { InvoiceParser } from "./InvoiceParser.js";
import { OrderIngestionResult } from "./OrderIngestionResult.js";
import { signIn } from "./signIn.js";

const orderListingUrl = "https://www.amazon.com/gp/your-account/order-history";
export class OrderCrawl {
  credentials: AmazonCredentials;
  page: Page;
  data: OrderIngestionResult[];
  constructor(credentials: AmazonCredentials, page: Page) {
    this.credentials = credentials;
    this.page = page;
    this.data = [];
  }

  async crawl() {
    const browser = await chromium.launch();
    this.page = await browser.newPage();
    await this.page.goto(orderListingUrl);
    await signIn(this.page, this.credentials);
    await this.crawlPage();
    await browser.close();
    return this.data;
  }

  protected async crawlPage() {
    await this.page.waitForSelector(".a-pagination");
    const links = await getInvoiceLinks(this.page);
    const nextPageSelector = ".a-pagination .a-last a";
    const nextPageLink = await this.page.$(nextPageSelector);
    let nextPagePath = null;
    if (nextPageLink) {
      nextPagePath = await nextPageLink.getAttribute("href");
    }
    console.log(links);
    for (const link of links) {
      await this.page.goto(link);
      const invoiceParsing = new InvoiceParser(this.page);
      this.data = [...this.data, await invoiceParsing.parse()];
    }
    if (nextPagePath) {
      const baseHost = getBaseHost(this.page);
      await this.page.goto(`${baseHost}${nextPagePath}`, {
        waitUntil: "domcontentloaded",
      });
      await this.crawlPage();
    }
  }
}
