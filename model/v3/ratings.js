const mongoose = require("mongoose");
const schema = mongoose.Schema;

const ratingsSchema = new schema({
  id: {
    type: schema.Types.String,
    required: true,
  },
  customerID: {
    type: schema.Types.String,
    required: true,
  },
  productID: {
    type: schema.Types.String,
    required: true,
  },
  review: {
    type: schema.Types.String,
    required: true,
  },
  ratings: {
    maxRating: {
      type: schema.Types.Number,
      required: true,
    },
    rating: {
      type: schema.Types.Number,
      required: true,
    },
  },
  likedBy: {
    type: [
      {
        customerID: {
          type: schema.Types.String,
        },
      },
    ],
    default: [],
    required: false,
  },
  dislikedBy: {
    type: [
      {
        customerID: {
          type: schema.Types.String,
        },
      },
    ],
    default: [],
    required: false,
  },
  abuseReportedBy: {
    type: [
      {
        customerID: {
          type: schema.Types.String,
        },
      },
    ],
    default: [],
    required: false,
  },
  dateAdded: {
    type: schema.Types.Date,
    required: true,
  },
});

module.exports = mongoose.model("ratings_table_v3", ratingsSchema);
