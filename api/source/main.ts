import cors from "cors";
import express from "express";

import { orders } from "@/repositories/mock";

import sales from "./sales/main";
import shipments from "./shipments/main";

const app = express();

orders.load();

app.use(express.json());
app.use("/sales", cors(), sales);
app.use("/shipments", cors(), shipments);

app.listen(process.env.PORT || 3000, function () {
  console.log("Api running on port 3000");
});
