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
            Connections.insert({deviceid:id, emoji:'neutral'});
        }
    }
	var baseSettings = ['activeQuestion', 'ipadUpper'];
	for (i=0; i<baseSettings.length; i++){
    	if (!SystemSettings.findOne({name:baseSettings[i]})){
        	SystemSettings.insert({name:baseSettings[i], value:''});
        }    	
	}
	
	if (!SystemSettings.findOne({name:'emojis'})) {
    	SystemSettings.insert({name:'emojis', 'value':['happy', 'sad', 'neutral']});
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