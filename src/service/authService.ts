import { IUser } from "../detinitions";
import User from "../model/userModel";

interface IUserCredentials {
  email: string;
  password: string;
}
export const loginService = async (userCredentials: IUserCredentials) => {
  const { email, password } = userCredentials;
  const user: IUser | null = await User.findOne({ email });
  if (user && (await user.matchPassword(password))) return user;
  else return null;
};
