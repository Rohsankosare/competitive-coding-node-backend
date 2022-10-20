const { spawn } = require("child_process");
const { getCompiler, getCompilerFlags, outputPath } = require("./util");
const JobModel = require("../database/Models/jobModel");
const { compileFile } = require("./compile");
const path = require("path");
const fs = require("fs");

const runFile = async (jobId) => {
  const job = await JobModel.findById(jobId);

  if (job["language"] === "js" || job["language"] === "py")
    return runInterpreter(jobId);

  return compileAndExecute(jobId);
};

const runInterpreter = async (jobId) => {
  const job = await JobModel.findById(jobId);

  if (job === undefined) throw Error("Job not found");

  const language = job["language"];
  const compiler = getCompiler(language);

  const process = spawn(compiler, [job["filepath"]]);

  const timeout = setTimeout(async () => {
    try {
      process.kill();
      job["completedAt"] = Date.now();
      job["status"] = "success";
      job["output"] = "time limit excceded";
      await job.save();
    } catch (err) {
      console.log(err);
    }
  }, 10 * 1000);

  process.stdout.on("data", async (data) => {
   
    const output = data.toString();
    job["completedAt"] = Date.now();
    job["status"] = "success";
    job["output"] = output;
    await job.save();
  });

  process.on("error", (err) => {
   
    job["completedAt"] = Date.now();
    job["status"] = "success";
    job["output"] = "failded";
    console.log(err);
    return;
  });

  process.on("exit", () => {
    clearTimeout(timeout);
    fs.unlink(job["filepath"], (err) => {
      if (err) console.log(err);
    });
  });

  process.stdin.write(job["input"], (err) => {
    console.log("can not write to stdin");
  });

  process.stdin.end();
};

const compileAndExecute = async (jobId) => {
  const job = await JobModel.findById(jobId);
  try {
    await compileFile(job);
  } catch (err) {
    return;
  }

  // if (!Compiled) return;

  const jobIdOut = path.basename(job["filepath"]).split(".")[0];
  const filepath = path.join(outputPath, `${jobIdOut}.out`);

  const process = spawn(filepath);

  const timeout = setTimeout(async () => {
    try {
      process.kill();
      job["completedAt"] = Date.now();
      job["status"] = "success";
      job["output"] = "time limit excceded";
      await job.save();
    } catch (err) {
      console.log(err);
    }
  }, 10 * 1000);

  process.stdout.on("data", async (data) => {
    const output = data.toString();
    job["completedAt"] = Date.now();
    job["status"] = "success";
    job["output"] = output;
    await job.save();
  });
  process.stderr.on("data", async (data) => {
    const output = data.toString();
    job["completedAt"] = Date.now();
    job["status"] = "success";
    job["output"] = output;
    await job.save();
  });

  process.on("error", (err) => {
    console.log(err);
    return;
  });

  process.on("exit", () => {
    clearTimeout(timeout);
    fs.unlink(job["filepath"], (err) => {
      if (err) console.log(err);
    });
    fs.unlink(filepath, (err) => {
      if (err) console.log(err);
    });
  });

  try {
    process.stdin.write(job["input"]);
  } catch (err) {
    console.log("can not write to stream");
  }

  process.stdin.end();
};

module.exports = runFile;
