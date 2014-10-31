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
                                  
/**
 * Module dependencies.
 */
var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');

var app = express();

// all environments
//app.set('port', process.env.PORT || 81);
app.set('port', 81);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/about', routes.about);
app.get('/contact', routes.contact);

http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});
