import crypto from "crypto";
import { IUser } from "../detinitions";

const generateRefreshToken = (user: IUser) => {
  const random = crypto.randomBytes(64);
  const refreshToken = random.toString("hex");

  return refreshToken;
};

export default generateRefreshToken;
