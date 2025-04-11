import { IUser } from "../detinitions";
import jwt, { SignOptions } from "jsonwebtoken";
import { after90Days } from "../constants/date.consts";

const generateRefreshToken = (user: IUser) => {
  const jwtOptions: SignOptions = {
    expiresIn: after90Days().getMilliseconds(),
    issuer: "ThembaMM3@gmail.com",
    audience: "API V1",
  };

  if (!user.refresh_token_secret_key) {
    throw new Error("Refresh token secret key is missing for the user");
  }

  return jwt.sign(
    {
      id: user._id,
    },
    user.refresh_token_secret_key,
    jwtOptions
  );
};

export default generateRefreshToken;
