function Handler()
{
	return {
		init : function(){
		},
		move : function(x,y,z){
			console.log("move");
		}
	};
}
module.exports = new Handler();