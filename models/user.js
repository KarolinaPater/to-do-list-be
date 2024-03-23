const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userTaskSchema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  sex: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },
  creation_date: {
    type: Date,
    default: Date.now,
  },
  edition_date: {
    type: Date,
    default: null,
  },
});

// userSchema.virtual("user", {
//   ref: "Task",
//   localField: "_id",
//   foreignField: "user",
//   justOne: false,
// });

module.exports = mongoose.model("UserTask", userTaskSchema);
