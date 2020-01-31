//Important: Set the env to either development or production to use the appropriate config
/****************************************/
const env = "development"; // 'development' or 'production'
/*******************************************/

const development = {
    devServer: {
        //open: process.platform === 'darwin',
        port: 9091, // CHANGE YOUR PORT HERE!
        https: false,
        disableHostCheck: true,
    },
};

const production = {
    publicPath: 'https://cticonnector.oberoirealty.com/softphone',
    devServer: {
        open: process.platform === 'darwin',
        port: 9091, // CHANGE YOUR PORT HERE!
        https: false,
        disableHostCheck: true,
        proxy: 'https://cticonnector.oberoirealty.com/softphone'
    },
}

const config = {
    development,
    production
};

module.exports = config[env];