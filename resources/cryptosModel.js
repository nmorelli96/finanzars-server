import mongoose from "mongoose";

const Schema = mongoose.Schema;

let innerSchema = new Schema({
  "id": Number,
  "banco": String,
  "coin": String,
  "compra": String,
  "venta": String,
  "time": Number
});

let cryptosSchema = new Schema({
  "cryptos": [innerSchema]
})

var cryptosModel = mongoose.model("cryptos", cryptosSchema, "cryptos");

export {cryptosModel}; 