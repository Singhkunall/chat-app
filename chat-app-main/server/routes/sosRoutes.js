import express from 'express';
import { protectRoute } from '../middleware/auth.js';
import { triggerSOS, resolveSOS } from '../controllers/sosController.js';

const sosRouter = express.Router();

sosRouter.post("/trigger", protectRoute, triggerSOS);
sosRouter.put("/resolve/:id", protectRoute, resolveSOS);

export default sosRouter;