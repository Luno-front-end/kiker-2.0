import moment from "moment";

export const dateSubs = () => {
  const correntDate = moment().format("L");

  const monthOne = correntDate.slice(0, 2);
  const dateOne = correntDate.slice(3, 5);
  const yearhOne = correntDate.slice(6, 10);
  return `${dateOne}/${monthOne}/${yearhOne}`;
};

export const nextDay = () => {
  const date = new Date();
  const year = date.getFullYear();

  const oneBackDey = 24 * 60 * 60 * 1000;
  const nextDay = date.setTime(date.getTime()) - oneBackDey;
  const newDay = new Date(nextDay);

  const month = () => {
    const month = newDay.getMonth() + 1;
    if (month < 10) {
      return `0${month}`;
    }
    return month;
  };

  const day = () => {
    const day = newDay.getDate();

    if (day < 10) {
      return `0${day}`;
    }

    return day;
  };

  return `${day()}/${month()}/${year}`;
};

export const getTodayDate = () => {
  const today = new Date();
  const day = String(today.getDate()).padStart(2, "0"); // Завжди двозначний формат для дня
  const month = String(today.getMonth() + 1).padStart(2, "0"); // Місяці починаються з 0, тому додаємо 1
  const year = today.getFullYear();

  return `${day}/${month}/${year}`;
};

// module.exports = { dateSubs, nextDay, getTodayDate };
