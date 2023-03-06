import { Browser, Page } from "@playwright/test";
import { AmazonCredentials } from "./AmazonCredentials.js";

const emailLabel = "Email or mobile phone number";
const passwordLabel = "Password";

export const signIn = async (page: Page, credentials: AmazonCredentials) => {
  await page.getByLabel(emailLabel).fill(credentials.email);
  await page.getByLabel("Continue").last().click();
  await page.getByLabel(passwordLabel).fill(credentials.password);
  await page.getByLabel("Sign In").click();
};
