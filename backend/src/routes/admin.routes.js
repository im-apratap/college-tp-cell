import { Router } from "express";
import {
  registerAdmin,
  loginAdmin,
  logoutAdmin,
  getAllStudentProfiles,
  deleteStudentProfile,
  getCurrentAdmin,
  verifyStudentProfile,
  getStudentByUniqueId,
} from "../controllers/admin.controller.js";
import { updateQueueStatus } from "../controllers/placement.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(registerAdmin);
router.route("/login").post(loginAdmin);

// Secured routes
router.route("/logout").post(verifyJWT, logoutAdmin);
router.route("/me").get(verifyJWT, getCurrentAdmin);
router.route("/submissions").get(verifyJWT, getAllStudentProfiles);
router.route("/submissions/:id").delete(verifyJWT, deleteStudentProfile);
router.route("/verify/:id").patch(verifyJWT, verifyStudentProfile);
router.route("/queue-status/:id").patch(verifyJWT, updateQueueStatus);
router.route("/students/:uniqueId").get(verifyJWT, getStudentByUniqueId);

export default router;
