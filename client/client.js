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
	

	
	Connections = new Mongo.Collection("connections");
	Connections.allow({
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
	Questions = new Mongo.Collection("questions");
	Questions.allow({
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
	TickerItems = new Mongo.Collection("ticker_items");

	Router.route('/controller_wall', function(){
		Session.set('deviceid', 'controller_wall');
		this.render('controllerWall');
	});
	
	Router.route('/controller_ticker', function(){
		Session.set('deviceid', 'controller_ticker');
		this.render('controllerTicker');
	});
	Router.route('/controller_ipad_controls', function(){
		Session.set('deviceid', 'controller_ipad_controls');
		this.render('controllerIpadControls');
	});
	Router.route('/controller_device_connections', function(){
		Session.set('deviceid', 'controller_device_connections');
		this.render('controllerDeviceConnections');
	});
	Router.route('/controller_questions', function(){
		Session.set('deviceid', 'controller_questions');
		this.render('controllerQuestions');
	});
	Router.route('/wall', {
	    onBeforeAction: function(){
			var threejs = IRLibLoader.load('/js/three.js', {
				success: function(){ },
				error: function(){ }
			});
			if(threejs.ready()){
				
				var a = IRLibLoader.load('/js/html2canvas.js', {
					success: function(){ },
					error: function(){ }
				});
				var b = IRLibLoader.load('/js/ReconnectingWebSocketNew.js', {
					success: function(){ },
					error: function(){  }
				});
				var c = IRLibLoader.load('/js/TweenMax.min.js', {
					success: function(){ },
					error: function(){ }
				});
				var d = IRLibLoader.load('/js/EasePack.min.js', {
					success: function(){  },
					error: function(){  }
				});
				var e = IRLibLoader.load('/js/Ticker.js', {
					success: function(){ },
					error: function(){ }
				});
				var f = IRLibLoader.load('/js/DomPlane.js', {
					success: function(){ },
					error: function(){  }
				});
				
				if(a.ready() & b.ready() & c.ready() & d.ready() & e.ready() & f.ready() ){
					this.next();
				}
			}
		},
		action: function(){
			Session.set('deviceid', 'wall');
			this.render('wall');
		}		
	});
	Router.route('/i/:id', function(){
		Session.set('deviceid', this.params.id);
		this.render('ipad');
	});

	Meteor.setInterval(function () {
		Meteor.call('heartbeat', Session.get('deviceid'));
	}, 5000);
}


