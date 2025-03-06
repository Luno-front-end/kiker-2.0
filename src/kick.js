import { getTodayDate } from "./helper.js";
import DB from "./mongoDb/index.js";
import cron from "node-cron";

import dotenv from "dotenv";
dotenv.config();

const botToken = process.env.BOT_TOKEN;
const channelId = process.env.CHANNEL_ID; // ID каналу або username каналу
const mongoUri = process.env.URL_CONNECT;

const getUsersToKick = async () => {
  try {
    const dbUser = await DB.checkUserDate();

    // Отримуємо користувачів, у яких дата співпадає з вчорашньою
    const users = dbUser;

    return users;
  } catch (err) {
    console.error("Error retrieving users from database:", err);
  }
};

const sendMessageToChannel = async (message) => {
  const url = `https://api.telegram.org/bot${botToken}/sendMessage?chat_id=${channelId}&text=${encodeURIComponent(
    message
  )}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    if (data.ok) {
      console.log("Message sent to channel:", message);
    } else {
      console.error("Failed to send message:", data);
    }
  } catch (error) {
    console.error("Error sending message:", error);
  }
};

await sendMessageToChannel("The bot is running successfully!");

const kickUser = async (userId) => {
  try {
    // Видалення користувача
    const kickUrl = `https://api.telegram.org/bot${botToken}/kickChatMember?chat_id=${channelId}&user_id=${userId}`;
    const kickResponse = await fetch(kickUrl);
    const kickResult = await kickResponse.json();

    if (!kickResult.ok) {
      console.error(
        "Помилка при видаленні користувача:",
        kickResult.description
      );
      return;
    }

    // Зняття заборони, щоб дозволити повторне приєднання
    const unbanUrl = `https://api.telegram.org/bot${botToken}/unbanChatMember?chat_id=${channelId}&user_id=${userId}`;
    const unbanResponse = await fetch(unbanUrl);
    const unbanResult = await unbanResponse.json();

    if (!unbanResult.ok) {
      console.error(
        "Помилка при розблокуванні користувача:",
        unbanResult.description
      );
      return;
    } else {
      await DB.deletePostDate(userId, getTodayDate());
    }
  } catch (error) {
    console.error("Помилка при обробці користувача:", error);
  }
};

const main = async () => {
  const users = await getUsersToKick();

  if (users.length > 0) {
    if (users && users.length > 0) {
      for (let user of users) {
        await kickUser(user.user_id);
      }
    } else {
      console.log("No users to kick.");
    }
  }
};

// Запускаємо основну функцію

// setInterval(async () => {
//   main();
// }, process.env.TIME_CHECK);

cron.schedule("20 21 * * *", async () => {
  await main();
});
