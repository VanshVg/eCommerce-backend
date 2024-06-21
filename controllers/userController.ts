import { Request, Response } from "express";

import randomstring from "randomstring";
import userModel, { userInstance } from "../database/models/userModel";
import bcrypt from "bcrypt";
import { generateToken } from "../helpers/generateToken";
import { Op } from "sequelize";

export interface userInterface {
  id: number;
  contact_no: string;
  email: string;
  password: string;
  verification_token: string;
  is_active: boolean;
  reset_request: Date | null;
  reset_token: string | null;
  deleted_at: Date | null;
  created_at: Date;
  updated_at: Date;
}

interface RequestWithUser extends Request {
  user: userInterface;
}

export const register = async (req: Request, res: Response) => {
  try {
    const { contactNo, email, password } = req.body;

    const isContact: userInstance | null = await userModel.findOne({
      where: { contact_no: contactNo },
    });
    if (isContact != null) {
      const { dataValues } = isContact;
      if (!dataValues.is_active) {
        let createdAt: number = dataValues.created_at.getTime();
        let currentTime: number = new Date().getTime();
        if ((currentTime - createdAt) / 60000 > 60) {
          let deleteUser: number = await userModel.destroy({
            where: { contact_no: contactNo },
          });
          if (!deleteUser) {
            return res.status(500).json({
              success: false,
              type: "server",
              message: "Something went wrong",
            });
          }
        } else {
          return res.status(409).json({
            success: false,
            type: "contact_no",
            message: "Contact Number is already taken",
          });
        }
      } else {
        return res.status(409).json({
          success: false,
          type: "contact_no",
          message: "Contact Number is already taken",
        });
      }
    }

    const isEmail: userInstance | null = await userModel.findOne({
      where: { email: email },
    });
    if (isEmail != null) {
      const { dataValues } = isEmail;
      if (!dataValues.is_active) {
        let createdAt: number = dataValues.created_at.getTime();
        let currentTime: number = new Date().getTime();
        if ((currentTime - createdAt) / 60000 > 60) {
          let deleteUser: number = await userModel.destroy({
            where: { email: email },
          });
          if (!deleteUser) {
            return res.status(500).json({
              success: false,
              type: "server",
              message: "Something went wrong",
            });
          }
        } else {
          return res.status(409).json({
            success: false,
            type: "email",
            message: "Email is already taken",
          });
        }
      } else {
        return res.status(409).json({
          success: false,
          type: "email",
          message: "Email is already taken",
        });
      }
    }

    let verificationToken: string = randomstring.generate({
      length: 12,
      charset: "alphanumeric",
    });

    let hashedPassword: string = await bcrypt.hash(password, 10);

    const user: userInstance = await userModel.create({
      contact_no: contactNo,
      email: email,
      password: hashedPassword,
      verification_token: verificationToken,
      is_active: 0,
    });
    if (!user.dataValues.id) {
      return res.status(500).json({
        success: false,
        type: "server",
        message: "Something went wrong",
      });
    }

    let token: string = generateToken(contactNo, email) as string;
    return res.status(200).json({
      success: true,
      token: token,
      verification_token: verificationToken,
      message: "User registered successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      type: "server",
      message: "Something went wrong!",
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    let isUsername: userInstance = (await userModel.findOne({
      where: { [Op.or]: [{ contact_no: username }, { email: username }] },
    })) as userInstance;
    if (isUsername !== null && isUsername.dataValues.deleted_at === null) {
      const { dataValues } = isUsername;

      let isPassword: boolean = await bcrypt.compare(
        password,
        dataValues.password
      );
      if (isPassword !== true) {
        return res.status(401).json({
          success: false,
          type: "credentials",
          message: "Invalid Credentials",
        });
      }

      if (!dataValues.is_active) {
        return res.status(401).json({
          success: false,
          type: "active",
          message: "Account isn't activated",
        });
      }
    } else {
      return res.status(401).json({
        success: false,
        type: "credentials",
        message: "Invalid Credentials",
      });
    }

    let token: string = generateToken(
      isUsername.dataValues.contact_no,
      isUsername.dataValues.email
    ) as string;

    return res
      .status(200)
      .cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
      })
      .json({
        success: true,
        token: token,
        userData: isUsername.dataValues,
        message: "Login successful",
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

export const activate = async (req: Request, res: Response) => {
  try {
    const { token } = req.params;
    const isUser: userInstance | null = await userModel.findOne({
      where: {
        [Op.and]: [
          { id: (req.user as userInterface).id },
          { verification_token: token },
        ],
      },
    });
    if (isUser == null) {
      return res.status(403).json({
        success: false,
        type: "unauthorised",
        message: "User isn't authorised to access this page",
      });
    }
    let { dataValues } = isUser;

    let createdAt: number = dataValues.created_at.getTime();
    let currentTime: number = new Date().getTime();
    if ((currentTime - createdAt) / 60000 > 60) {
      return res.status(403).json({
        success: false,
        type: "unauthorised",
        message: "Token is expired please Register again",
      });
    }
    let updateUser: [affectedRows: number] = await userModel.update(
      { is_active: 1 },
      { where: { id: (req.user as userInterface).id } }
    );
    if (!updateUser) {
      return res.status(500).json({
        success: false,
        type: "server",
        message: "Something went wrong!",
      });
    }
    return res.status(200).json({
      success: true,
      message: "User activated successfully",
      userData: dataValues,
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

export const verifyAccount = async (req: Request, res: Response) => {
  try {
    const { username } = req.body;

    const isUser: userInstance | null = await userModel.findOne({
      where: { [Op.or]: [{ contact_no: username }, { email: username }] },
    });

    if (isUser == null) {
      return res.status(404).json({
        success: false,
        type: "not_found",
        message: "User not found",
      });
    }
    if (!isUser.dataValues.is_active) {
      return res.status(404).json({
        success: false,
        type: "not_active",
        message: "Account isn't activated",
      });
    }

    let resetToken: string = randomstring.generate({
      length: 12,
      charset: "alphanumeric",
    });

    let updateUser: [affectedRows: number] = await userModel.update(
      { reset_token: resetToken },
      { where: { [Op.or]: [{ contact_no: username }, { email: username }] } }
    );
    if (!updateUser) {
      return res.status(500).json({
        success: false,
        type: "server",
        message: "Something went wrong!",
      });
    }
    return res.status(200).json({
      success: true,
      reset_token: resetToken,
      message: "Account is verified",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      type: "server",
      message: "Something went wrong!",
    });
  }
};
