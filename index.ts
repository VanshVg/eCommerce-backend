import express, { Express } from "express";
import router from "./routes/userRoutes";
import cartRouter from "./routes/cartRoutes";
import orderRouter from "./routes/orderRoutes";
import cors from "cors";
import cookieParser from "cookie-parser";

const app: Express = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use("/", router);
app.use("/cart", cartRouter);
app.use("/order", orderRouter);

app.listen(4000, () => {
  console.log(`Server is listening on 4000 `);
});
