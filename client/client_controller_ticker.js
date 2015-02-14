if (Meteor.isClient){
	Template.controllerTicker.helpers({
		tickerItems: function () {
		  return TickerItems.find({}, {sort:{created:-1}});
		}
	});
	Template.controllerTicker.events({
		'click .deleteTickerItem': function(event, template){
			TickerItems.remove(event.target.name);
		},
		'submit form': function(event, template){
			TickerItems.insert( { created:new Date(), user:12345, cyclesRemaining:1, text:event.target.tickerText.value } );
			event.preventDefault();
			return false;
		}
	});
}