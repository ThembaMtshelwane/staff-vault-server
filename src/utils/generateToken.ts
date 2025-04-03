import { NODE_ENV } from "../constants/env.const";
import { CookieOptions, Response } from "express";
import generateAccessToken from "./generateAccessToken";
import { IUser } from "../detinitions";
import generateRefreshToken from "./generateRefreshToken";
import { after90Days } from "../constants/date.consts";

const generateToken = async (res: Response, user: IUser) => {
  try {
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    user.refreshToken = refreshToken;
    await user.save();

    setAuthCookies(res, accessToken, refreshToken);

    return { accessToken, refreshToken };
  } catch (error) {
    console.error("Error generating tokens:", error);
    throw new Error("Failed to generate tokens");
  }
};

const setAuthCookies = (
  res: Response,
  accessToken: string,
  refreshToken: string
) => {
  console.log(res.headersSent);

  if (!res.headersSent) {
    res.cookie("accessToken", accessToken, accessCookieOptions());
    res.cookie("refreshToken", refreshToken, refreshCookieOptions());
  } else {
    console.error("Headers already sent; cannot set cookies.");
  }
};

const accessCookieOptions = (): CookieOptions => ({
  httpOnly: true,
  sameSite: "strict",
  secure: NODE_ENV === "production",
  expires: after90Days(),
  path: "/api",
});

const refreshCookieOptions = (): CookieOptions => ({
  httpOnly: true,
  sameSite: "strict",
  secure: NODE_ENV === "production",
  expires: after90Days(),
  path: "/api/refresh",
});

export default generateToken;
