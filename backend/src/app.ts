import express, { type Express, type Request, type Response } from "express";
import { corsMiddleware } from "./middleware/cors.js";
import accountRoutes from "./routes/accountRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app: Express = express();

// Middleware
app.use(corsMiddleware);
app.use(express.json());
app.use("/api/accounts", accountRoutes);
app.use("/api/transactions", transactionRoutes);

app.get("/", (req: Request, res: Response) => {
  console.log(app.mountpath);
  res.send("Welcome again to Ledger Homepage");
});

//Error Handler
app.use(errorHandler);

export default app;
