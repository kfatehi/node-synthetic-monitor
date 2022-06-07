const axios = require('axios');
const sleep = async (ms=1000)=>new Promise((r,_)=>setTimeout(r,ms));

module.exports = {
  checks: require('./checks'),
  main,
}

async function main({config: {slackAlertEndpoint}, checks}) {
  const { createIncident } = require('./pagerduty');
  console.log("Starting checks");
  while(true) {
    try {
      for (let checkKey in checks) {
        let check = checks[checkKey]
        if (check.dependsOn && checks[check.dependsOn].pdIncident) {
          // skip this alert if its parent is already active
          continue;
        }
        let [ok, message] = await check.check();
        if (ok) {
          check.failCount = 0;
          console.log("[OK]", check.failCount, check.title, message);
        } else {
          if (isNaN(check.failCount)) check.failCount = 0;
          check.failCount = check.failCount+1;
          console.log("[BAD]", check.failCount, check.title, message);
          if (slackAlertEndpoint && !check.skipSlackAlert) {
            axios.post(slackAlertEndpoint, {
              text: `"${message}" for check "${check.title}", count: ${check.failCount}`
            });
          }
        }
        if (ok && check.pdIncident) {
          // clear the incident so we can make future ones
          check.pdIncident = null;
          check.failCount = 0;
        } else if (!ok && !check.pdIncident && check.failCount > 1) {
          // not ok but no incident exists, create it
          check.pdIncident = await createIncident(check.title+": "+message);
        }
        await sleep(1000);
      }
      await sleep(10000);
    } catch(err) {
      console.error(err.message);
      await sleep(1000);
    }
  }
}
