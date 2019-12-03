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
    publicPath: 'https://localhost:9091',
    devServer: {
        open: process.platform === 'darwin',
        port: 9091, // CHANGE YOUR PORT HERE!
        https: false,
        disableHostCheck: true,
        proxy: 'https://localhost:9091'
    },
}

const config = {
    development,
    production
};

module.exports = config[env];