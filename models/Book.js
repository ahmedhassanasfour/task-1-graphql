const { Schema, model, Types } = require("mongoose");

const StudentSchema = new Schema({
  price: { type: Number, required: true },
  author: { type: Types.ObjectId, ref: "Author", required: true },
});

module.exports = model("Book", StudentSchema);
