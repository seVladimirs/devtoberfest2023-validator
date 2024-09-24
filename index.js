const axios = require('axios');
const cheerio = require('cheerio');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');

async function checkBadges(scnId, notFoundOnly) {
  try {

    const allBadgesResponse = await axios.get(
      'https://raw.githubusercontent.com/SAP-samples/sap-community-activity-badges/main/srv/util/badges.json'
    );
    const allBadges = allBadgesResponse.data;

    const allDevtoberfestUsersResponse = await axios.get(
      'https://raw.githubusercontent.com/SAP-samples/sap-community-activity-badges/main/srv/util/members.json'
    ); 

    const member = allDevtoberfestUsersResponse.data.data.items.find((member) => member.login === scnId);
    
    const userBadgesResponse = await axios.get(
      `https://community.sap.com/khhcw49343/api/2.0/users/${member.id}`,
    );
    const userBadges = userBadgesResponse.data.data.user_badges.items;

    allBadges.forEach((badge) => {
      // Find corresponding user badge
      const userBadge = userBadges.find((ub) => ub.badge.title.includes(badge.displayName));
    
      if (userBadge) {
        if (!notFoundOnly) {
          console.log(
            `✅ ${badge.displayName} - ${badge.URL || 'URL not found'}` // Changed this line to use URL from badges.json
          );
        }
      } else {
        console.log(
          `❌ ${badge.displayName} - ${badge.URL || 'URL not found'}` // Changed this line to use URL from badges.json
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
