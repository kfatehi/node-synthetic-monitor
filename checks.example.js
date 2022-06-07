const { checks } = require('./');

module.exports = {
  monitoringServerStatus: {
    title: "Grafana is not responding!",
    check: check.grafana.isResponsive()
  },
  monitoringServerAlerting: {
    title: "Grafana is alerting!",
    skipSlackAlert: true,
    dependsOn: 'monitoringServerStatus',
    check: check.grafana.alertStatusNominal({
      ignore:[
        'Passenger Session Durations alert',
        'Passenger Session Durations alert',
        'Websocket Server Memory Usage alert',
        'DBConnections alert'
      ]
    })
  },
  productionServerStatus: {
    title: "Site is not responding properly!",
    check: check.webContent.stringMatch({
      url: 'https://bigpurpledot.com',
      string: "Automatically distribute to your team members"
    })
  },
  websiteCert: {
    title: "Website certificate expiration",
    check: check.webCertificate('bigpurpledot.com')
  },
  websocketCert: {
    title: "Web socket certificate expiration",
    check: check.webCertificate('websockets.bigpurpledot.com')
  }
}
