const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  last_name: {
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
  orcid_number: {
    type: String,
    require: false,
  },
  affiliation: {
    type: String,
    require: false,
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

userSchema.virtual("hardware", {
  ref: "Hardware",
  localField: "_id",
  foreignField: "user",
  justOne: false,
});

module.exports = mongoose.model("User", userSchema);
