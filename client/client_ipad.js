
if (Meteor.isClient) {

	Template.ipad.rendered = function(){
		setTimeout( function(){
		   	console.log(Users.find().fetch());
			if (Users.findOne({'ipadid':Session.get('ipadid')}) === undefined){
				Users.insert({'ipadid':Session.get('ipadid')});
				console.log('iPad ID doesn\'t exist. Creating new for ' + Session.get('ipadid'));
			} else {
				console.log('iPad ID already exists');
			}
			Session.set('mongoid', Users.findOne({'ipadid':Session.get('ipadid')})._id);
	
	
			var settingsCursor = SystemSettings.find({});

			var settingsOberver = settingsCursor.observe({
	            changed: function(newTickerItem, oldTickerItem){
					updateSettings(newTickerItem);
	            },
	            added: function(newTickerItem, oldTickerItem){
					updateSettings(newTickerItem);
	            },
		    });
		}, 2000);

		function updateSettings(newTickerItem){
			switch (newTickerItem.name) {
				case 'ipadUpper':
					$(".upper").addClass('hidden');
					$("#" + newTickerItem.value).removeClass('hidden');
					break;
		}
	}

	};
	

	
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
			Users.update(session.get('mongoid'), {$set:{emoji:event.target.name}});
		}
	});


}


