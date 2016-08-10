function Handler()
{
	var PORT = 12345;
	var HOST = '127.0.0.1';
	
	function get_index(v) {
		if(v < 0) {
			return 0;
		} else if(v == 0) {
			return 1;
		} else {
			return 2;
		}
	}
	var repeat_data = [
		//left
		[1,46,1],//backward,nutral,forward
		//nutral
		[52,1,34],//backward,nutral,forward
		//right
		[1,28,1]//backward,nutral,forward
	];
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
	        "repeats": 1
	    }
	];
	var stop_cmd = [
	    {
	        "frequency": 0.5,
	        "dead_frequency": 0.5,
	        "burst_us": 1380,
	        "spacing_us": 460,
	        "repeats": 4
	    },
	    {
	        "frequency": 0.5,
	        "dead_frequency": 0.5,
	        "burst_us": 460,
	        "spacing_us": 460,
	        "repeats": 1
	    }
	];
	
	return {
		init : function(){
			console.log("init start.");
			var child_process = require('child_process');
			child_process.exec('sudo killall pi_pcm', function() {
				console.log("pi_pcm killed.");
				
				var lunch_pi_pcm = function() {
					console.log("pi_pcm lunched.");
					child_process.exec('sudo /home/pi/git/pi-rc/pi_pcm', lunch_pi_pcm);
				};
				
				console.log("udp client ready.");
			});
		},
		move : function(x,y,z){
			console.log("move");
			var message;
			if(x == 0 && z == 0) {
				message = JSON.stringify(stop_cmd);
			} else {
				move_cmd[1]["repeats"] = repeat_data[get_index(x)][get_index(z)];
				message = JSON.stringify(move_cmd);
			}
			var buffer = new Buffer(message);
			var dgram = require('dgram');
			var client = dgram.createSocket('udp4');
			client.send(buffer, 0, buffer.length, PORT, HOST, function(err, bytes) {
			    if (err) throw err;
			    console.log('UDP message sent to ' + HOST +':'+ PORT);
				console.log("send : " + message);
			    client.close();
			});
		}
	};
}
module.exports = new Handler();