// 
//     hpool-stratum - sratum protocol module for hpool-server
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

var fs = require('fs');
var os = require('os');
var userid = require('userid');
var winston = require('winston');
var colors = require("colors");
var Pool = require('hpool-stratum/lib/pool.js');
var module = require('../package.json');
var stratumModule = require('hpool-stratum/package.json');


console.log("");
console.log(" ██╗  ██╗██████╗  ██████╗  ██████╗ ██╗     ".yellow);
console.log(" ██║  ██║██╔══██╗██╔═══██╗██╔═══██╗██║     ".yellow);
console.log(" ███████║██████╔╝██║   ██║██║   ██║██║     ".yellow);
console.log(" ██╔══██║██╔═══╝ ██║   ██║██║   ██║██║     ".yellow);
console.log(" ██║  ██║██║     ╚██████╔╝╚██████╔╝███████╗".yellow);
console.log(" ╚═╝  ╚═╝╚═╝      ╚═════╝  ╚═════╝ ╚══════╝".yellow);
console.log("");
console.log("Copyright (C) 2013 - 2014, Coinium project - http://www.coinium.org".magenta);
console.log("hpool comes with ABSOLUTELY NO WARRANTY. ".bgRed);
console.log("");
console.log("You can contribute the development of the project by donating;".green);
console.log(" BTC : 18qqrtR4xHujLKf9oqiCsjmwmH5vGpch4D".yellow);
console.log(" LTC : LMXfRb3w8cMUBfqZb6RUkFTPaT6vbRozPa".yellow);
console.log(" DOGE: DM8FW8REMHj3P4xtcMWDn33ccjikCWJnQr".yellow);
console.log(" RDD : Rb9kcLs96VDHTmiXVjcWC2RBsfCJ73UQyr".yellow);
console.log("");

winston.log('info', "Loaded dependencies; server %s, stratum %s", module.version, stratumModule.version);
winston.log('info', 'Running on: %s-%s [%s %s]', os.platform(), os.arch(), os.type(), os.release());
winston.log('info', 'Running over %d core system', os.cpus().length);

// check for the main configuration file.
if(!fs.existsSync('config/config.json')) {
    winston.log('error','Main configuration file config.json file does not exist.');
    return;
}

// try to increase file limits so we can as much as concurrent clients we can
try {
    var posix = require('posix');
    
    // try increasing the open file limits (so the sockets and concurrent connections)
    try {
        posix.setrlimit('nofile', { soft: 100000, hard: 100000 });
    }
    catch (e) {
        winston.log('warn', 'Failed to raise the connection limit as root is required');
    }
    finally {        
        var uid = parseInt(process.env.SUDO_UID); // find the actual user that started the server using sudp.
        
        // Set our server's uid to that user
        if (uid) {
            process.setuid(uid); // fall-back to the actual user that started the server with sudo.
            winston.log('info', 'Raised connection limit to 100k, falling back to non-root user: %s', userid.username(process.getuid()));
        }
    }
} catch (e) {
    winston.log('warn', 'Couldn\'t raise connection limit as posix module is not available');
}

//var pool = new Pool().start();
