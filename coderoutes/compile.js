const { spawn } = require("child_process");
const { getCompiler, getCompilerFlags } = require("./util");
const JobModel = require("../database/Models/jobModel");
const fs = require("fs");

const compileFile = async (jobId) => {
  const job = await JobModel.findById(jobId);

  if (job === undefined) throw Error("Job not found");
  const compilerName = getCompiler(job["language"]);

  const compilerArgs = getCompilerFlags(compilerName, job["filepath"]);

  let compiler;
  try {
    compiler = spawn(compilerName, compilerArgs);
  } catch (err) {
    
    return false;
  }

  return new Promise((resolve, reject) => {
    compiler.stderr.on("data", async (data) => {
      const resultData = data.toString();
      job["completedAt"] = Date.now();
      job["status"] = "error";
      job["output"] = resultData;

      await job.save();
      reject(false);
    });
    compiler.on("exit",()=>{
      fs.unlink(job["filepath"],(err)=>{
      if(err)
      console.log(err);
      })
      resolve(true);
    })
    compiler.on("error", (data) => {
      // console.log("this runs")
      // const resultData = data.toString();
      reject(false);
    });
  });
};

module.exports = { compileFile };
