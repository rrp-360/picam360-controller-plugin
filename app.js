process.chdir(__dirname);

var gamepad = require("gamepad");

gamepad.init();
console.log('gamepad : ' + gamepad.numDevices());
console.log(gamepad);

var protocol_name = "life-radicon003";
var handler = require(["./protocols", protocol_name, protocol_name + ".js"].join("/"));

handler.init();

setInterval(gamepad.processEvents, 16);

// Listen for move events on all gamepads
gamepad.on("move", function(id, axis, value) {
	console.log("move", {
		id : id,
		axis : axis,
		value : value,
	});
	switch (axis) {
	case 0:
		break;
	case 1:
		break;
	case 3:
		break;
	case 4:
		break;
	}
});

// Listen for button up events on all gamepads
gamepad.on("up", function(id, num) {
	console.log("up", {
		id : id,
		num : num,
	});
	switch (num) {
	case 0:
		break;
	case 1:
		break;
	case 7:
		break;
	}
});