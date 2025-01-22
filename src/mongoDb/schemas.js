import { Schema, model } from "mongoose";

const subsUsersSchema = new Schema({
  first_name: String,
  last_name: String,
  username: String,
  user_id: Number,
  pay: Number,
  subscribe: Number,
  order_id: String,
  order_desc: String,
  payment_id: Number,
  deleteDate: String,
  payment: {
    sender_email: String,
    order_id: String,
    order_status: String,
    rectoken: String,
    datePay: String,
    dateEnd: String,
    amount: Number,
  },
});

// module.exports = model("subsUsers", subsUsers);
const subsUsers = model("subsUsers", subsUsersSchema);

export default subsUsers;
