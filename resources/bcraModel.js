import mongoose from "mongoose";

const Schema = mongoose.Schema;

const innerSchema = new Schema({
  "d": String,
  "v": Number
})

const UVASchema = new Schema({
  "uva": [innerSchema]
})

export default mongoose.model("Bcra", UVASchema, "bcra");