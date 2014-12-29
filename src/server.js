// 
//     hpool-server - stratum server software
//     Copyright (C) 2013 - 2014, hpool project 
//     http://www.hpool.org - https://github.com/int6/hpool-stratum
// 
//     This software is dual-licensed: you can redistribute it and/or modify
//     it under the terms of the GNU General Public License as published by
//     the Free Software Foundation, either version 3 of the License, or
//     (at your option) any later version.
// 
//     This program is distributed in the hope that it will be useful,
//     but WITHOUT ANY WARRANTY; without even the implied warranty of
//     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//     GNU General Public License for more details.
//    
//     For the terms of this license, see licenses/gpl_v3.txt.
// 
//     Alternatively, you can license this software under a commercial
//     license or white-label it as set out in licenses/commercial.txt.
//

var fs = require('fs');
var path = require('path');
var os = require('os');
var cluster = require('cluster');
var winston = require('winston');
var colors = require("colors");
var jsonminify = require("jsonminify");
var merge = require('merge');
var algorithms = require('hpool-stratum/lib/algorithms.js');
var poolWorker = require('./worker/pool.js');
var webServer = require('hpool-web/app.js');

// module package files.
var serverModule = require('../package.json');
var stratumModule = require('hpool-stratum/package.json');
var webModule = require('hpool-web/package.json');

var _this = this;

initialize(); // initialize the server.

function initialize() {
    
    process.env.NODE_ENV = "development";
    global.env = process.env.NODE_ENV || 'production'; // set the environment

    printBanner(); // print program banner.    
    setupLogger(); // print program banner.
    
    winston.log('info', "hpool version: %s, env: %s", serverModule.version, env);
    winston.log('info', "dependencies: stratum %s, web %s", stratumModule.version, webModule.version);
    winston.log('info', 'Running on: %s-%s [%s %s]', os.platform(), os.arch(), os.type(), os.release());
    winston.log('info', 'Running over %d core system', os.cpus().length);

    readConfig(function() { // read configuration files.
        configurePosix(function() {
            startWebServer(function () { // start the webserver.

            });
        });
    });
}

function printBanner() {
    console.log('');
    console.log(' ██╗  ██╗██████╗  ██████╗  ██████╗ ██╗     '.yellow);
    console.log(' ██║  ██║██╔══██╗██╔═══██╗██╔═══██╗██║     '.yellow);
    console.log(' ███████║██████╔╝██║   ██║██║   ██║██║     '.yellow);
    console.log(' ██╔══██║██╔═══╝ ██║   ██║██║   ██║██║     '.yellow);
    console.log(' ██║  ██║██║     ╚██████╔╝╚██████╔╝███████╗'.yellow);
    console.log(' ╚═╝  ╚═╝╚═╝      ╚═════╝  ╚═════╝ ╚══════╝'.yellow);
    console.log('');
    console.log('Copyright (C) 2013 - 2014, Coinium project - http://www.coinium.org'.magenta);
    console.log('hpool comes with ABSOLUTELY NO WARRANTY. '.bgRed);
    console.log('');
    console.log('You can contribute the development of the project by donating;'.green);
    console.log(' BTC : 18qqrtR4xHujLKf9oqiCsjmwmH5vGpch4D'.yellow);
    console.log(' LTC : LMXfRb3w8cMUBfqZb6RUkFTPaT6vbRozPa'.yellow);
    console.log(' DOGE: DM8FW8REMHj3P4xtcMWDn33ccjikCWJnQr'.yellow);
    console.log(' RDD : Rb9kcLs96VDHTmiXVjcWC2RBsfCJ73UQyr'.yellow);
    console.log('');
}

