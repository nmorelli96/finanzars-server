import express from "express";
const app = express();
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
console.log('directory-name', __dirname);
const PORT = process.env.PORT || 4000;
import mongoose from "mongoose";
const router = express.Router();
import dotenv from "dotenv";
dotenv.config();
import fetch from 'node-fetch';
//app.use(express.static(path.join(__dirname, "/public")));
app.use(cors());

const uri = process.env.REACT_APP_MONGODB_URI;

mongoose.connect(`mongodb+srv://${uri}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const connection = mongoose.connection;

connection.once("open", function () {
  console.log("Connection with MongoDB was successful");
});

app.use("/", router);

app.get('/', (req, res) => {
  res.send('Complete the URL with the desired API JSON')
})

app.listen(PORT, function () {
  console.log("Server is running on Port: " + PORT);
});

import { fiatModel } from "../resources/fiatModel.js";

import banco from "../resources/bancosModel.js";

import { binanceSellUSDT, binanceBuyUSDT, binanceSellDAI, binanceBuyDAI } from "../resources/binanceModel.js";

import { cryptosModel } from "../resources/cryptosModel.js";

import bcraUVA from "../resources/bcraModel.js"

function routeAPIs(route, collection) {
  router.route(route).get(function (req, res) {
    collection.find({}, function (err, result) {
      if (err) {
        res.send(err);
      } else {
        res.send(result);
      }
    });
  });
}

routeAPIs("/getFiat", fiatModel);
routeAPIs("/getBancos", banco);
routeAPIs("/getBinanceUSDTs", binanceSellUSDT);
routeAPIs("/getBinanceUSDTb", binanceBuyUSDT);
routeAPIs("/getBinanceDAIs", binanceSellDAI);
routeAPIs("/getBinanceDAIb", binanceBuyDAI);
routeAPIs("/getCryptos", cryptosModel);
routeAPIs("/getUVA", bcraUVA);

function fetchFiat() {
  fetch("https://criptoya.com/api/dolar")
    .then((response) => response.json())
    .then((responseJson) => {
      fiatModel.findOneAndReplace({}, responseJson, { returnDocument: 'after' },
        function (err, res) { err ? console.log(err) : console.log(res) }
      )
    })
    .catch(function (err) {
      console.log("Unable to fetch -", err);
    });
}

function fetchBancos() {
  fetch("https://criptoya.com/api/bancostodos")
    .then((response) => response.json())
    .then((responseJson) => {
      banco.findOneAndReplace({}, responseJson, { returnDocument: 'after' },
        function (err, res) { err ? console.log(err) : console.log(res) })
    })
    .catch(function (err) {
      console.log("Unable to fetch -", err);
    });
}

function fetchBinance(operation, coin, model) {
  fetch(`https://criptoya.com/api/binancep2p/${operation}/${coin}/ars/15`)
    .then((response) => response.json())
    .then((responseJson) => {
      let originalData = responseJson.data;
      let filteredData = originalData.find(elem =>
        elem.adv.tradeMethods[0].tradeMethodName.includes("Mercadopago") || 
        elem.adv.tradeMethods[0].tradeMethodName.includes("Lemon") ||
        elem.adv.tradeMethods[0].tradeMethodName.includes("Reba") ||
        elem.adv.tradeMethods[0].tradeMethodName.includes("Brubank") ||
        elem.adv.tradeMethods[0].tradeMethodName.includes("Belo") ||
        elem.adv.tradeMethods[0].tradeMethodName.includes("Uala"));
      //let test = filteredData.advertiser.nickName;
      //console.log(test)
      responseJson.data = filteredData;
      responseJson['trader'] = responseJson.data.advertiser.nickName;
      responseJson['tradeMethod'] = responseJson.data.adv.tradeMethods[0].tradeMethodName;
      responseJson['price'] = responseJson.data.adv.price;
      delete responseJson.data;
      model.findOneAndReplace({}, responseJson, { returnDocument: 'after' },
        function (err, res) { err ? console.log(err) : console.log(res) }
      )
    })
    .catch(function (err) {
      console.log("Unable to fetch -", err);
    })
}

