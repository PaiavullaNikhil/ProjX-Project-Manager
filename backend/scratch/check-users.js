import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/user.js";

dotenv.config();

async function checkUsers() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const users = await User.find({}, 'email isEmailVerified');
    console.log("Users in DB:", users);
    await mongoose.disconnect();
  } catch (err) {
    console.error(err);
  }
}

checkUsers();
