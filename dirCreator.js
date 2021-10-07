const fs = require("fs");
const path = require("path");

function dirCreator(filePath) {
  if (fs.existsSync(filePath) === false) {
    fs.mkdirSync(filePath);
  }
}
const iplPath = path.join(__dirname, "ipl");
dirCreator(iplPath);

module.exports = { dirCreator };
