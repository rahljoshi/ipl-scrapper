const axios = require("axios");
const commonURL = "https://www.espncricinfo.com";
const extract = require("./extractTeamDetails");

async function extractMatchDetails(link) {
  try {
    const matchURL = commonURL + link;
    const response = await axios.get(matchURL);
    // console.log(matchURL);
    const data = response.data;
    extract.extractTeamDetails(data);
  } catch (error) {
    console.log(error);
  }
}

module.exports = { extractMatchDetails };
