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
		msg = timestamp + ' || ' + name +' || '+ action+'\r\n'; 
	}
	else{
		name = req.session.username;
		msg = timestamp + ' || ' + name +' || '+ action+'\r\n';
	}
	 
	var filename = "../routes/logs/"+name+'.txt';
	
	fs.appendFile(filename,msg,function(err){
		  if(err)
		    console.error(err);
		  console.log('Appended!');
		});

}


module.exports.bidLogToFile = function(req,res,itemid,bidamount,action){
	console.log('---------------------------------------');
	var name = '';
	var timestamp = new Date;

	/*var msg = timestamp; 
	if(typeof req.session.username === "undefined"){
		name = 'anonymous';
		msg = timestamp + ' || ' + name +' || '+ action+'\n'; 
	}
	else{*/
		name = req.session.username;
		msg = timestamp + ' || ' + name +' || '+action + itemid + '|| and amount is ||'+bidamount+'\r\n';
	//}
	 
	var filename = "../routes/logs/"+itemid+'.txt';
	
	fs.appendFile(filename,msg,function(err){
		  if(err)
		    console.error(err);
		  console.log('Appended!');
		});

}
