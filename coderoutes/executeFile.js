const { exec } = require("child_process");
const path = require("path");

const fs = require("fs");
const { stdin } = require("process");

const outputPath = path.join(__dirname, "outputs");

if (!fs.existsSync(outputPath)) fs.mkdirSync(outputPath, { recursive: true });

// execute cpp file function
const executeCpp = (filepath) => {
  const jobId = path.basename(filepath).split(".")[0];
  const outPath = path.join(outputPath, `${jobId}.out`);

  return new Promise((resolve, rejects) => {
    exec(
      `g++ ${filepath} -o ${outPath} &&  cd ${outputPath} && ${jobId}.out `,
      { timeout: 5000 },
      (error, stdout, stderr) => {
        if (error) rejects({ error, stderr });

        if (stderr) rejects({ stderr });

        resolve(stdout);
      }
    );
  });
};

// execute java file

const executeJava = (filepath) => {
  const jobId = path.basename(filepath).split(".")[0];
  const outPath = path.join(outputPath, `${jobId}.out`);

  return new Promise((resolve, rejects) => {
    exec(
      `javac ${filepath} -o ${outPath} &&  cd ${outputPath} && ${jobId}.out`,
      { timeout: 5000 },
      (error, stdout, stderr) => {
        if (error) rejects({ error, stderr });

        if (stderr) rejects({ stderr });

        resolve(stdout);
      }
    );
  });
};

const executePythone = (filepath) => {
  return new Promise((resolve, rejects) => {
    exec(`py ${filepath} `, { timeout: 5000 }, (error, stdout, stderr) => {
      if (error) rejects({ error, stderr });

      if (stderr) rejects({ stderr });

      resolve(stdout);
    });
  });
};

//execute java file
const executeNode = (filepath) => {
  return new Promise((resolve, rejects) => {
    const subprocess = exec(`node ${filepath}`);
  });
};

module.exports = {
  executeCpp,
  executeNode,
  executePythone,
  executeJava,
};
