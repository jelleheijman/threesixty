if( Meteor.isClient ) {
	Template.controllerIpadControls.helpers({
		
	});
	Template.controllerIpadControls.events({
		'click button.ipadUpper': function(event, template){
			var ipadUpperSetting = SystemSettings.findOne({name:'ipadUpper'});
			SystemSettings.update(ipadUpperSetting._id, {$set:{value:event.target.name}});
		},
	});
}