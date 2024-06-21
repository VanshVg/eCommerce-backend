import express, { Router } from "express";

import * as userController from "../controllers/userController";
import passport from "passport";

import { applyPassportStrategy } from "../middlewares/passport";
applyPassportStrategy();

const router: Router = express.Router();

router.post("/register", userController.register);
router.post("/login", userController.login);
router.put(
  "/activate/:token",
  passport.authenticate("jwt", {
    session: false,
    failureRedirect: "/",
  }),
  userController.activate
);

export default router;
