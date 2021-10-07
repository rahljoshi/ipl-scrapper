const axios = require("axios");
const allMatches = require("./extractingData/extractAllMatches");
async function leagueScorecard(link) {
  try {
    const response = await axios.get(link);
    const data = response.data;
    allMatches.extractAllMatches(data);
  } catch (error) {
    console.log(error);
  }
}

module.exports = { leagueScorecard };
