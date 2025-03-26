import { ADMIN_PASSWORD, USER_PASSWORD } from "../constants/env.const";
import { BAD_REQUEST } from "../constants/http.codes";
import { IDepartmentBasicInfo, IUser } from "../detinitions";
import User from "../model/userModel";
import HTTP_Error from "../utils/httpError";
import { removeDuplicates } from "../utils/utils";

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

  const userExists: IUser | null = await User.findOne({ email });

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

export const massStaffRegistrationService = async (
  input: string[] | IDepartmentBasicInfo[]
) => {
  const { uniqueStrings: staffEmails, duplicates } = removeDuplicates(input);
  const errors: string[] = [];
  const data: IUser[] = [];
  let errorMessage = duplicates === 0 ? "" : `${duplicates} Duplicates removed`;

  if (staffEmails && staffEmails.length) {
    await Promise.all(
      staffEmails.map(async (email) => {
        let user = await User.findOne({ email });
        if (!user) {
          user = await User.create({
            email,
            permissions: ["modify_files", "modify_data"],
            password: USER_PASSWORD,
          });
          data.push(user);
        } else {
          errors.push(`${email} already exists`);
        }
      })
    );
  }

  const message = `✔ Registered: ${data.length} department out of the ${
    input.length
  } given. ${
    errors.length
      ? ` ⚠ Warning: ${errors.length} departments already exist.
    ℹ Details: ${errorMessage}`
      : ""
  }
   `;

  return { data, message, errors };
};
