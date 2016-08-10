function Handler()
{
	var PORT = 12345;
	var HOST = '127.0.0.1';
	
	var client;
	
	var move_cmd = [
	    {
	        "frequency": 27.12,
	        "dead_frequency": 0.5,
	        "burst_us": 1380,
	        "spacing_us": 460,
	        "repeats": 4
	    },
	    {
	        "frequency": 27.12,
	        "dead_frequency": 0.5,
	        "burst_us": 460,
	        "spacing_us": 460,
	        "repeats": 0
	    }
	];
	var stop_cmd = [
	    {
	        "frequency": 0.5,
	        "dead_frequency": 0.5,
	        "burst_us": 1380,
	        "spacing_us": 460,
	        "repeats": 4
	    }
	];
	
	return {
		init : function(){
			console.log("init start.");
			var child_process = require('child_process');
			child_process.exec('sudo killall pi_pcm', function() {
				console.log("pi_pcm killed.");
				child_process.exec('sudo /home/pi/git/pi-rc/pi_pcm');
				console.log("pi_pcm lunched.");
				
				var dgram = require('dgram');
				client = dgram.createSocket('udp4');
				console.log("udp client ready.");
			});
		},
		move : function(x,y,z){
			console.log("move");
			var message;
			if(x == 0 && z == 0) {
				message = JSON.stringify(stop_cmd);
			} else {
				move_cmd[1]["repeats"] = 28;
				message = JSON.stringify(move_cmd);
			}
			client.send(message, 0, message.length, PORT, HOST);
		}
	};
}
module.exports = new Handler();