import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  _id: { type: String, required: true }, // Clerk ID (string)
  email: { type: String, required: true },
  full_name: { type: String },
  username: { type: String },
  profile_picture: { type: String },
  bio: { type: String, default: "Hey there! I am using PingUp" },
  location: { type: String },
  followers: [{ type: String, ref: "User" }],
  following: [{ type: String, ref: "User" }],
  connections: [{ type: String, ref: "User" }],
});

const User = mongoose.model("user", userSchema);
export default User;
