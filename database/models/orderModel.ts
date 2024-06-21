import { DataType } from "sequelize-typescript";
import { Model, Optional } from "sequelize";

import sequelize from "../connection";

export interface orderInterface {
  id: number;
  tracking_id: string;
  user_id: number;
  product_data: string;
  quantity: number;
  status: "Delivered" | "Pending";
  created_at: Date;
  updated_at: Date;
}

interface orderCreationAttribute
  extends Optional<
    orderInterface,
    "id" | "status" | "created_at" | "updated_at"
  > {}

export interface orderInstance
  extends Model<orderInterface, orderCreationAttribute>,
    orderInterface {
  created_at: Date;
  updated_at: Date;
}

const order = sequelize.define<orderInstance>(
  `orders`,
  {
    id: {
      type: DataType.INTEGER,
      primaryKey: true,
      unique: true,
      autoIncrement: true,
    },
    tracking_id: {
      type: DataType.STRING,
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
    status: {
      type: DataType.STRING,
      defaultValue: "Pending",
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

export default order;
