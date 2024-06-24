import express, { Router } from "express";

import * as cartController from "../controllers/cartController";
import passport from "passport";

import { applyPassportStrategy } from "../middlewares/passport";
applyPassportStrategy();

const auth = passport.authenticate("jwt", {
  session: false,
  failureRedirect: "/",
});

const router: Router = express.Router();

router.post("/addOne", auth, cartController.addItemToCart);
router.post("/add", auth, cartController.addItemsToCart);
router.get("/get", auth, cartController.getCartItems);
router.delete("/remove/:id", auth, cartController.removeCartItem);
router.put("/increase/:id", auth, cartController.increaseQuantity);
router.put("/decrease/:id", auth, cartController.decreaseQuantity);
router.delete("/checkout", auth, cartController.checkout);

export default router;
