import jwt from "jsonwebtoken";
import { config } from "dotenv";

config();

export const generateToken = (contact_no: string, email: string) => {
  try {
    return jwt.sign(
      {
        data: {
          contact_no: contact_no,
          email: email,
        },
      },
      process.env.SECRET_KEY as string
    );
  } catch (error) {
    console.log(`Error while generating token`, error);
  }
};
