const axios = require("axios");
const fs = require("fs");
const path = require("path");

const url = "https://www.espncricinfo.com/series/ipl-2020-21-1210595";

const extractVenues = require("./extractingData/extractingVenues");
main();

async function main() {
  try {
    const response = await axios.get(url);
    const data = response.data;

    extractVenues.extractVenues(data);
  } catch (error) {
    console.log(error);
  }
}
