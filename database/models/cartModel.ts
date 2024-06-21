import { DataType } from "sequelize-typescript";
import { Model, Optional } from "sequelize";

import sequelize from "../connection";

export interface cartInterface {
  id: number;
  user_id: number;
  product_data: string;
  quantity: number;
  created_at: Date;
  updated_at: Date;
}

interface cartCreationAttribute
  extends Optional<cartInterface, "id" | "created_at" | "updated_at"> {}

export interface cartInstance
  extends Model<cartInterface, cartCreationAttribute>,
    cartInterface {
  created_at: Date;
  updated_at: Date;
}

const cart = sequelize.define<cartInstance>(
  `carts`,
  {
    id: {
      type: DataType.INTEGER,
      primaryKey: true,
      unique: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataType.INTEGER,
    },
    product_data: {
      type: DataType.TEXT,
    },
    quantity: {
      type: DataType.INTEGER,
    },
    created_at: {
      type: DataType.DATE,
    },
    updated_at: {
      type: DataType.DATE,
    },
  },
  {
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    deletedAt: "deleted_at",
  }
);

export default cart;
