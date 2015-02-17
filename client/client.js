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
	        var libsLoaded = false;
			var threejs = IRLibLoader.load('/js/three.js', {
				success: function(){ },
				error: function(){ }
			});
			if(threejs.ready() && !libsLoaded){
			    libsLoaded = true;
				var a = IRLibLoader.load('/js/html2canvas.js');
				var b = IRLibLoader.load('/js/ReconnectingWebSocketNew.js');
				var c = IRLibLoader.load('/js/TweenMax.min.js');
				var d = IRLibLoader.load('/js/EasePack.min.js');
				var e = IRLibLoader.load('/js/Ticker.js');
				var f = IRLibLoader.load('/js/DomPlane.js');
				var g = IRLibLoader.load('/js/Emojis.js');
				var h = IRLibLoader.load('/js/Emoji.js');
				var i = IRLibLoader.load('/js/OBJLoader.js');
				var j = IRLibLoader.load('/js/MTLLoader.js');
				var k = IRLibLoader.load('http://0.0.0.0:3000/js/QuestionDisplay.js', {error:function(e){console.log(e);}});
				var l;
				if (j.ready()){
					l = IRLibLoader.load('/js/OBJMTLLoader.js');   
				}
				
				if(a.ready() & b.ready() & c.ready() & d.ready() & e.ready() & f.ready() && g.ready() && h.ready() && i.ready() && j.ready() && k.ready() && l.ready() ){
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
		setTimeout(function(){
		    if (!Session.get('mongo_id')){
		        Session.set('mongo_id', Connections.findOne({deviceid:Session.get('deviceid')})._id);
		    }
		}, 2000);
	});

	Meteor.setInterval(function () {
		Meteor.call('heartbeat', Session.get('deviceid'));
	}, 5000);
	
	UI.registerHelper('toUpperCase', function(str){
	    if (str){
	        return str.toUpperCase();
	    }
	});
}


