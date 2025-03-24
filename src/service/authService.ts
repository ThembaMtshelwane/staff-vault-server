import { ADMIN_PASSWORD, USER_PASSWORD } from "../constants/env.const";
import { BAD_REQUEST } from "../constants/http.codes";
import { IUser } from "../detinitions";
import User from "../model/userModel";
import HTTP_Error from "../utils/httpError";

interface IUserCredentials {
  email: string;
  password: string;
}

interface IUserData {
  firstName: string;
  lastName: string;
  email: string;
  position: string;
  department: string;
  supervisor: string;
  role: string;
}

export const loginService = async (userCredentials: IUserCredentials) => {
  const { email, password } = userCredentials;
  const user: IUser | null = await User.findOne({ email });
  if (user && (await user.matchPassword(password))) return user;
  else return null;
};

export const addUserService = async (userData: IUserData) => {
  const { firstName, lastName, email, position, department, role, supervisor } =
    userData;
  const userExists = await User.findOne({ email });

  if (userExists) {
    throw new HTTP_Error(
      `This email already exists within our database.`,
      BAD_REQUEST
    );
  }

  const user = {
    firstName: firstName || "Not Available",
    lastName: lastName || "Not Available",
    email,
  };

  if (role === "admin") {
    return await User.create({
      ...user,
      position: "admin",
      permissions: ["add_user", "suspend_user"],
      role: "admin",
      password: ADMIN_PASSWORD,
    });
  }

  return await User.create({
    ...user,
    position: position || "Not Available",
    department,
    password: USER_PASSWORD,
    supervisor,
  });
};
