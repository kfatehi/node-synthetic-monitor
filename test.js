require('./checks').websiteCert.check().then((o)=>{
  console.log(o);
});

require('./checks').websocketCert.check().then((o)=>{
  console.log(o);
});
