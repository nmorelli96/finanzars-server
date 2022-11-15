import mongoose from "mongoose";

const Schema = mongoose.Schema;

const CotizacionesSchema = new Schema({
  "ask": Number,
  "totalAsk": Number,
  "bid": Number,
  "totalBid": Number,
  "time": Number
})

let BancosSchema = new Schema({
  "plus": CotizacionesSchema,
  "cambioar": CotizacionesSchema,
  "bna": CotizacionesSchema,
  "rebanking": CotizacionesSchema,
  "santander": CotizacionesSchema,
  "galicia": CotizacionesSchema,
  "bbva": CotizacionesSchema,
  "patagonia": CotizacionesSchema,
  "macro": CotizacionesSchema,
  "hsbc": CotizacionesSchema,
  "bapro": CotizacionesSchema,
  "ciudad": CotizacionesSchema,
  "brubank": CotizacionesSchema,
  "supervielle": CotizacionesSchema,
  "icbc": CotizacionesSchema,
  "hipotecario": CotizacionesSchema,
});

export default mongoose.model("Banco", BancosSchema);