import { Router, type IRouter } from "express";
import healthRouter from "./health";
import prescriptionRouter from "./prescription";
import testReportRouter from "./testreport";
import authRouter from "./auth";
import userHistoryRouter from "./userHistory";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(userHistoryRouter);
router.use(prescriptionRouter);
router.use(testReportRouter);

export default router;
