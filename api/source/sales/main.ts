import { Router } from "express";

import * as create from "./handlers/create";
import * as read from "./handlers/read";

const router = Router();

router.get("/", read.every);
router.get("/:saleId", read.detail);
router.post("/", create.entityValidation, create.entity);

export default router;
