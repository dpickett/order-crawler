import { PrismaClient } from "@prisma/client";
export class Client {
  private static instance: Client;
  prisma: PrismaClient;

  public static getInstance() {
    if (!this.instance) {
      this.instance = new Client();
    }
    return this.instance;
  }

  public static async destroyInstance() {
    await this.instance.prisma.$disconnect();
    this.instance = null;
  }

  constructor() {
    this.prisma = new PrismaClient();
  }
}
