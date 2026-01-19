import { Router } from "express";
import {
  registerAdmin,
  loginAdmin,
  logoutAdmin,
  getAllStudentProfiles,
  deleteStudentProfile,
  getCurrentAdmin,
  verifyStudentProfile,
} from "../controllers/admin.controller.js";
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

export default router;
