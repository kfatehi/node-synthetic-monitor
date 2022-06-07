const getAlerts = require('../grafana');

module.exports.isResponsive = () => async () => {
  try {
    await getAlerts();
    return [true, 'ok'];
  } catch(err) {
    return [false, err.message];
  }
}

module.exports.alertStatusNominal = (options) => {
  const ignoreMap = {}
  if (Array.isArray(options.ignore) && options.ignore.length > 0) {
    options.ignore.forEach((n)=> ignoreMap[n] = true);
  }
  return async()=>{
    try {
      let failMessage = [];
      let allNominal = true;
      let alerts = await getAlerts();
      for (let i = 0; i<alerts.length; i++) {
        let a = alerts[i];
        let nominal = a.state === 'ok' || a.state === 'pending' || a.state === 'unknown' || a.state === "paused";
        if (!nominal && !ignoreMap[a.name]) {
          failMessage.push(a.name+" is "+a.state)
          allNominal = false;
        }
      }
      return [allNominal, allNominal ? 'ok' : failMessage.join(', ')];
    } catch(err) {
      return [false, err.message];
    }
  }
}
