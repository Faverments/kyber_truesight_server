const mongoose = require("mongoose");
const { MODELS } = require("../monitor/constances");
const Schema = mongoose.Schema;
const TrueSightTokenData = {
  token_id: Number,
  id_of_sources: {
    CoinGecko: String,
    CoinMarketCap: String,
  },
  order: Number,
  name: String,
  symbol: String,
  rank: Number | undefined, // Trending soon only
  logo_url: String,
  official_web: String,
  platforms: {
    // [p: String]: String
  },
  present_on_chains: [String],
  predicted_date: Number | undefined, // Trending soon only
  market_cap: Number,
  number_holders: Number,
  trading_volume: Number,
  price: Number,
  social_urls: {
    // [p: String]: String
  },
  discovered_on: Number,
  tags: [String] | null,
  // IN_DEV MIGRATE TO MONGO
  price_change_percentage_24h: Number | undefined, // undefined for old data
  discovered_details:
    {
      price_discovered: Number,
      trading_volume_discovered: Number,
      market_cap_discovered: Number,
      number_holders_discovered: Number,
    } | undefined, // Trending only
};
exports.TrueSightTokenData = TrueSightTokenData;
const TrueSightResponseSchema = new Schema({
  createAt: {
    type: Date,
    default: Date.now,
  },
  status: Number,
  message: String,
  data: {
    total_number_tokens: Number,
    tokens: [TrueSightTokenData],
  },
});
mongoose.model(MODELS.TRUE_SIGHT_RESPONSE_24H, TrueSightResponseSchema);
mongoose.model(MODELS.TRUE_SIGHT_RESPONSE_7D, TrueSightResponseSchema);
mongoose.model(MODELS.TRENDING_RESPONSE_24H, TrueSightResponseSchema);
mongoose.model(MODELS.TRENDING_RESPONSE_7D, TrueSightResponseSchema);
