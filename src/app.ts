import express, { ErrorRequestHandler } from "express";
import cors from "cors";
import helmet from "helmet";
import authRouter from "./routes/auth.routes";
import managerRouter from "./routes/manager.route";
import tenantRoute from "./routes/tenant.route";
import propertyRoute from "./routes/property.route";
import applicationRoute from "./routes/application.route";
import leaseRouter from "./routes/lease.route";
import dotenv from "dotenv";
import { errorMiddleware } from "./middlewares/error.middleware";
import authMiddleware from "./middlewares/auth.middleware";
import { role } from "./consts/role";


dotenv.config();

const app = express();

app.use(express.json());

app.use(cors());
app.use(helmet());

const prefixRoute = `api/${process.env.API_VERSION || "v1"}`;

app.use("/api/v1", authRouter);
app.use("/api/v1/tenants", authMiddleware([role.tenant]),tenantRoute);
app.use("/api/v1/managers", authMiddleware([role.manager]), managerRouter);
app.use("/api/v1/properties", propertyRoute);
app.use("/api/v1/applications", applicationRoute);
app.use("/api/v1/leases", leaseRouter);

app.use(errorMiddleware)

app.listen(process.env.PORT || 3000, () => {
    console.log(`Server is running on port ${process.env.PORT || 3000}`);
})

