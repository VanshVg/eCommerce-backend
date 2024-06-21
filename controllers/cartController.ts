import { Request, Response } from "express";

import cartModel, { cartInterface } from "../database/models/cartModel";
import { userInterface } from "./userController";

export const addToCart = async (req: Request, res: Response) => {
  try {
    const { productData, quantity } = req.body;
    const findCart = await cartModel.findAll({
      where: { user_id: (req.user as userInterface).id },
    });
    let count: number = 0;
    findCart.forEach(async (element) => {
      if (JSON.parse(element.dataValues.product_data).id === productData.id) {
        count++;
        const cartId: number = element.dataValues.id;
        const updateCart = await cartModel.increment("quantity", {
          by: quantity,
          where: { id: cartId },
        });
        if (!updateCart) {
          return res.status(500).json({
            success: false,
            type: "server",
            message: "Something went wrong!",
          });
        }
      }
    });
    if (count === 0) {
      const addData = await cartModel.create({
        user_id: (req.user as userInterface).id,
        product_data: JSON.stringify(productData),
        quantity: quantity,
      });
      if (!addData) {
        return res.status(500).json({
          success: false,
          type: "server",
          message: "Something went wrong!",
        });
      }
    }
    return res.status(200).json({
      success: true,
      message: "Item added to cart successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      type: "server",
      message: "Something went wrong!",
    });
  }
};

export const getCartItems = async (req: Request, res: Response) => {
  try {
    let cartData: cartInterface[] = [];
    let totalPrice: number = 0;
    const findCart = await cartModel.findAll({
      where: { user_id: (req.user as userInterface).id },
    });
    findCart.forEach((element) => {
      cartData.push(element.dataValues);
      totalPrice +=
        JSON.parse(element.dataValues.product_data).price *
        element.dataValues.quantity;
    });
    return res.status(200).json({
      success: true,
      cartData: cartData,
      totalPrice: totalPrice,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      type: "server",
      message: "Something went wrong!",
    });
  }
};

export const removeCartItem = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const deleteItem = await cartModel.destroy({ where: { id: id } });
    if (!deleteItem) {
      return res.status(500).json({
        success: false,
        type: "server",
        message: "Something went wrong!",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Item removed from the cart",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      type: "server",
      message: "Something went wrong!",
    });
  }
};

export const decreaseQuantity = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const decrease = await cartModel.decrement("quantity", {
      by: 1,
      where: { id: id },
    });
    if (!decrease) {
      return res.status(500).json({
        success: false,
        type: "server",
        message: "Something went wrong!",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Decreased quantity successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      type: "server",
      message: "Something went wrong!",
    });
  }
};

export const increaseQuantity = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const increase = await cartModel.increment("quantity", {
      by: 1,
      where: { id: id },
    });
    if (!increase) {
      return res.status(500).json({
        success: false,
        type: "server",
        message: "Something went wrong!",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Increased quantity successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      type: "server",
      message: "Something went wrong!",
    });
  }
};

export const checkout = async (req: Request, res: Response) => {
  try {
    const removeCart = await cartModel.destroy({
      where: { user_id: (req.user as userInterface).id },
    });
    if (!removeCart) {
      return res.status(500).json({
        success: false,
        type: "server",
        message: "Something went wrong!",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Checkout successful",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      type: "server",
      message: "Something went wrong!",
    });
  }
};
