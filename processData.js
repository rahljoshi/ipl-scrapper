const writer = require("./excelReadWrite/excelWriter");
const reader = require("./excelReadWrite/excelReader");
const fs = require("fs");
const path = require("path");
const dirCreator = require("./dirCreator");
function processPlayerData(
  teamName,
  playerName,
  runScored,
  ballPlayed,
  fours,
  sixes,
  strikeRate,
  opponent,
  venue,
  date,
  result
) {
  let teamPath = path.join(__dirname, "ipl", teamName);
  dirCreator.dirCreator(teamPath);
  let filePath = path.join(teamPath, playerName + ".xlsx");
  let content = reader.excelReader(filePath, playerName);
  let playerObject = {
    teamName,
    playerName,
    runScored,
    ballPlayed,
    fours,
    sixes,
    strikeRate,
    opponent,
    venue,
    date,
    result,
  };
  content.push(playerObject);
  writer.excelWriter(filePath, content, playerName);
}

module.exports = { processPlayerData };
