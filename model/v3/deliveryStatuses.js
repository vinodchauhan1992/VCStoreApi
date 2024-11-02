const mongoose = require("mongoose");
const schema = mongoose.Schema;

const deliveryStatusesSchema = new schema({
  id: {
    type: schema.Types.String,
    required: true,
  },
  deliveryStatusNumber: {
    type: schema.Types.Number,
    required: true,
  },
  code: {
    type: schema.Types.String,
    required: true,
  },
  title: {
    type: schema.Types.String,
    required: true,
  },
  dateAdded: {
    type: schema.Types.Date,
    required: true,
  },
  dateModified: {
    type: schema.Types.Date,
    required: true,
  },
});

module.exports = mongoose.model(
  "delivery_statuses_table_v3",
  deliveryStatusesSchema
);
