require('dotenv').config();
const awsParamStore = require('aws-param-store-sdkv3');

const PATH_PARAM_STORE = '/isn/prod';

let parameter = awsParamStore.getParametersByPathSync(`${PATH_PARAM_STORE}`, {
  region: 'ap-southeast-3',
});

const [host, port] = parameter.find((x) => x.Name == `${PATH_PARAM_STORE}/db/url`).Value.split(':');
process.env.DB_HOST = host;
process.env.DB_PORT = port;

process.env.DB_USER = parameter.find((x) => x.Name == `${PATH_PARAM_STORE}/db/user`).Value;
process.env.DB_PASSWORD = parameter.find((x) => x.Name == `${PATH_PARAM_STORE}/db/password`).Value;

process.env.OPENAI_API_KEY = parameter.find((x) => x.Name == `${PATH_PARAM_STORE}/tour/openaikey`).Value;
