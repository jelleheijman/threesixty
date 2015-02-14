if (Meteor.isClient){
	Template.controllerWall.helpers({
		tickerStatus: function(){
			var tickerStatus = SystemSettings.find({'name':'tickerStatus'}).fetch();
			if (tickerStatus.length > 0) {
				return tickerStatus[0].value.toUpperCase();
			}
			
		}
	});
	Template.controllerWall.events({
		'click #ticker': function(event, template){
			var tickerStatus = SystemSettings.findOne({'name':'tickerStatus'});
			if (tickerStatus.value == 'on'){
				newStatus = 'off';
			} else {
				newStatus = 'on';
			}
			SystemSettings.update({'_id':tickerStatus._id}, {$set:{value:newStatus}});
		}
	});    
}