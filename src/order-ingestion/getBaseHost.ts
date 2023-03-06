import { Page } from "@playwright/test";

export const getBaseHost = (page: Page) => {
  return page.url().match(/https:\/\/[^\/]*\//);
};
