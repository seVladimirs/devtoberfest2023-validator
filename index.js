const axios = require('axios');
const cheerio = require('cheerio');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');

async function fetchHtml(url) {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch HTML from ${url}`);
  }
}

async function parseTable(html) {
  const $ = cheerio.load(html);
  const rows = [];
  $('table tbody tr').each((i, row) => {
    const $row = $(row);
    const badgeCode = $row.find('td:nth-child(2)').text().trim();
    const contentWeekLink = $row.find('td:nth-child(3) a').attr('href');
    rows.push({ badgeCode, contentWeekLink });
  });
  return rows;
}

async function checkBadges(scnId, notFoundOnly) {
  try {
    const url =
      'https://groups.community.sap.com/t5/devtoberfest-blog-posts/devtoberfest-2023-contest-activities-and-points-week-1/ba-p/286328';
    const html = await fetchHtml(url);
    const tableData = await parseTable(html);

    const allBadgesResponse = await axios.get(
      'https://raw.githubusercontent.com/SAP-samples/sap-community-activity-badges/main/srv/util/badges.json'
    );
    const allBadges = allBadgesResponse.data;

    const userBadgesResponse = await axios.get(
      `https://people-api.services.sap.com/rs/badge/${scnId}?sort=timestamp,desc&size=1000`
    );
    const userBadges = userBadgesResponse.data.content;

    allBadges.forEach((badge) => {
      let foundTableRow = tableData.find((row) =>
        badge.displayName.includes(row.badgeCode)
      );
      // if foundTableRow or foundTableRow.contentWeekLink is empty, then set foundTableRow to undefined
      if (foundTableRow && !foundTableRow.contentWeekLink) {
        foundTableRow = undefined;
      }
      const userBadge = userBadges.find((ub) =>
        ub.displayName.includes(badge.displayName)
      );

      if (userBadge) {
        if (!notFoundOnly) {
          console.log(
            `✅ ${badge.displayName} - ${
              foundTableRow ? foundTableRow.contentWeekLink : 'Link not found'
            }`
          );
        }
      } else {
        console.log(
          `❌ ${badge.displayName} - ${
            foundTableRow ? foundTableRow.contentWeekLink : 'Link not found'
          }`
        );
      }
    });
  } catch (error) {
    console.error('Error:', error.message);
  }
}

const argv = yargs(hideBin(process.argv)).options({
  u: {
    type: 'string',
    demandOption: true,
    describe: 'User scnId',
  },
  n: {
    type: 'boolean',
    default: false,
    describe: 'Display only badges that were not found',
  },
}).argv;

checkBadges(argv.u, argv.n);
