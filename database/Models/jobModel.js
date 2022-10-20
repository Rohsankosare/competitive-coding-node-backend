const mongoose = require("mongoose");

const JobSchema = mongoose.Schema({
  filepath: {
    type: String,
    required: true,
  },
  language: {
    type: String,
    required: true,
  },
  submittedAt: {
    type: Date,
    required: true,
  },
  startedAt: {
    type: Date,
  },
  completedAt: {
    type: Date,
  },
  output: {
    type: String,
  },
  input: {
    type: String,
  },
  status: {
    type: String,
    default: "pending",
    enum: ["pending", "success", "error"],
  },
  isCompiled:{
    type:Boolean,
    default:false
  }
});

const JobModel = mongoose.model("jobs", JobSchema);

module.exports = JobModel;
