const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const hardwareSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  company: {
    type: String,
    require: true,
  },

  availabillity: {
    type: Boolean,
    default: true,
  },
  inRepair: {
    type: Boolean,
    default: false,
  },
  creationDate: {
    type: Date,
    default: Date.now,
  },
  editDate: {
    type: Date,
    require: false,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: false,
  },
});

module.exports = mongoose.model("Hardware", hardwareSchema);
