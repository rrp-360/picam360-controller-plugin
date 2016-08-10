var gamepad = require("gamepad");

gamepad.init();
console.log('gamepad : ' + gamepad.numDevices());

setInterval(gamepad.processEvents, 16);

var throttle = {
	'r_h' : 0,
	'r_v' : 0,
	'l_h' : 0,
	'l_v' : 0,
};
var priorControls = {};
// Listen for move events on all gamepads
gamepad.on("move", function(id, axis, value) {
//	console.log("move", {
//		id : id,
//		axis : axis,
//		value : value,
//	});
	value *= Math.abs(value);
	var control_update = false;
	switch (axis) {
	case 0:
		control_update = true;
		throttle.r_h = value;
		break;
	case 1:
		control_update = true;
		throttle.r_v = value;
		break;
	case 3:
		control_update = true;
		throttle.l_h = value;
		break;
	case 4:
		control_update = true;
		throttle.l_v = value;
		break;
	}
	if (control_update) {
		var power = 1.0;
		var controls = {};
		controls.throttle = throttle.r_v * power;
		controls.yaw = throttle.r_h * power * 1.5;
		controls.yaw = Math.min(Math.max(controls.yaw, -1), 1);
		if (controls.throttle < 0)
			controls.yaw = controls.yaw * -1;
		controls.lift = throttle.l_v * power;
		controls.pitch = 0;
		controls.roll = 0;
		for ( var control in controls) {
			if (controls[control] != priorControls[control]) {
				socket.emit(control, controls[control]);
				console.log(control + " : " + controls[control]);
			}
		}
		priorControls = controls;
	}
});

var light = 0;
// Listen for button up events on all gamepads
gamepad.on("up", function(id, num) {
	console.log("up", {
		id : id,
		num : num,
	});
	switch (num) {
	case 0:
		light -= 0.1;
		if (light < 0) {
			light = 0;
		}
		socket.emit('brightness_update', light);
		break;
	case 1:
		light += 0.1;
		if (light > 1) {
			light = 1;
		}
		socket.emit('brightness_update', light);
		break;
	case 7:
		socket.emit('laser_update');
		break;
	}
});

var client = require('socket.io-client');
var socket = client.connect('http://192.168.254.1:8080');
console.log('started!!');
socket.on('connect', function() {
	setInterval(function() {
		var _starttime = new Date();
		console.log('ping!!');
		socket.emit('ping', _starttime);
	}, 500);
	socket.on('pong', function(id) {
		console.log('pong!!' + arguments[0]);
	});
});
