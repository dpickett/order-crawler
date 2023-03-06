import express from "express";
import { Client } from "./models/Client.js";
import { ordersRouter } from "./routes/api/v1/orders.js";

const app = express();
const port = 3000;

app.use("/api/v1/orders", ordersRouter);

const server = app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

process.on("SIGTERM", () => {
  server.close(async (err) => {
    console.log("shutting down");
    await Client.getInstance().prisma.$disconnect();
  });
});
