function Handler()
{
	var PORT = 12345;
	var HOST = '127.0.0.1';
	
	var client;
	
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
			//client.send(message, 0, message.length, PORT, HOST, function(err, bytes) {});
		}
	};
}
module.exports = new Handler();