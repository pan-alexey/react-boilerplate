const path = require('path');
const webpack = require('webpack');

const __ROOT_PATH__ = process.cwd();
const __SERVER_PATH__ = path.join(__ROOT_PATH__, '.cache', 'server');
const __CLIENT_PATH__ = path.join(__ROOT_PATH__, '.cache', 'client');

const webpackConfig = {}

const child_process = require('child_process');

webpackConfig['server'] = require('./webpack/webpack.server');
webpackConfig['server'].entry = path.join(__ROOT_PATH__, './server/server.tsx');
webpackConfig['server'].output.path = __SERVER_PATH__;
webpackConfig['server'].mode = 'development';

// webpackConfig['server'] = require('./webpack/webpack.server');
// webpackConfig['server'].entry = path.join(__ROOT_PATH__, './src/server/index.ts');
// webpackConfig['server'].output.path = __SERVER_PATH__;

const webpackComplier = {};
webpackComplier['server'] = webpack(webpackConfig['server']);

(async function () {
  let spawn;
  webpackComplier['server']
  // .run((err, stats) => { 
  //   // if (err || stats.hasErrors()) throw new Error(err || stats.hasErrors());

  //   console.log(stats.toString({
  //     assets: false,
  //     cached: false,
  //     cachedAssets: false,
  //     chunks: false,
  //     chunkModules: false,
  //     chunkOrigins: false,
  //     modules: false,
  //     colors: true,
  //     entrypoints: false
  //   }))

  //   if (app) {
  //     app.close();
  //   }

  //   delete require.cache[require.resolve(__SERVER_PATH__)]
  //   app = require(__SERVER_PATH__);
  // })
  .watch({
    aggregateTimeout: 300,
    poll: undefined
  }, (err, stats) => { 
    if (spawn) { spawn.kill();}
    process.stdout.write(process.platform === 'win32' ? '\x1B[2J\x1B[0f' : '\x1B[2J\x1B[3J\x1B[H');

    console.log(stats.toString({
      assets: false,
      cached: false,
      cachedAssets: false,
      chunks: false,
      chunkModules: false,
      chunkOrigins: false,
      modules: false,
      colors: true,
      entrypoints: false
    }))

    spawn = child_process.spawn('node', [require.resolve(__SERVER_PATH__, 'index.js')]);

    spawn.stdout.on('data', function(data){
      console.log(String(data));
    });
    
    spawn.stderr.on('data', function(data){
      console.log(String(data));
    });
  });
})()


/*
Для сервера создаем временную директорию, 
Зомпилируем туда сервер
Запускаем сервер
Удаляем временную директорию
*/