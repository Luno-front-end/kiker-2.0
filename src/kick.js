const { getTodayDate } = require("./helper");

const DB = require("./mongoDb/index");

require("dotenv").config();

const botToken = process.env.BOT_TOKEN;
const channelId = process.env.CHANNEL_ID; // ID каналу або username каналу
const mongoUri = process.env.URL_CONNECT;

console.log(mongoUri);

async function getUsersToKick() {
  try {
    const dbUser = await DB.checkUserDate();

    console.log("collection");

    // Отримуємо користувачів, у яких дата співпадає з вчорашньою
    const users = dbUser;

    return users;
  } catch (err) {
    console.error("Error retrieving users from database:", err);
  }
}

async function sendMessageToChannel(message) {
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
}

const kickUser = async (userId) => {
  const url = `https://api.telegram.org/bot${botToken}/kickChatMember?chat_id=${channelId}&user_id=${userId}`;

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
    console.log("Користувач видалений:", userId);

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
    console.log("Користувача розблоковано:", userId);
  } catch (error) {
    console.error("Помилка при обробці користувача:", error);
  }
};

async function main() {
  const users = await getUsersToKick();
  console.log(users);

  if (users.length > 0) {
    if (users && users.length > 0) {
      for (let user of users) {
        await kickUser(user.user_id);
      }
    } else {
      console.log("No users to kick.");
    }
    await sendMessageToChannel("The bot is running successfully!");
  }
}

// Запускаємо основну функцію

setInterval(async () => {
  main();
}, process.env.TIME_CHECK);
