import express from "express";
import cors from "cors";
import errorHandler from "./middlewares/errorHandlers";

// import routes

import products from "./routers/products";

const app = express();

//Enable Cors
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Routes
app.use("/api/v1/products", products);

app.use(errorHandler);

export default app;
