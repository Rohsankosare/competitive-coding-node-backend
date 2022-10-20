const Queue = require("bull");
const JobModel = require("../database/Models/jobModel");

const fs = require("fs");

const runFile = require("./runFile");

const JobQueue = Queue("job-queue");
const MAX_WROKERS = 5;

const addJobToQueue = async (jobId) => {
  await JobQueue.add({ id: jobId });
};

JobQueue.process(MAX_WROKERS, async ({ data }) => {
  const { id: jobId } = data;
  const job = await JobModel.findById(jobId);

  if (job === undefined) throw Error("Job not found");

  try {
    runFile(jobId);
  } catch (err) {
    console.log(err);
  }
});

module.exports = addJobToQueue;
