if (Meteor.isClient) {
	SystemSettings = new Mongo.Collection("system_settings");
	SystemSettings.allow({
	  insert: function () {
	    return true;
	  },
	  update: function () {
	    return true;
	  }
	});
	
	Users = new Mongo.Collection("users");
	Users.allow({
	  insert: function () {
	    return true;
	  },
	  update: function () {
	    return true;
	  },
	   remove: function () {
	    return true;
	  }
	});
	
	Connections = new Mongo.Collection("connections");
	
	
	TickerItems = new Mongo.Collection("ticker_items");
	Router.route('/controller', function(){
		this.render('controllerMain');
	});
	Router.route('/controller_ticker', function(){
		this.render('controllerTicker');
	});
	Router.route('/controller_ipad_controls', function(){
		this.render('controllerIpadControls');
	});
	Router.route('/controller_ipad_connections', function(){
		this.render('controllerIpadConnections');
	});
	Router.route('/wall', function(){
		this.render('wall');
	});
	Router.route('/i/:id', function(){
		Session.set('ipadId', this.params.id);
		this.render('ipad');
	});

	
}


