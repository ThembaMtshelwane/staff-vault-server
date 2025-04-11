import jwt, { SignOptions } from "jsonwebtoken";
import { IUser } from "../detinitions";

const generateAccessToken = (user: IUser): string => {
  const jwtOptions: SignOptions = {
    expiresIn: "15m",
    issuer: "ThembaMM3@gmail.com",
    audience: "API V1",
  };

  if (!user.access_token_secret_key) {
    throw new Error("JWT secret is missing for the user");
  }

  return jwt.sign(
    {
      id: user._id,
    },
    user.access_token_secret_key,
    jwtOptions
  );
};

export default generateAccessToken;
