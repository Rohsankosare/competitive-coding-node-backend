const path = require("path");
const fs = require("fs");

const outputPath = path.join(__dirname, "outputs");
if(!fs.existsSync(outputPath)) fs.mkdirSync(outputPath, { recursive: true });

const getCompiler = (language) => {
  switch (language) {
    case "cpp":
      return "g++";
    case "c":
      return "g++";
    case "java":
      return "javac";
    case "py":
      return "py";
    case "js":
      return "node";

    default:
      return null;
  }
};

const getCompilerFlags = (compiler, filepath) => {
  
  switch (compiler) {
    case "g++": {
      const jobId = path.basename(filepath).split(".")[0];
      const outPath = path.join(outputPath, `${jobId}.out`);
      return [filepath, "-o", outPath];
    }
    case "js": {
      const jobId = path.basename(filepath).split(".")[0];
      const outPath = path.join(outputPath, `${jobId}.out`);
      return [outPath];
    }
    case "py": {
      const jobId = path.basename(filepath).split(".")[0];
      const outPath = path.join(outputPath, `${jobId}.out`);
      return [outPath];
    }

    default:
      return null;
  }
};

module.exports = {
  getCompiler,
  getCompilerFlags,
  outputPath
 
};
