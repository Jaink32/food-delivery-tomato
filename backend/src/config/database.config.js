import { connect, set } from "mongoose";
import { UserModel } from "../models/user.model.js";
import { FoodModel } from "../models/food.model.js";
import { sample_users } from "../data.js";
import { sample_foods } from "../data.js";
import bcrypt from "bcryptjs";
const PASSWORD_HASH_SALT_ROUNDS = 10;
set("strictQuery", true);

export const dbConnect = async () => {
  // Mongo_URL = "mongodb+srv://jaink3265:EUU3t9NSowTiLYpF@cluster0.nmoz1mj.mongodb.net/food-mine?retryWrites=true&w=majority&appName=Cluster0";
  try {
    connect("mongodb+srv://jaink3265:EUU3t9NSowTiLYpF@cluster0.nmoz1mj.mongodb.net/food-mine?retryWrites=true&w=majority&appName=Cluster0", {

      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Force drop collections to ensure fresh data
    await UserModel.collection.drop().catch(() => {});
    await FoodModel.collection.drop().catch(() => {});

    await seedUsers();
    await seedFoods();
    console.log("connect successfully---");
  } catch (error) {
    console.log(error);
  }
};

async function seedUsers() {
  const usersCount = await UserModel.countDocuments();
  if (usersCount > 0) {
    console.log("Users seed is already done!");
    return;
  }

  for (let user of sample_users) {
    user.password = await bcrypt.hash(user.password, PASSWORD_HASH_SALT_ROUNDS);
    await UserModel.create(user);
  }

  console.log("Users seed is done!");
}

async function seedFoods() {
  const foods = await FoodModel.countDocuments();
  if (foods > 0) {
    console.log("Foods seed is already done!");
    return;
  }

  for (const food of sample_foods) {
    food.imageUrl = `/foods/${food.imageUrl}`;
    await FoodModel.create(food);
  }

  console.log("Foods seed Is Done!");
}
