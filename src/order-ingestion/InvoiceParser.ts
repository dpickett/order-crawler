import { Page } from "@playwright/test";
import { parse } from "date-fns";
import { OrderIngestionResult } from "./OrderIngestionResult.js";
import { OrderItemIngestionResult } from "./OrderItemIngestionResult.js";

const orderIdText = "Amazon.com order number:";
const orderTotalText = "Order Total:";
const orderPlacedText = "Order Placed:";
interface RawFieldMap {
  orderId?: string;
  orderedAtText?: string;
  totalCharged?: string;
}

export class InvoiceParser {
  page: Page;
  constructor(page: Page) {
    this.page = page;
  }

  async parse() {
    const fieldMap = {
      orderId: orderIdText,
      orderedAtText: orderPlacedText,
      totalCharged: orderTotalText,
    };
    let fieldValues = {} as RawFieldMap;
    for (const field of Object.keys(fieldMap)) {
      const td = this.page.locator("table td td", { hasText: fieldMap[field] });
      fieldValues = {
        ...fieldValues,
        [field]: (await td.textContent()).replace(fieldMap[field], "").trim(),
      };
    }

    let adjustedFields = {
      orderId: fieldValues.orderId,
      totalCharged: parseFloat(fieldValues.totalCharged.replace("$", "")),
      orderedAt: parse(fieldValues.orderedAtText, "MMMM d, yyyy", new Date()),
      orderItems: [],
    } as OrderIngestionResult;

    const itemNameSelector = "table table table td i";

    let orderItems = [];
    const itemNames = await this.page.locator(itemNameSelector).all();
    for (const itemName of itemNames) {
      const name = await itemName.textContent();
      const row = await this.page.locator("table table table table table tr", {
        hasText: name,
      });
      const rawTotal = await row.locator("td:last-child").first().textContent();
      const itemTotal = parseFloat(rawTotal.trim().replace("$", ""));
      orderItems = [
        ...orderItems,
        {
          name: await itemName.textContent(),
          itemTotal,
        } as OrderItemIngestionResult,
      ];
    }

    adjustedFields = {
      ...adjustedFields,
      orderItems,
    };

    return adjustedFields;
  }
}
