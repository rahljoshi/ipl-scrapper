const cheerio = require("cheerio");

const playerDetails = require("../processData");
function extractTeamDetails(html) {
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

        playerDetails.processPlayerData(
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

module.exports = { extractTeamDetails };
