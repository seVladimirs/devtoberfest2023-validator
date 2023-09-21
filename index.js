const axios = require('axios');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');

async function checkBadges(scnId) {
  try {
    // Fetch all badges
    const allBadgesResponse = await axios.get('https://raw.githubusercontent.com/SAP-samples/sap-community-activity-badges/main/srv/util/badges.json');
    const allBadges = allBadgesResponse.data.map(badge => badge.displayName);
    
    // Fetch user's badges
    const userBadgesResponse = await axios.get(`https://people-api.services.sap.com/rs/badge/${scnId}?sort=timestamp,desc&size=1000`);
    const userBadges = userBadgesResponse.data.content.map(badge => badge.displayName);
    
    // Check which badges are in the user's badges list
    allBadges.forEach(badge => {
      if (userBadges.includes(badge)) {
        console.log(`✅ ${badge}`);
      } else {
        console.log(`❌ ${badge}`);
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
  }
}).argv;

checkBadges(argv.u);
