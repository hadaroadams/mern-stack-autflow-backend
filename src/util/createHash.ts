const { createHash } = require("crypto");

export const hashString = (string: string) =>
  createHash("md5").update(string).digest("hex");
