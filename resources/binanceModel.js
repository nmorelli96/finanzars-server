import mongoose from "mongoose";

const Schema = mongoose.Schema;

/*
const tradeMethodsSchema = new Schema({
  "tradeMethodName": String
})

const advertiserSchema = new Schema({
  "nickName": String
})

const advSchema = new Schema({
  "price": String,
  "tradeMethods": [tradeMethodsSchema]
})

const TraderSchema = new Schema({
  "adv": advSchema,
  "advertiser": advertiserSchema
})*/

let BinanceSchema = new Schema({
  "code": String,
  "trader": String,
  "tradeMethod": String,
  "price": String,
  //"data": [TraderSchema],
  "total": Number,
  "success": Boolean,
  "time": Number
});

var binanceSellUSDT = mongoose.model("binanceusdts", BinanceSchema, "binanceusdts");
var binanceBuyUSDT = mongoose.model("binanceusdtb", BinanceSchema, "binanceusdtb");
var binanceSellDAI = mongoose.model("binancedais", BinanceSchema, "binancedais");
var binanceBuyDAI = mongoose.model("binancedaib", BinanceSchema, "binancedaib");

export {binanceSellUSDT, binanceBuyUSDT, binanceSellDAI, binanceBuyDAI};

//export default mongoose.model("BinanceUSDT", BinanceSchema);