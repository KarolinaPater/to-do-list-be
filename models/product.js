const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const productSchema = new Schema({
  brand: {
    type: String,
    required: true,
  },
  main_category: {
    type: String, // main category enum
    required: true,
  },
  secondary_category: {
    type: String, //secondary category enum
    required: true,
  },
  product_short_name: {
    type: String,
    required: true,
  },
  product_description: {
    type: String,
    required: false,
  },
  product_capacity: {
    type: String,
    required: false,
  },
  unit_of_capacity: {
    type: String, // enum
    require: false,
  },
  starting_date: {
    type: Date,
    require: false,
  },
  ending_date: {
    type: Date,
    require: false,
  },
  period_after_opening: {
    type: String,
    require: false,
  },
  expiration_date: {
    type: Date,
    require: false,
  },
  final_expiration_date: {
    type: Date,
    require: false,
  },

  product_price: {
    type: String,
    require: false,
  },

  user: {
    type: String,
    require: false,
  },

  creation_date: {
    type: Date,
    default: Date.now,
  },
  edit_date: {
    type: Date,
    require: false,
  },
  status: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
});

module.exports = mongoose.model("Product", productSchema);
