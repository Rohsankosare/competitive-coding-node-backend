const express = require("express");
const authenticateUser = require("../auth/authenticationToken");
const ProblemModel = require("../database/Models/problemModel");
const userProfileModel = require("../database/Models/userProfileModel");

const problemRoutes = express.Router();


// create new problem
problemRoutes.post("/createproblem", authenticateUser, async (req, res) => {
  try {
    const problemTitle = req.body.problemTitle;
    const problemDes = req.body.problemDes;
    const problemSampleInput = req.body.problemSampleInput;
    const problemSampleOutput = req.body.problemSampleOutput;
    const problemTestCases = req.body.problemTestCases;

    const auther = await userProfileModel.findById(req.user.userObjectId);

    const problem = new ProblemModel({
      auther: auther["_id"],
      title: problemTitle,
      problemDes: problemDes,
      sampleInput: problemSampleInput,
      sampleOutput: problemSampleOutput,
      testCase: problemTestCases,
    });
    problem.save();

    res.json({ successa: true, message: "problem created successfuly" });
  } catch (err) {
    console.log(err);
    res.json({ successa: false, message: err });
  }
});

// get problems
problemRoutes.get("/getproblems", async (req, res) => {
  try {
    const problems = await ProblemModel.find()
      .select("_id title  auther ")
      .populate("auther", "username");

    res.json({ problems });
  } catch (err) {
    res.json({ err });
  }
});

//get single problem
problemRoutes.get("/getproblem", async (req, res) => {
  try {
    const problemId = req.query.problemId;
    const problem = await ProblemModel.findById(problemId).populate(
      "auther",
      "username _id "
    );

    res.json(problem);
  } catch (err) {
    res.json({ err });
  }
});

module.exports = problemRoutes;
