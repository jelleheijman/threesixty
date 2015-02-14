if (Meteor.isClient){
	Template.controllerDeviceConnections.helpers({
		devices: function () {
		  if (Session.get('filter') == 'ipad'){
		  		return Connections.find({deviceid:/^[0-9]+$/}, {sort:{deviceid:1}});
		  } else {
			  	return Connections.find({deviceid:{$not:/^[0-9]+$/}}, {sort:{deviceid:1}});
		  }
		}
	});
	Template.controllerDeviceConnections.events({
		"click .deleteConnectedDevice": function (event, template) {
			Connections.remove( event.target.name )
		},
		"click .viewConnectedDevice": function (event, template) {
		},
		"click .filter": function(event, template){
			Session.set('filter', event.target.name);
		}
	});

}