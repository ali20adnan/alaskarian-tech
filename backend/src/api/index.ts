import { Router } from "express";

import { configRouter } from "./routes/config.routes";
import { logsRouter } from "./routes/logs.routes";
import { productsRouter } from "./routes/products.routes";

/** HTTP API mounted at `/api`. */
export const apiRouter = Router();

apiRouter.use("/config", configRouter);
apiRouter.use("/products", productsRouter);
apiRouter.use("/logs", logsRouter);
