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

var Stratum = require('hpool-stratum');
var colors = require("colors");
var pkgJson = require('./package.json');

console.log("");
console.log(" ██╗  ██╗██████╗  ██████╗  ██████╗ ██╗     ".yellow);
console.log(" ██║  ██║██╔══██╗██╔═══██╗██╔═══██╗██║     ".yellow);
console.log(" ███████║██████╔╝██║   ██║██║   ██║██║     ".yellow);
console.log(" ██╔══██║██╔═══╝ ██║   ██║██║   ██║██║     ".yellow);
console.log(" ██║  ██║██║     ╚██████╔╝╚██████╔╝███████╗".yellow);
console.log(" ╚═╝  ╚═╝╚═╝      ╚═════╝  ╚═════╝ ╚══════╝ v%s".yellow, pkgJson.version);
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
