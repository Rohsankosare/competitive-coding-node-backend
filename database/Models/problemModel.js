const mongoose = require("mongoose");

const problemSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },

  problemStatement: {
    type: String,
    required: true,
  },
  sampleInput: {
    type: String,
  },
  sampleOutput: {
    type: String,
  },

  auther: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "usersProfileData",
    require: [true, "username is required for creating post"],
  },
  testCase: []
});

const problemModel = mongoose.model("problem",problemSchema);
module.exports = problemModel;