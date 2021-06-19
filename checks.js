const axios = require('axios');
const getAlerts = require('./grafana');
const httpClient = axios.create();
httpClient.defaults.timeout = 5000;

module.exports = {
  monitoringServerStatus: {
    title: "Grafana is not responding!",
    pdIncident: null,
    check: async ()=>{
      try {
        await getAlerts();
        return [true, 'ok'];
      } catch(err) {
        return [false, err.message];
      }
    }
  },
  monitoringServerAlerting: {
    title: "Grafana is alerting!",
    pdIncident: null,
    dependsOn: 'monitoringServerStatus',
    check: async ()=>{
      try {
        let failMessage = [];
        let allNominal = true;
        let alerts = await getAlerts();
        for (let i = 0; i<alerts.length; i++) {
          let a = alerts[i];
          let nominal = a.state === 'ok' || a.state === 'pending';
          if (!nominal) {
            failMessage.push(a.name+" is "+a.state)
            allNominal = false;
          }
        }
        return [allNominal, allNominal ? 'ok' : failMessage.join(', ')];
      } catch(err) {
        return [false, err.message];
      }
    }
  },
  // In the future lets add another check
  // to use the v3 mobile api
  // and get the /contacts route,
  // this will check all services for us
  productionServerStatus: {
    title: "Site is not responding properly!",
    pdIncident: null,
    check: async ()=>{
      try {
        let resp = await httpClient.get('https://bigpurpledot.com');
        let ok = resp.data.includes("Automatically distribute to your team members")
        if (ok) {
          return [true, 'ok'];
        } else {
          return [false, "did not include string"];
        }
      } catch(err) {
        return [false, err.message];
      }
    }
  }
}
