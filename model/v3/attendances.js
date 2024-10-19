const mongoose = require("mongoose");
const schema = mongoose.Schema;

const attendancesSchema = new schema({
  id: {
    type: schema.Types.String,
    required: true,
  },
  employeeID: {
    type: schema.Types.String,
    required: true,
  },
  checkedInStatus: {
    type: schema.Types.String, // Present, Absent, Half Day
    required: true,
  },
  checkinDateData: {
    checkinDate: {
      type: schema.Types.Date,
      required: true,
    },
    day: {
      type: schema.Types.String,
      required: true,
    },
    dateInNumber: {
      type: schema.Types.Number,
      required: true,
    },
    monthInNumber: {
      type: schema.Types.Number,
      required: true,
    },
    year: {
      type: schema.Types.Number,
      required: true,
    },
    fullMonth: {
      type: schema.Types.String,
      required: true,
    },
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

module.exports = mongoose.model("attendances_table_v3", attendancesSchema);
