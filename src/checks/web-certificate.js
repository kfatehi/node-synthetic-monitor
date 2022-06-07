const util = require('util');
const exec = util.promisify(require('child_process').exec);

async function certDaysLeft(domain, port=443) {
  let {stdout} = await exec(`echo | openssl s_client -servername ${domain} -connect ${domain}:${port} | openssl x509 -noout -dates | grep notAfter`);
  let date = new Date(stdout.split('=')[1]);
  let now = new Date();
  let diff = date.getTime() - now.getTime();
  let days = diff / (1000 * 3600 * 24);
  return days;
}

module.exports = (domain, port=443, dayThresh=7) => async () => {
  try {
    let daysLeft = await certDaysLeft(domain, port);
    let ok = daysLeft > dayThresh;
    if (ok) {
      return [true, 'in '+daysLeft+' days'];
    } else {
      return [false, 'in '+daysLeft+' days'];
    }
  } catch(err) {
    return [false, err.message];
  }
}
