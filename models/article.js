const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const articleSchema = new Schema({
  doi_number: {
    type: String,
    required: true,
  },
  article_theme: {
    type: String,
    required: true,
  },
  authors: {
    type: String,
    required: true,
  },
  sources: {
    type: String,
    required: true,
  },
  summary: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    require: false,
  },
  creation_date: {
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
    required: true,
  },
});

module.exports = mongoose.model("Article", articleSchema);
