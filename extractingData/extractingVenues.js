const cheerio = require("cheerio");
const scorecard = require("../leagueScorecard");
const commonURL = "https://www.espncricinfo.com";
function extractVenues(html) {
  const $ = cheerio.load(html);
  const venues = $(
    ".container .widget-items.cta-link .label.blue-text.blue-on-hover"
  );
  //getting venues url
  const link = venues.attr("href");
  const venueURL = commonURL + link;
  scorecard.leagueScorecard(venueURL);
}

module.exports = { extractVenues };
