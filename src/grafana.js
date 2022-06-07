const axios = require('axios');
const { grafanaApiToken, grafanaApiAlertsEndpoint } = require('./config');
const httpClient = axios.create();
httpClient.defaults.timeout = 10000;

module.exports = async function() {
  if (!grafanaApiAlertsEndpoint) {
    throw new Error("misconfigured: grafanaApiAlertsEndpoint not defined")
  }
  if (!grafanaApiToken) {
    throw new Error("misconfigured: grafanaApiToken not defined")
  }
  let resp = await httpClient.get(grafanaApiAlertsEndpoint, {
    headers: {
      Authorization: "Bearer "+grafanaApiToken
    }
  });
  return resp.data
}
