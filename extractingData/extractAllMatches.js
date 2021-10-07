const cheerio = require("cheerio");
const matchDetails = require("./extractMatchDetails");

function extractAllMatches(html) {
  const $ = cheerio.load(html);
  const allMatchesArray = $(
    ".card.content-block.league-scores-container .match-score-block"
  );
  console.log(allMatchesArray.length);
  for (let i = 0; i < allMatchesArray.length; i++) {
    const url = $(allMatchesArray[i])
      .find(".match-info-link-FIXTURES")
      .attr("href");
    matchDetails.extractMatchDetails(url);
  }
}

module.exports = { extractAllMatches };
