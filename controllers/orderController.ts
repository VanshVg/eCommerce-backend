import { Request, Response } from "express";
import randomstring from "randomstring";

import orderModel, {
  orderInstance,
  orderInterface,
} from "../database/models/orderModel";
import { userInterface } from "./userController";

interface productsInterface {
  productData: string;
  quantity: number;
}

export const addOrder = async (req: Request, res: Response) => {
  try {
    const { products } = req.body;
    const trackingId = randomstring.generate({
      length: 12,
      charset: "numeric",
    });

    const orderPromise = new Promise((resolve) => {
      products.forEach(async (element: productsInterface) => {
        const addProduct = await orderModel.create({
          tracking_id: trackingId,
          user_id: (req.user as userInterface).id,
          product_data: element.productData,
          quantity: element.quantity,
        });
        if (!addProduct.dataValues.id) {
          resolve(false);
        }
      });
      resolve(true);
    });

    const createOrder = await orderPromise;
    if (!createOrder) {
      return res.status(500).json({
        success: false,
        type: "server",
        message: "Something went wrong!",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Order added successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      type: "server",
      message: "Something went wrong!",
    });
  }
};

export const getOrders = async (req: Request, res: Response) => {
  try {
    const findOrders = await orderModel.findAll({
      where: { user_id: (req.user as userInterface).id },
    });

    let orderData: orderInterface[] = [];

    findOrders.forEach((element: orderInstance) => {
      orderData.push(element.dataValues);
    });

    return res.status(200).json({
      success: true,
      orderData: orderData,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      type: "server",
      message: "Something went wrong!",
    });
  }
};
