const mongoose = require("mongoose");
const schema = mongoose.Schema;
const fileUploaderSchema = require("./fileUploader");

const clientBannersSchema = new schema({
  id: {
    type: schema.Types.String,
    required: true,
  },
  clientBannerNumber: {
    type: schema.Types.Number,
    required: true,
  },
  clientBannerCode: {
    type: schema.Types.String,
    required: true,
  },
  link: {
    type: schema.Types.String,
    required: false,
  },
  imageData: fileUploaderSchema.schema,
  title: {
    type: schema.Types.String,
    required: true,
  },
  description: {
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

module.exports = mongoose.model("client_banners_table_v3", clientBannersSchema);
