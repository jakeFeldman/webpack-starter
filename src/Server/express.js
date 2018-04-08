// PACKAGES
import express from 'express';
import webpack from 'webpack';
import webpackDev from 'webpack-dev-middleware';
import webpackHot from 'webpack-hot-middleware';
import expressStaticGZip from 'express-static-gzip';
// CONFIG
import config from '../../config/webpack.dev.js';

const server = express();
const compiler = webpack(config);
const webpackDevMiddleware = webpackDev(compiler, config.devServer);
const webpackHotMiddleware = webpackHot(compiler);

server.use(webpackDevMiddleware);
server.use(webpackHotMiddleware);
server.use(expressStaticGZip('dist', {
    enableBrotli: true
}));

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    /* eslint-disable-next-line no-console */
    console.log(`Server is listening on port ${PORT}`);
});
