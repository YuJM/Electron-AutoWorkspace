var app = require('app');  // Module to control application life.
var browserWindow = require('browser-window'); 

app.on('ready', function() {
		var appWindow = new browserWindow({width:800,height:600});
		appWindow.loadUrl('file://'+__dirname+'/index.html');
	});