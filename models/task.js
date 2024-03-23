const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const taskSchema = new Schema({
  description: {
    type: String,
    required: true,
  },
  done: {
    type: String,
    required: false,
  },
});

module.exports = mongoose.model("Task", taskSchema);
