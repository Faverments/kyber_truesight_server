const mongoose = require("mongoose");
const { MODELS, FILTER } = require("../constances");
const { TrueSightTokenData } = require("./trueSightResponde");
const Schema = mongoose.Schema;

const LastPredicted = {
  order: Number,
  rank: Number,
  predicted_date: Number,
  market_cap: Number,
  number_holders: Number,
  trading_volume: Number,
  price: Number,
  discovered_on: Number,
  // _id in predicted history
  price_change_percentage_24h: Number | undefined,
  _id: Schema.Types.ObjectId,
};

const discovered = {
  discovered_details: {
    price_discovered: Number,
    trading_volume_discovered: Number,
    market_cap_discovered: Number,
    number_holders_discovered: Number,
  },
  discovered_on: Number,
};

const TrueSightTokenFilterData = {
  ...TrueSightTokenData,
  filter: [String | undefined] | [],
  last_predicted: LastPredicted | null,
  discovered_trending_data: discovered | null,
};

const TrueSightFilterSchema = new Schema({
  createAt: {
    type: Date,
    default: Date.now,
  },
  // status: Number,
  // message: String,
  data: {
    total_number_tokens: Number,
    tokens: [TrueSightTokenFilterData],
  },
});
mongoose.model(MODELS.TRUE_SIGHT_FILTER_24h, TrueSightFilterSchema);
mongoose.model(MODELS.TRUE_SIGHT_FILTER_7d, TrueSightFilterSchema);
