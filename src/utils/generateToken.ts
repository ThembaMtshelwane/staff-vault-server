import { NODE_ENV } from "../constants/env.const";
import { CookieOptions, Response } from "express";
import generateAccessToken from "./generateAccessToken";
import { IUser } from "../detinitions";
import generateRefreshToken from "./generateRefreshToken";

const generateToken = async (res: Response, user: IUser) => {
  try {
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    console.log("refreshToken  ", refreshToken);

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
  if (!res.headersSent) {
    console.log("set refresh cookie ", refreshToken);

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
  maxAge: 1000 * 15,
  path: "/api",
});

const refreshCookieOptions = (): CookieOptions => ({
  httpOnly: true,
  sameSite: "strict",
  secure: NODE_ENV === "production",
  maxAge: 1000 * 60 * 60 * 24 * 90,
  path: "/api",
});

export default generateToken;
