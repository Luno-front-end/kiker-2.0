const mongoose = require("mongoose");
const moment = require("moment");

const SubsUsersSchema = require("./schemas");
// "mongodb://localhost:27017",

require("dotenv").config();
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

const deletePostDate = async (userId, deleteDay) => {
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

const checkUserDate = async () => {
  try {
    connectDb();

    // Отримати вчорашню дату у форматі "DD/MM/YYYY"
    const yesterday = moment().subtract(1, "days").format("DD/MM/YYYY");

    // Шукаємо дати, які менші або дорівнюють вчорашній
    const usersWithYesterdayDate = await SubsUsersSchema.find({
      "payment.dateEnd": { $lte: yesterday }, // Дата менша або дорівнює вчорашній
      deleteDate: null, // deleteDate має бути null
    }).lean();

    return usersWithYesterdayDate;
  } catch (error) {
    console.error("Помилка при пошуку користувачів:", error);
    return [];
  }
};

module.exports = {
  deletePostDate,
  checkUserDate,
};
