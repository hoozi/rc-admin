const proxy = require('http-proxy-middleware');

const proxyUrl = 'http://118.31.6.176:9999';
const localPath = '/';

const serviceList = [
  `${localPath}auth`,
  `${localPath}admin`,
  `${localPath}code`,
  `${localPath}gen`,
  `${localPath}daemon`
]

let proxys = {};

serviceList.forEach(service => {
  proxys[service] = {
    target: proxyUrl,
    changeOrigin: true,
    pathRewrite: {
      [`^${service}`] : service
    }
  }
});

module.exports = function(app) {
  //app.use(proxy('/api', { target: 'http://localhost:5000/' }));
  for(let key in proxys) {
    app.use(proxy(key, proxys[key]));
  }
};