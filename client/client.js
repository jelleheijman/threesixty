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
		Session.set('deviceid', 'controller_main');
		this.render('controllerMain');
	});
	
	Router.route('/controller_ticker', function(){
		Session.set('deviceid', 'controller_ticker');
		this.render('controllerTicker');
	});
	Router.route('/controller_ipad_controls', function(){
		Session.set('deviceid', 'controller_ipad_controls');
		this.render('controllerIpadControls');
	});
	Router.route('/controller_ipad_connections', function(){
		Session.set('deviceid', 'controller_ipad_connections');
		this.render('controllerIpadConnections');
	});
	Router.route('/wall', {
	    onBeforeAction: function(){
			var threejs = IRLibLoader.load('http://threesixty/js/three.js', {
				success: function(){ },
				error: function(){ }
			});
			if(threejs.ready()){
				
				var a = IRLibLoader.load('http://threesixty/js/html2canvas.js', {
					success: function(){ },
					error: function(){ }
				});
				var b = IRLibLoader.load('http://threesixty/js/ReconnectingWebSocketNew.js', {
					success: function(){ },
					error: function(){  }
				});
				var c = IRLibLoader.load('http://threesixty/js/TweenMax.min.js', {
					success: function(){ },
					error: function(){ }
				});
				var d = IRLibLoader.load('http://threesixty/js/EasePack.min.js', {
					success: function(){  },
					error: function(){  }
				});
				var e = IRLibLoader.load('http://threesixty/js/Ticker.js', {
					success: function(){ },
					error: function(){ }
				});
				var f = IRLibLoader.load('http://threesixty/js/DomPlane.js', {
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


