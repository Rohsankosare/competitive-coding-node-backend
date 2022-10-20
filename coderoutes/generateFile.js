const path = require("path");
const fs = require("fs");
const { v4: uuid } = require("uuid");

const dirCodes = path.join(__dirname, "codes");

if (!fs.existsSync(dirCodes)) fs.mkdirSync(dirCodes, { recursive: true });

const generatFile = async (format, code) => {
  const jobId = uuid();
  const filename = `${jobId}.${format}`;
  const filepath = path.join(dirCodes, filename);

 fs.writeFileSync(filepath, code);
  return filepath;
};

module.exports = generatFile;
