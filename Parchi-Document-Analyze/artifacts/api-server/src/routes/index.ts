import { Router, type IRouter } from "express";
import healthRouter from "./health";
import prescriptionRouter from "./prescription";
import testReportRouter from "./testreport";

const router: IRouter = Router();

router.use(healthRouter);
router.use(prescriptionRouter);
router.use(testReportRouter);

export default router;
