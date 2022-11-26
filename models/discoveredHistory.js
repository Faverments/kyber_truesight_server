const mongoose = require("mongoose");
const { MODELS } = require("../constances");
const Schema = mongoose.Schema;

const discovered = {
  discovered_details: {
    price_discovered: Number,
    trading_volume_discovered: Number,
    market_cap_discovered: Number,
    number_holders_discovered: Number,
  },
  discovered_on: Number,
  // order: Number,
  // rank: Number | undefined, // Trending soon only
  // predicted_date: Number | undefined, // Trending soon only
  // market_cap: Number,
  // number_holders: Number,
  // trading_volume: Number,
  // price: Number,
  // discovered_on: Number,
  // price_change_percentage_24h: Number | undefined, // undefined for old data
};
const discoveredHistorySchema = new Schema({
  token_id: Number,
  id_of_sources: {
    CoinGecko: String,
    CoinMarketCap: String,
  },
  name: String,
  symbol: String,
  // logo_url: String,
  // official_web: String,
  // platforms: {
  //   // [p: String]: String
  // },
  // present_on_chains: [String],
  // social_urls: {
  //   // [p: String]: String
  // },
  // tags: [String] | null,
  discovereds: [discovered],
  createAt: {
    type: Date,
    default: Date.now,
  },
});
mongoose.model(MODELS.DISCOVERED_HISTORY_24h, discoveredHistorySchema);
mongoose.model(MODELS.DISCOVERED_HISTORY_7d, discoveredHistorySchema);
