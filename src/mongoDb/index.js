import dotenv from "dotenv";
import moment from "moment";
import mongoose from "mongoose";
import SubsUsersSchema from "./schemas.js";

dotenv.config();
const connectDb = () => {
  try {
    mongoose.connect(
      process.env.URL_CONNECT,

      {
        useNewUrlParser: true,
      },
      (err, client) => {
        if (err) {
          console.log("Connection error", err);
        }
      }
    );
  } catch (error) {
    console.log(error);
  }
  return mongoose.connection;
};

export const deletePostDate = async (userId, deleteDay) => {
  try {
    await SubsUsersSchema.updateOne(
      { user_id: userId },
      {
        $set: {
          deleteDate: deleteDay,
          "payment.order_status": "deleted",
          "payment.order_id": null,
        },
      }
    );
    connectDb().on("error", console.log).on("disconnect", connectDb);
  } catch (err) {
    console.error("Помилка при оновленні користувача:", err);
  }
};

export const checkUserDate = async () => {
  try {
    connectDb();

    // Отримуємо вчорашню дату у форматі "YYYY-MM-DD"
    const yesterday = moment().subtract(1, "days").format("YYYY-MM-DD");

    // Шукаємо користувачів, у яких `dateEnd` <= вчорашньої дати
    const usersWithExpiredDate = await SubsUsersSchema.find({
      "payment.dateEnd": { $lte: yesterday, $ne: null }, // $ne: null — виключає пусті значення
      deleteDate: null,
    }).lean();

    return usersWithExpiredDate;
  } catch (error) {
    console.error("Помилка при пошуку користувачів:", error);
    return [];
  }
};

export default {
  deletePostDate,
  checkUserDate,
};
