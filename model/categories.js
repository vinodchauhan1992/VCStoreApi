const mongoose = require("mongoose");
const schema = mongoose.Schema;

const categoriesSchema = new schema({
  id: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: String,
});

module.exports = mongoose.model("categories", categoriesSchema);
