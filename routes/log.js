/**
 * New node file
 */

var fs = require('fs');

module.exports.logToFile = function(req,res,action){
	var name = '';
	var timestamp = new Date;

	var msg = timestamp; 
	if(typeof req.session.username === "undefined"){
		name = 'anonymous';
		msg = timestamp + ' || ' + name +' || '+ action+'\n'; 
	}
	else{
		name = req.session.username;
		msg = timestamp + ' || ' + name +' || '+ action+'\n';
	}
	
	
	 
	var filename = "../routes/logs/"+name;
	
	fs.appendFile(filename,msg,function(err){
		  if(err)
		    console.error(err);
		  console.log('Appended!');
		});

}
