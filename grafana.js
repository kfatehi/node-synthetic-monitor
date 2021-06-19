const axios = require('axios');
const { grafanaApiToken, grafanaApiAlertsEndpoint } = require('./config');
const httpClient = axios.create();
httpClient.defaults.timeout = 5000;

module.exports = async function() {
  let resp = await httpClient.get(grafanaApiAlertsEndpoint, {
    headers: {
      Authorization: "Bearer "+grafanaApiToken
    }
  });
  return resp.data
}
