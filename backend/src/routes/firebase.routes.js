import { Router } from "express";
import { verifyFirebase } from "../middlewares/firebase.middleware.js";
import { firebaseUserAuth } from "../controllers/firebase.controller.js";

const router = Router();

router.route("/firebase").post(verifyFirebase, firebaseUserAuth);

export default router;
