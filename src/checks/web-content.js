const axios = require('axios');
const httpClient = axios.create();
httpClient.defaults.timeout = 10000;

const match = (url, validate) => async ()=>{
  try {
    let resp = await httpClient.get(url);
    let ok = validate(resp.data)
    if (ok) {
      return [true, 'ok'];
    } else {
      return [false, "invalid response data"];
    }
  } catch(err) {
    return [false, err.message];
  }
}

module.exports.stringMatch = ({url, string}) => match(url, (data)=>data.includes(string))
