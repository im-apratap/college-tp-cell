import { Router } from "express";
import {
  submitProfile,
  getProfile,
} from "../controllers/placement.controller.js";

const router = Router();

router.route("/submit").post(submitProfile);
router.route("/:rollNumber").get(getProfile);

export default router;
