import { TokenUser } from "../interfaces/UserRequest";

export const createTokenUser = (user: any):TokenUser => {
  return { name: user.name, userId: user._id, role: user.role };
};
