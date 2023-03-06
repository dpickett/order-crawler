import { Client } from "./Client.js";

export abstract class Model {
  static getClient() {
    return Client.getInstance().prisma;
  }
}
