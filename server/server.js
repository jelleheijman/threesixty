

if (Meteor.isServer) {
	SystemSettings = new Mongo.Collection("system_settings");
	Users = new Mongo.Collection("users");
	TickerItems = new Mongo.Collection("ticker_items");
	Connections = new Mongo.Collection("connections");
	Questions = new Mongo.Collection("questions");

	Meteor.methods({
	  	heartbeat: function (deviceid) {
		  	if (deviceid === null){
			  	return;
		  	}
		  	console.log(deviceid);
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