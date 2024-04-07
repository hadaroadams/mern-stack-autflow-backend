import { Schema, model } from "mongoose";
import validator, { isEmail, isStrongPassword } from "validator";
import bcrypt from "bcryptjs";

interface User {
  name: string;
  email: string;
  password: string;
  role: string;
  verificationToken: string;
  isVerified: boolean;
  verified: Date;
  passwordToken: string | null;
  passwordTokenExpirationDate: Date | null | undefined;
  comparePassword: (candidatesPassword: string) => boolean;
}

const UserSchema = new Schema<User>({
  name: {
    type: String,
    required: [true, "Please provide name"],
    minlength: 3,
    maxlength: 50,
  },
  email: {
    type: String,
    unique: true,
    required: [true, "Please provide email"],
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Please provide a valid email",
    ],
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minlength: 6,
    // validate: {
    //   validator: isStrongPassword,
    //   message: "Provide a stronger password",
    // },
  },
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  },
  verificationToken: String,
  isVerified: {
    type: Boolean,
    default: false,
  },
  passwordToken: {
    type: String,
  },
  passwordTokenExpirationDate: {
    type: Date,
  },
});

UserSchema.pre("save", async function () {
  console.log(this.modifiedPaths());
  console.log(this.isModified("name"));
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(16);
  const hash = bcrypt.hash(this.password, salt);
  this.password = await hash;
});

UserSchema.methods.comparePassword = async function (
  candidatesPassword: string
) {
  return await bcrypt.compare(candidatesPassword, this.password);
};

export default model("User", UserSchema);
