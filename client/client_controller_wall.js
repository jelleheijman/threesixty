if (Meteor.isClient){
	Template.controllerWall.helpers({
		tickerActive: function(){
			if (SystemSettings.findOne({'name':'tickerStatus'})) {
				return SystemSettings.findOne({'name':'tickerStatus'}).value == 'on' ? 'active btn-success' : '';
			}
		},
		tickerText: function(){
			if (SystemSettings.findOne({'name':'tickerStatus'})) {
				return SystemSettings.findOne({'name':'tickerStatus'}).value == 'on' ? 'On' : 'Off';
			}
		},
		sceneActive: function(which){
			if (SystemSettings.findOne({'name':'activeScene'})) {
				return SystemSettings.findOne({'name':'activeScene'}).value == which ? 'active btn-success' : '';
			}
		},
		modeVisible: function(which){
			if (SystemSettings.findOne({'name':'activeScene'})) {
				return SystemSettings.findOne({'name':'activeScene'}).value == which ? 'visible' : 'hidden';
			}
		},
		modeActive: function( scene, which ){
			if (SystemSettings.findOne({'name':scene + 'Mode'})) {
				return SystemSettings.findOne({'name':scene + 'Mode'}).value == which ? 'active btn-success' : '';
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
		},
		'click .scene': function(event, template){
			var activeSceneSetting = SystemSettings.findOne({'name':'activeScene'});
			SystemSettings.update( activeSceneSetting._id, {$set:{value:event.target.name}} );
		},
		'click .questionMode':function( event, template){
			var questionModeSetting = SystemSettings.findOne({'name':'questionMode'});
			SystemSettings.update( questionModeSetting._id, {$set:{value:event.target.name}} );
		},
		'click .emojiMode':function( event, template ){
			var questionModeSetting = SystemSettings.findOne({'name':'emojiMode'});
			SystemSettings.update( questionModeSetting._id, {$set:{value:event.target.name}} );
		}
		
	});    
}