import express from "express";
import cors from "cors";
import errorHandler from "./middlewares/errorHandlers";

// import routes
import products from "./routers/products";
import admins from "./routers/admins";
import customer from "./routers/customer";
import categories from "./routers/categories";
import auth from "./routers/auth";

const app = express();

//Enable Cors
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Routes
app.use("/api/v1/products", products);
app.use("/api/v1/admins", admins);
app.use("/api/v1/customers", customer);
app.use("/api/v1/categories", categories);
app.use("/api/v1/auth", auth);

app.use(errorHandler);

export default app;