function readConfig(callback) {
    
    var poolConfigDir = "config/pool/";
    var coinConfigDir = "config/coin/";
    
    // check for the main configuration file.
    if (!fs.existsSync('config/config.json')) {
        winston.log('error', 'Main configuration file config.json file does not exist.');
        return;
    }

    _this.defaultPoolConfig = {};
    _this.poolConfigs = [];
    
    // loop through pool configuration files
    fs.readdirSync(poolConfigDir).forEach(function (file) {
        try {
            
            // make sure the file exists and is a json file
            if (!fs.existsSync(poolConfigDir + file) || path.extname(poolConfigDir + file) !== '.json')
                return;
            
            // read the configuration file.
            var poolConfigData = fs.readFileSync(poolConfigDir + file, { encoding: 'utf8' });
            var poolConfig = JSON.parse(JSON.minify(poolConfigData)); // clean out the file and try parsing then.
            
            // check if we are loading the default.json
            if (file === 'default.json') {
                _this.defaultPoolConfig = poolConfig;
                return;  // skip further checks for default.json
            }
            
            // make sure the pool configuration is enabled
            if (!poolConfig.enabled)
                return;
            
            // try loading the coin configuration file for the pool.
            if (!fs.existsSync(coinConfigDir + poolConfig.coin)) {
                winston.log("error", "Can not read coin configuration file %s", poolConfig.coin);
                return; // skip the current pool.
            }
            
            // try loading the coin configuration file for the pool.
            var coinConfigData = fs.readFileSync(coinConfigDir + poolConfig.coin, { encoding: 'utf8' });
            poolConfig.coin = JSON.parse(JSON.minify(coinConfigData));
            
            // check if algorithm is supported
            if (!poolConfig.coin.algorithm in algorithms) {
                winston.log('error', 'Pool is configured to use an unsupported algorithm: %s', poolConfig.coin.algorithm);
            }
            
            // merge the pool config with default.json
            var mergedConfig = merge.recursive(true, _this.defaultPoolConfig, poolConfig);
            
            // add pool configuration
            _this.poolConfigs.push(mergedConfig);

            callback();
        } catch (err) {
            winston.log('error', 'Error reading pool configuration file ' + file + "; " + err);
            callback();
        }
    });
}

function setupLogger() {

    var logDir = 'log';

    winston.setLevels(winston.config.npm.levels);
    winston.addColors(winston.config.npm.colors);
    
    // make sure the /log directory exists
    if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir);
    }

    winston.remove(winston.transports.Console);
    winston.add(winston.transports.Console, {
        colorize: true,
        timestamp: function () {
            var date = new Date();
            return date.getDate() + '/' + (date.getMonth() + 1) + ' ' + date.toTimeString().substr(0, 5) + ' [' + global.process.pid + ']';
        },
        level: global.env === 'production' ? 'info' : 'verbose'
    });
    
    winston.add(winston.transports.File, { filename: logDir + '/server.log' });
}

function configurePosix(callback) {
    // try to increase file limits so we can as much as concurrent clients we can
    
    try {
        var posix = require('posix'); // try to load optional posix library.
        
        // try increasing the open file limits (so the sockets and concurrent connections)
        try {
            posix.setrlimit('nofile', { soft: 100000, hard: 100000 });
        } catch (e) {
            winston.log('warn', 'Failed to raise the connection limit as root is required');
        } finally {
            var uid = parseInt(process.env.SUDO_UID); // find the actual user that started the server using sudp.
            
            // Set our server's uid to that user
            if (uid) {
                process.setuid(uid); // fall-back to the actual user that started the server with sudo.
                winston.log('info', 'Raised connection limit to 100k, falling back to non-root user');
            }
            
            callback();
        }
    } catch (e) {
        winston.log('warn', 'Couldn\'t raise connection limit as posix module is not available on the host.');
        callback();
    }
};


function startWebServer(callback) {    

    winston.log('info', 'Starting web-server..');
    _this.webServer = new webServer();
    callback();
}

//function createWorker() {

//    var worker = cluster.fork({
//        configs: JSON.stringify(_this.poolConfigs)
//    });
//}

//function runWorker() {
//    new poolWorker();
//}

//function setupCluster() {
    
//    var totalForks = (function () {
//        //return os.cpus().length;
//        return 1;
//    })();

//    var i = 0;

//    var spawnInterval = setInterval(function() {
//        createWorker();
//        i++;

//        if (i === totalForks) {
//            clearInterval(spawnInterval);
//            winston.log('info', 'Spawned %d pool(s) on %d thread(s)', Object.keys(_this.poolConfigs).length, totalForks);
//        }

//    }, 250);
           
//    cluster.on('exit', function (worker, code, signal) {

//        winston.log('warn', 'Pool worker [pid: %d] died, will respawn..', worker.process.pid);

//        setTimeout(function () {
//            createWorker();
//        }, 2000);

//    });
    
//    cluster.on('fork', function (worker) {
//        winston.log('debug', 'Forked new pool worker [pid: %d]', worker.process.pid);
//    });

//    cluster.on('online', function (worker) {
//        winston.log('debug', 'Pool worker online: [pid: %d]', worker.process.pid);
//    });
    
//    cluster.on('listening', function (worker, address) {
//        winston.log('debug', 'A worker is now connected to %s:%d', address.address, address.port);
//    });
    
//    cluster.on('disconnect', function (worker) {
//        winston.log('debug','The worker #' + worker.id + ' has disconnected');
//    });
//}

//if (cluster.isMaster) {
//    initialize();
//}
//else if (cluster.isWorker) {
//    runWorker();
//}


