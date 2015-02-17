Meteor.startup( function(){
	SystemSettings = new Mongo.Collection("system_settings");
	Users = new Mongo.Collection("users");
	TickerItems = new Mongo.Collection("ticker_items");
	Connections = new Mongo.Collection("connections");
	Questions = new Mongo.Collection("questions");
	
	var numIpads = 100;

    for (var i=1; i<=numIpads; i++){
        var id = i.toString();
        if (id.length == 1){
            id = '00' + id;
        } else if (id.length == 2){
            id = '0' + id;
        }
        if (!Connections.findOne({deviceid:id})){
            Connections.insert({deviceid:id, type:'ipad', answers:[], emoji:'neutral'});
        }
    }
	var baseSettings = [{name:'activeQuestion', def:''}, {name:'ipadUpper', def:'standby'}];
	for (i=0; i<baseSettings.length; i++){
    	if (!SystemSettings.findOne({name:baseSettings[i].name})){
        	SystemSettings.insert({name:baseSettings[i].name, value:baseSettings[i].def});
        }    	
	}
	
	if (!SystemSettings.findOne({name:'emojis'})) {
    	SystemSettings.insert({name:'emojis', 'value':['happy', 'eyeRoll', 'neutral']});
	}
	
});

if (Meteor.isServer) {
	Meteor.methods({
	  	heartbeat: function (deviceid) {
		  	if (deviceid === null){
			  	return;
		  	}
		    if (!Connections.findOne({deviceid:deviceid})) {
		    	Connections.insert({deviceid:deviceid});
		    }
		    Connections.update({deviceid:deviceid}, {$set: {last_seen: (new Date()).getTime(), status:'connected'}});
	  	},
	  	answerQuestion:function(deviceid, question, answer){
            Connections.update( {_id:deviceid, "answers.question" : question}, {$set:{'answers.$.answer': answer}} );
	  		Connections.update( {_id:deviceid, "answers.question" : {$ne:question}} ,
								{$addToSet : {"answers": {'question':question, 'answer':answer  }} }
							  );
							  
							  

							  
							  
	  	}
	});
	Meteor.setInterval(function () {
	  var now = (new Date()).getTime();
	  Connections.find({last_seen: {$lt: (now - 60 * 1000)}}).forEach(function (user) {
			if (user.status == 'connected') {
	    		Connections.update({deviceid:user.deviceid}, {$set: {status:'disconnected'}});
	    	}
	  });
	}, 5000);	
}