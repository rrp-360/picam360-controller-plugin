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
		[64,46,40],//forward,nutral,backward
		//nutral
		[34,1,52],//forward,nutral,backward
		//right
		[10,28,58]//forward,nutral,backward
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
	
	var child_process = require('child_process');
	var client = null;
	
	function get_client(callback) {
		if(client == null) {
			console.log("init start.");
			var lunch_pi_pcm = function() {
				console.log("pi_pcm lunched.");
				child_process.exec('sudo /home/pi/git/pi-rc/pi_pcm', lunch_pi_pcm);
			};
			lunch_pi_pcm();
				
			var dgram = require('dgram');
			client = dgram.createSocket('udp4');
			console.log("udp client ready.");
		}
		callback(client);
	}
	
	var _this =  {
		init : function(){
			console.log("init start.");
			child_process.exec('sudo killall pi_pcm', function() {
				console.log("pi_pcm killed.");
			});
		},
		move : function(x,y,z){
			//console.log("move");
			get_client(function(client){
				var message;
				if(x == 0 && z == 0) {
					message = JSON.stringify(stop_cmd);
				} else {
					move_cmd[1]["repeats"] = repeat_data[get_index(x)][get_index(z)];
					message = JSON.stringify(move_cmd);
				}
				var buffer = new Buffer(message);
				client.send(buffer, 0, buffer.length, PORT, HOST, function(err, bytes) {
					//console.log("send : " + message);
				});
			});
		}
	};
	return _this;
}
module.exports = new Handler();