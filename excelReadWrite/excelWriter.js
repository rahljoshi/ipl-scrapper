const xlsx = require("xlsx");
const fs = require("fs");
function excelWriter(filePath, data, sheetName) {
  let newWB = xlsx.utils.book_new();
  let newWS = xlsx.utils.json_to_sheet(data);
  xlsx.utils.book_append_sheet(newWB, newWS, sheetName);
  xlsx.writeFile(newWB, filePath);
}

module.exports = { excelWriter };
