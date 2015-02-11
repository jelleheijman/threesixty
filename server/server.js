

if (Meteor.isServer) {
	SystemSettings = new Mongo.Collection("system_settings");
	Users = new Mongo.Collection("users");
	TickerItems = new Mongo.Collection("ticker_items");
	Connections = new Mongo.Collection("connections");
	
	
	Meteor.methods({
	  	heartbeat: function (ipadId) {
		  	if (ipadId === null){
			  	return;
		  	}
		    if (!Connections.findOne({ipadId:ipadId})) {
		    	Connections.insert({ipadId: ipadId});
		    }
		    Connections.update({ipadId:ipadId}, {$set: {last_seen: (new Date()).getTime(), status:'connected'}});
	  	}
	});
	
	Meteor.setInterval(function () {
	  var now = (new Date()).getTime();
	  //console.log(Connections.find().fetch());
	  Connections.find({last_seen: {$lt: (now - 60 * 1000)}}).forEach(function (user) {
			if (user.status == 'connected') {
	    		Connections.update({ipadId:user.ipadId}, {$set: {status:'disconnected'}});
	    	}
	  });
	}, 5000);
	
}