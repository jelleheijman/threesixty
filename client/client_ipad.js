
if (Meteor.isClient) {
	var mongoId;
	$(window).load(function(){
		setTimeout( function(){
			if (Users.findOne({'ipadId':Session.get('ipadId')}) === undefined){
				Users.insert({'ipadId':Session.get('ipadId')});
				console.log('iPad ID doesn\'t exist. Creating new for ' + Session.get('ipadId'));
			} else {
				console.log('iPad ID already exists');
			}
			mongoId = Users.findOne({'ipadId':Session.get('ipadId')})._id;
	
	
			var settingsCursor = SystemSettings.find({});
			//var initializingSettings = true;
			var settingsOberver = settingsCursor.observe({
	            changed: function(newTickerItem, oldTickerItem){
					updateSettings(newTickerItem);
	            },
	            added: function(newTickerItem, oldTickerItem){
					updateSettings(newTickerItem);
	            },
		    });
		    //initializingSettings = false;
		    
		    var initialSettings
		    	
		}, 2000);
	});
	
	function updateSettings(newTickerItem){
		switch (newTickerItem.name) {
			case 'ipadUpper':
				$(".upper").addClass('hidden');
				$("#" + newTickerItem.value).removeClass('hidden');
		}
	}
	
	Meteor.setInterval(function () {
		Meteor.call('heartbeat', Session.get('ipadId'));
	}, 5000);

	
	Template.ipad.helpers({
		fdsfdsa: function(){
			var contentStatus = SystemSettings.find({'name':'ipadUpper'}).fetch();
			if (tickerStatus.length > 0) {
				return tickerStatus[0].onOff.toUpperCase();
			}
		}
	});
	Template.ipad.events({
		'click #emoji button': function(event, template){
			Users.update(mongoId, {$set:{emoji:event.target.name}});
		}
	});
	

}


