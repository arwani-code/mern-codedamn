const mongoose = require("mongoose");

const user = mongoose.Schema(
  {
    name: { type: String, require: true },
    email: { type: String, require: true, uniqe: true },
    password: { type: String, require: true },
    quote: { type: String },
  },
  { collection: "user-data" }
);

const Model = mongoose.model("products]", user);

module.exports = Model;
