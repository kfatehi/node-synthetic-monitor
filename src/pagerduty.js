const config = require('./config');
const pagerduty = require('@pagerduty/pdjs');
const pd = config.pagerDutyApiToken ? pagerduty.api({token: config.pagerDutyApiToken}) : null;

async function createIncident(title) {
  if (!pd) return;
  try {
    let resp = await pd.post('/incidents', { data: {
      incident: { 
        type: "incident",
        title: title,
        service: {
          id: config.pagerDutyServiceId,
          type: "service_reference"
        }
      }
    }, headers: {
      From: config.pagerDutyEmail
    }})
    console.log("Created PagerDuty incident:", title);
    return resp.data;
  } catch (err) {
    console.error("PagerDuty incident creation failed with status ", err.status);
    throw err;
  }
}

module.exports = { createIncident };
