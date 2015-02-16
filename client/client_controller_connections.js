if (Meteor.isClient){
	Template.controllerDeviceConnections.helpers({
		devices: function () {
		  if (Session.get('filter') == 'ipad'){
		  		return Connections.find({deviceid:/^[0-9]+$/}, {sort:{deviceid:1}});
		  } else {
			  	return Connections.find({deviceid:{$not:/^[0-9]+$/}}, {sort:{deviceid:1}});
		  }
		},
        singleViewVisible:function(){
            if (Session.get('activeDevice')){
                return "visible";
            } else {
                return "hidden";
            }
        },
        ipadInfo:function(){
            return Connections.findOne(Session.get('activeDevice'));
        },
        formatTime:function(thenDate){
	        if (thenDate) {
		        return new Date(thenDate).toTimeString();
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
		},
		'change .emojiSelect': function(event, template) {
		    var id = event.target.name.split('_')[1];
		    var thisConnection = Connections.findOne({deviceid:id});
		    Connections.update( thisConnection._id, {emoji:event.target.value} );
    	},
    	'click .viewConnectedDevice': function(event, template){
        	Session.set('activeDevice', event.target.name);
    	},
    	'click #closeView':function (event, template){
        	Session.set('activeDevice', undefined);
    	}
	});
	
	Template.device.helpers({
		'statusClass':function(){
			return this.status === 'connected' ? 'connected' : 'disconnected';
		}
	});

}