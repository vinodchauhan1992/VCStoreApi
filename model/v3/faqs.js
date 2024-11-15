const mongoose = require("mongoose");
const schema = mongoose.Schema;

const faqsSchema = new schema({
  id: {
    type: schema.Types.String,
    required: true,
  },
  questionNumber: {
    type: schema.Types.Number,
    required: true,
  },
  code: {
    type: schema.Types.String,
    required: true,
  },
  productID: {
    type: schema.Types.String,
    required: true,
  },
  questionDetails: {
    question: {
      type: schema.Types.String,
      required: true,
    },
    customerID: {
      type: schema.Types.String,
      required: true,
    },
  },
  answers: {
    type: [
      {
        answerID: {
          type: schema.Types.String,
          required: false,
        },
        answer: {
          type: schema.Types.String,
          required: false,
        },
        customerID: {
          type: schema.Types.String,
          required: false,
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
        dateAdded: {
          type: schema.Types.Date,
          required: false,
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
  dateModified: {
    type: schema.Types.Date,
    required: true,
  },
});

module.exports = mongoose.model("faqs_table_v3", faqsSchema);
