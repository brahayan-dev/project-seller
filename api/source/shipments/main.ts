import { Router } from "express";

import * as read from "./handlers/read";

const router = Router();

router.get("/", read.every);

export default router;
