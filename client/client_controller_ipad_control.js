if( Meteor.isClient ) {
	Template.controllerIpadControls.helpers({
		ipadUpperActive: function(which){
			if (SystemSettings.findOne({'name':'ipadUpper'})) {
				return SystemSettings.findOne({'name':'ipadUpper'}).value == which ? 'active btn-success' : '';
			}
		},
		ipadLowerActive: function(which){
			if (SystemSettings.findOne({'name':'ipadLower'})) {
				return SystemSettings.findOne({'name':'ipadLower'}).value == which ? 'active btn-success' : '';
			}
		},
	});
	Template.controllerIpadControls.events({
		'click button.ipadUpper': function(event, template){
			var ipadUpperSetting = SystemSettings.findOne({name:'ipadUpper'});
			SystemSettings.update(ipadUpperSetting._id, {$set:{value:event.target.name}});
		},
		'click button.ipadLower': function(event, template){
			var ipadLowerSetting = SystemSettings.findOne({name:'ipadLower'});
			SystemSettings.update(ipadLowerSetting._id, {$set:{value:event.target.name}});
		}
	});
}