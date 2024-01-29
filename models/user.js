const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },

  role: {
    type: String,
    default: "user",
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

userSchema.virtual("user", {
  ref: "Product",
  localField: "_id",
  foreignField: "user",
  justOne: false,
});

module.exports = mongoose.model("User", userSchema);
