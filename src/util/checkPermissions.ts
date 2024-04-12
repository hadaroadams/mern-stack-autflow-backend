import mongoose, { Types } from "mongoose";
import { Unauthorized } from "../errors";
import { TokenUser } from "../interfaces/UserRequest";

export const checkPermission = (
  requestUser: TokenUser,
  resourcesUserId: mongoose.Types.ObjectId | mongoose.Schema.Types.ObjectId
) => {
  console.log(requestUser);
  console.log(resourcesUserId);
  if (requestUser.role === "admin") return;
  if (requestUser.userId === resourcesUserId.toString()) {
    throw new Unauthorized("Not authorized to access this route");
  }
};
