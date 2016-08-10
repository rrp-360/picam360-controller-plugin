process.chdir(__dirname);

var gamepad = require("gamepad");

gamepad.init();
console.log('gamepad : ' + gamepad.numDevices());
console.log(gamepad);

var protocol_name = "life-radicon003";
var handler = require(["./protocols", protocol_name, protocol_name + ".js"].join("/"));

handler.init();

setInterval(gamepad.processEvents, 16);

var values = [];
// Listen for move events on all gamepads
gamepad.on("move", function(id, axis, value) {
	console.log("move", {
		id : id,
		axis : axis,
		value : value,
	});
	values[axis] = value;
	if(axis == 6 || axis == 7) {
		handler.move(values[6], 0, values[7]);
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