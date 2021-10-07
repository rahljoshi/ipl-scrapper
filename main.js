const cheerio = require("cheerio");
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const xlsx = require("xlsx");
// const dataWriter = require("./dataWriter");
//const dataReader = require("./dataReader");
const url = "https://www.espncricinfo.com/series/ipl-2020-21-1210595";
const commonURL = "https://www.espncricinfo.com";
main();
const iplPath = path.join(__dirname, "ipl");
dirCreator(iplPath);
async function main() {
  try {
    const response = await axios.get(url);
    const data = response.data;

    extractVenues(data);
  } catch (error) {
    console.log(error);
  }
}

async function extractVenues(html) {
  const $ = cheerio.load(html);
  const venues = $(
    ".container .widget-items.cta-link .label.blue-text.blue-on-hover"
  );
  //getting venues url
  const link = venues.attr("href");
  const venueURL = commonURL + link;
  leagueScorecard(venueURL);
  console.log(venueURL);
}

async function leagueScorecard(link) {
  try {
    const response = await axios.get(link);
    const data = response.data;
    allMatches(data);
  } catch (error) {
    console.log(error);
  }
}
function allMatches(html) {
  const $ = cheerio.load(html);
  const allMatchesArray = $(
    ".card.content-block.league-scores-container .match-score-block"
  );
  console.log(allMatchesArray.length);
  for (let i = 0; i < allMatchesArray.length; i++) {
    const url = $(allMatchesArray[i])
      .find(".match-info-link-FIXTURES")
      .attr("href");
    extractDetails(url);
  }
}
async function extractDetails(link) {
  try {
    const matchURL = commonURL + link;
    const response = await axios.get(matchURL);
    // console.log(matchURL);
    const data = response.data;
    temp(data);
  } catch (error) {
    console.log(error);
  }
}
function temp(html) {
  const $ = cheerio.load(html);
  const name = $(".playerofthematch-name").text();
  const status = $("#main-container .status-text>span").text();
  const details = $(".header-info .description").text().split(",");
  const venue = details[1].trim();
  const date = details[2].trim();
  //   console.log(`${name} and ${status} : details ${date}`);
  const innings = $(".card.content-block.match-scorecard-table>.Collapsible ");
  let htmlString = "";
  for (let i = 0; i < innings.length; i++) {
    const teamName = $(innings[i]).find("h5").text().split("INNINGS")[0];
    const opponentIndex = i == 0 ? 1 : 0;
    const opponent = $(innings[opponentIndex])
      .find("h5")
      .text()
      .split("INNINGS")[0];
    //console.log(`${teamName} opp ${opponent}`);

    const allRows = $(innings[i]).find(".table.batsman tbody tr");
    for (let j = 0; j < allRows.length; j++) {
      let allCols = $(allRows[j]).find("td");
      let isBatsmanCell = $(allCols[0]).hasClass("batsman-cell");
      if (isBatsmanCell === true) {
        const playerName = $(allCols[0]).text().trim();
        const runScored = $(allCols[2]).text().trim();
        const ballPlayed = $(allCols[3]).text().trim();
        const fours = $(allCols[5]).text().trim();
        const sixes = $(allCols[6]).text().trim();
        const strikeRate = $(allCols[7]).text().trim();

        processPlayer(
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
          status
        );
      }
    }
  }
}

function processPlayer(
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
  dirCreator(teamPath);
  let filePath = path.join(teamPath, playerName + ".xlsx");
  let content = dataReader(filePath, playerName);
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
  dataWriter(filePath, content, playerName);
}
function dirCreator(filePath) {
  if (fs.existsSync(filePath) === false) {
    fs.mkdirSync(filePath);
  }
}
function dataWriter(filePath, data, sheetName) {
  let newWB = xlsx.utils.book_new();
  let newWS = xlsx.utils.json_to_sheet(data);
  xlsx.utils.book_append_sheet(newWB, newWS, sheetName);
  xlsx.writeFile(newWB, filePath);
}
function dataReader(filePath, sheetName) {
  if (fs.existsSync(filePath) === true) {
    let wb = xlsx.readFile(filePath);
    const excelData = wb.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(excelData);
    return data;
  } else {
    return [];
  }
}
