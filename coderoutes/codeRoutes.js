const express = require("express");
const fs = require("fs");
const generateFile = require("./generateFile");

const JobModel = require("../database/Models/jobModel");
const addJobToQueue = require("./jobQueue");

const codeRoutes = express.Router();

codeRoutes.get("/status", async (req, res) => {
  const jobId = req.query.id;

  if (jobId === undefined)
    return res.json({ success: false, error: "missing job id" });

  try {
    const job = await JobModel.findById(jobId);

    if (job === undefined)
      return res.json({ success: false, error: "invalid job id" });

    res.json({ success: true, job });
  } catch (err) {
    return res.json(err);
  }
});

codeRoutes.post("/runall", async (req, res) => {
  const { code, language, input } = req.body;

  //  if code body is empty send res 400 and error
  if (code === undefined || code === "")
    return res.json({ success: false, error: "code body is empty" });

  if (language === undefined )
    return res.json({
      success: false,
      error: `${language} type code is not supported`,
    });

  let job;
  try {
    const filepath = await generateFile(language, code);

    job = await new JobModel({
      filepath: filepath,
      submittedAt: Date.now(),
      language: language,
      input:input
    }).save();
   

    if (job) {
      const jobId = job["_id"];
      addJobToQueue(jobId);
      return res.json({ success: true, jobId });
    }
  } catch (err) {
    res.send({ success: false, error: err });
  }
});


// submit code with 
codeRoutes.post("/submit", async (req, res) => {
  const { code, language, input,problemId,userId } = req.body;

  //  if code body is empty send res 400 and error
  if (code === undefined || code === "")
    return res.json({ success: false, error: "code body is empty" });

  if (language === undefined )
    return res.json({
      success: false,
      error: `${language} type code is not supported`,
    });

  let job;
  try {
    const filepath = await generateFile(language, code);

    job = await new JobModel({
      filepath: filepath,
      submittedAt: Date.now(),
      language: language,
    }).save();
   

    if (job) {
      const jobId = job["_id"];
      addJobToQueue(jobId);
      return res.json({ success: true, jobId });
    }
  } catch (err) {
    res.send({ success: false, error: err });
  }
});


module.exports = codeRoutes;