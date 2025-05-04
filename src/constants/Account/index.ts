const marketOptions = {
  B3: "Bolsa Brasileira (B3)",
  CRYPTO: "Criptomoedas",
  FOREX: "Forex",
};

const currencyOptions = {
  AUD: "Dólar Australiano",
  BRL: "Real Brasileiro",
  CAD: "Dólar Canadense",
  CHF: "Franco Suíço",
  CZK: "Coroa Tcheca",
  EUR: "Euro",
  GBP: "Libra Esterlina",
  USD: "Dólar Americano",
};

const platformOptions = {
  MT4: "MetaTrader 4",
  MT5: "MetaTrader 5",
  CTRADER: "cTrader",
  DX_TRADE: "DxTrade",
  MATCH_TRADER: "Match Trader",
  TRADE_LOCKER: "Trade Locker",
  PROFIT: "Profit",
};

const brokerOptions = [
  { value: "FTMO", isPropFirm: true },
  { value: "FundedNext", isPropFirm: true },
  { value: "FXIFY", isPropFirm: true },
  { value: "Hantec Trader", isPropFirm: true },
  { value: "The5ers", isPropFirm: true },
]
  .sort((a, b) => (a.value > b.value ? 1 : b.value > a.value ? -1 : 0))
  .concat({ value: "Outro", isPropFirm: false });

export { marketOptions, currencyOptions, platformOptions, brokerOptions };
