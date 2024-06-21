import express, { Router } from "express";

import * as orderController from "../controllers/orderController";
import passport from "passport";

import { applyPassportStrategy } from "../middlewares/passport";
applyPassportStrategy();

const auth = passport.authenticate("jwt", {
  session: false,
  failureRedirect: "/",
});

const router: Router = express.Router();

router.post("/add", auth, orderController.addOrder);
router.get("/get", auth, orderController.getOrders);

export default router;