function fetchCryptos() {
  return Promise.all([
    fetch('https://criptoya.com/api/belo/usdt/ars').then(resp => resp.json()),
    fetch('https://criptoya.com/api/buenbit/dai/ars').then(resp => resp.json()),
    fetch('https://criptoya.com/api/lemoncash/usdt').then(resp => resp.json()),
    fetch('https://criptoya.com/api/ripio/usdc').then(resp => resp.json()),
    fetch('https://criptoya.com/api/satoshitango/dai/ars').then(resp => resp.json()),
  ]).then((responseJson) => {
    let exchanges = ['Belo', 'Buenbit', 'Lemon', 'Ripio', 'SatoshiTango'];
    let coins = ['USDT', 'DAI', 'USDT', 'USDC', 'DAI'];
    let api = responseJson;
    let newApi = [];
    for (let i = 0; i < Object.keys(api).length; i++) {
      newApi.push({
        id: i + 3,
        banco: exchanges[i],
        coin: coins[i],
        compra: api[i].totalBid.toFixed(2),
        venta: api[i].totalAsk.toFixed(2),
        time: api[i].time
      })
    }
    let mappedJson = {
      "cryptos": newApi
    }
    cryptosModel.findOneAndReplace({}, mappedJson, { returnDocument: 'after' },
      function (err, res) { err ? console.log(err) : console.log(res) }
    )
  })
    .catch(function (err) {
      console.log("Unable to fetch -", err);
    })
}

function fetchUVA() {
  fetch('https://api.estadisticasbcra.com/uva', fetchUVAOptions)
    .then((response) => response.json())
    .then((responseJson) => {
      /*let mappedJson = responseJson.map(elem => ({
        "fecha": elem.d,
        "valor": elem.v
      }))
    */
      let lastUVA = responseJson[responseJson.length - 1];
      //console.log(lastUVA);
      let mappedJson = {
        "uva": lastUVA
        //responseJson.filter(elem => elem.d > new Date(new Date().getTime() - 86400000 - 21600000).toJSON().slice(0, 10))
      }
      /*.reduce((obj, fecha) => {
        obj[fecha.d] = fecha.v;
        return obj;
      }, {});*/
      bcraUVA.findOneAndReplace({}, mappedJson, { returnDocument: 'after' },
        function (err, res) { err ? console.log(err) : console.log(res) }
      )
    })
    .catch(function (err) {
      console.log("Unable to fetch -", err);
    })
}

var fetchUVAOptions = {
  method: 'GET',
  headers: {
    'Authorization': 'BEARER eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2OTU0MzU5MTgsInR5cGUiOiJleHRlcm5hbCIsInVzZXIiOiJtb3JlbGxpbmljb2xhczk2QGdtYWlsLmNvbSJ9._CuSglwVRZNdDAe6HAn-bLJOTH54nYoiLPc_kYU279MdfPm1W6LYmdb7ELtlIesE1aD2mCdnxsJU7cdqa6kvbQ'
    //'Authorization': 'BEARER eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2OTczMjczMjksInR5cGUiOiJleHRlcm5hbCIsInVzZXIiOiJtb3JlbGxpbmljb2xhczk2QGhvdG1haWwuY29tIn0.m8UJCXEXY4Xw92Ehb8n1dEtrnHFz-2sMvCRkNDJPz9_8EthT2iw_jyoHumLF8hY1gTpXYgxZKMKbVj7mlrDqdg'
  }
}


fetchFiat();
fetchBancos();
fetchBinance("buy", "usdt", binanceSellUSDT);
fetchBinance("sell", "usdt", binanceBuyUSDT);
fetchBinance("buy", "dai", binanceSellDAI);
fetchBinance("sell", "dai", binanceBuyDAI);
fetchCryptos();
fetchUVA();


setInterval(function () {
  fetchFiat();
  fetchBancos();
}, 300000);

setInterval(function () {
  fetchBinance("buy", "usdt", binanceSellUSDT);
  fetchBinance("sell", "usdt", binanceBuyUSDT);
  fetchBinance("buy", "dai", binanceSellDAI);
  fetchBinance("sell", "dai", binanceBuyDAI);
  fetchCryptos()
}, 300000);

setInterval(function () {
  fetchUVA();
}, 900000);