import { Router } from "express";

import { configRouter } from "./routes/config.routes";
import { logsRouter } from "./routes/logs.routes";
import { productsRouter } from "./routes/products.routes";
import { supportRouter } from "./routes/support.routes";
import { healthRouter } from "./routes/health.routes";
import { requestsRouter } from "./routes/requests.routes";

import { overviewRouter } from "./routes/overview.routes";
import { usersRouter } from "./routes/users.routes";

/** HTTP API mounted at `/api`. */
export const apiRouter = Router();

apiRouter.use("/overview", overviewRouter);
apiRouter.use("/users", usersRouter);
apiRouter.use("/config", configRouter);


apiRouter.use("/products", productsRouter);
apiRouter.use("/logs", logsRouter);
apiRouter.use("/support", supportRouter);
apiRouter.use("/health", healthRouter);
apiRouter.use("/requests", requestsRouter);
