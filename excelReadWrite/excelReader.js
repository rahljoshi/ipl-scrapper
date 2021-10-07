const xlsx = require("xlsx");
const fs = require("fs");
function excelReader(filePath, sheetName) {
  if (fs.existsSync(filePath) === true) {
    let wb = xlsx.readFile(filePath);
    const excelData = wb.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(excelData);
    return data;
  } else {
    return [];
  }
}

module.exports = { excelReader };
