import mongoose from "mongoose";

const Schema = mongoose.Schema;

let fiatSchema = new Schema({
  "oficial": Number,
  "solidario": Number,
  "blue": Number,
  "mep": Number,
  "ccl": Number,
  "time": Number
});

var fiatModel = mongoose.model("fiat", fiatSchema, "fiat");

export {fiatModel}; 