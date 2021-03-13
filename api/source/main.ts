import express from "express";
import sales from "@sales/main";

const app = express();

app.use("/sales", sales);

app.listen(3000, function () {
  console.log("App running in port 3000!");
});
