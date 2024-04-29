const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const taskSchema = new Schema({
  description: {
    type: String,
    required: true,
  },
  done: {
    type: Boolean,
    required: false,
  },
  user: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Task", taskSchema);
