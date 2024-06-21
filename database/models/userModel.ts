import { DataType } from "sequelize-typescript";
import { Model, Optional } from "sequelize";

import sequelize from "../connection";

interface userInterface {
  id: number;
  contact_no: string;
  email: string;
  password: string;
  verification_token: string;
  is_active: number;
  reset_token: string;
  deleted_at: Date;
  created_at: Date;
  updated_at: Date;
}

interface userCreationAttribute
  extends Optional<
    userInterface,
    "reset_token" | "id" | "created_at" | "updated_at" | "deleted_at"
  > {}

export interface userInstance
  extends Model<userInterface, userCreationAttribute>,
    userInterface {
  created_at: Date;
  updated_at: Date;
  deleted_at: Date;
}

const users = sequelize.define<userInstance>(
  `user`,
  {
    id: {
      type: DataType.INTEGER,
      primaryKey: true,
      unique: true,
      autoIncrement: true,
    },
    contact_no: {
      type: DataType.STRING,
      unique: true,
      allowNull: false,
    },
    email: {
      type: DataType.STRING,
      unique: true,
      allowNull: false,
    },
    password: {
      type: DataType.STRING,
      allowNull: false,
    },
    verification_token: {
      type: DataType.STRING,
      allowNull: false,
    },
    is_active: {
      type: DataType.BOOLEAN,
      allowNull: false,
    },
    reset_token: {
      type: DataType.STRING,
      allowNull: true,
    },
    deleted_at: {
      type: DataType.DATE,
      allowNull: true,
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

export default users;
