import { Router } from "express";
import {
  submitProfile,
  getProfile,
  getFormStatus,
} from "../controllers/placement.controller.js";

const router = Router();

router.route("/status").get(getFormStatus);
router.route("/submit").post(submitProfile);
router.route("/:registrationNumber").get(getProfile);

export default router;
