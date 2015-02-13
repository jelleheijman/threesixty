
if (Meteor.isClient) {

	Template.ipad.rendered = function(){
		setTimeout( function(){
			if (Connections.findOne({'deviceid':Session.get('deviceid')}) === undefined){
				Connections.insert({'deviceid':Session.get('deviceid'), type:'ipad'});
				console.log('iPad ID doesn\'t exist. Creating new for ' + Session.get('deviceid'));
			} else {
				console.log('iPad ID already exists');
			}
			Session.set('mongoid', Connections.findOne({'deviceid':Session.get('deviceid')})._id );
	
	
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

	});
	Template.ipad.events({
		'click #emoji button': function(event, template){
			Connections.update(Session.get('mongoid'), {$set:{emoji:event.target.name}});
		},
		'submit form': function(event, template){
			console.log(Session.deviceid);
			TickerItems.insert( { created:new Date(), user:Session.get('deviceid'), approved:true, cyclesRemaining:1, text:event.target.message.value } );
			$('#messageInput').val('');
			event.preventDefault();
			return false;
		}
	});
}
