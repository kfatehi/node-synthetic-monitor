const pagerduty = require('@pagerduty/pdjs');
const { pagerDutyServiceId, pagerDutyEmail, pagerDutyApiToken } = require('./config');
const pd = pagerduty.api({token: pagerDutyApiToken});
const checks = require('./checks.js');

const sleep = async (ms=1000)=>new Promise((r,_)=>setTimeout(r,ms));

async function main() {
  while(true) {
    try {
      for (let checkKey in checks) {
        let check = checks[checkKey]
        if (check.dependsOn && checks[check.dependsOn].pdIncident) {
          // skip this alert if its parent is already active
          continue;
        }
        let [ok, message] = await check.check();
        console.log(checkKey, ok, message);
        if (ok && check.pdIncident) {
          // clear the incident so we can make future ones
          check.pdIncident = null;
        } else if (!ok && !check.pdIncident) {
          // not ok but no incident exists, create it
          check.pdIncident = await createIncident(check.title);
        }
        await sleep(1000);
      }
      await sleep(10000);
    } catch(err) {
      console.error(err.message);
    }
  }
}

async function createIncident(title) {
  console.log("New incident!", title);
  let resp = await pd.post('/incidents', { data: {
    incident: { 
      type: "incident",
      title: title,
      service: {
        id: pagerDutyServiceId,
        type: "service_reference"
      }
    }
  }, headers: {
    From: pagerDutyEmail
  }})
  return resp.data;
}

main();
