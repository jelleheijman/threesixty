
if (Meteor.isClient) {

	Template.controllerMain.helpers({
		tickerStatus: function(){
			var tickerStatus = SystemSettings.find({'name':'tickerStatus'}).fetch();
			if (tickerStatus.length > 0) {
				return tickerStatus[0].onOff.toUpperCase();
			}
			
		}
	});
	Template.controllerMain.events({
		'click #ticker': function(event, template){
			var tickerStatus = SystemSettings.findOne({'name':'tickerStatus'});
			if (tickerStatus.onOff == 'on'){
				newStatus = 'off';
			} else {
				newStatus = 'on';
			}
			SystemSettings.update({'_id':tickerStatus._id}, {$set:{onOff:newStatus}});
		}
	});
	
	
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
	
	
	Template.controllerIpadControls.helpers({
		
	});
	Template.controllerIpadControls.events({
		'click button.ipadUpper': function(event, template){
			var ipadUpperSetting = SystemSettings.findOne({name:'ipadUpper'});
			SystemSettings.update(ipadUpperSetting._id, {$set:{value:event.target.name}});
		},
	});
	
	Template.controllerIpadConnections.helpers({
		iPads: function () {
		  return Connections.find({}, {sort:{ipadId:1}});
		}
	});
		
	
	Template.navigation.helpers({
		activeIfTemplateIs: function (template) {
			  var currentRoute = Router.current();
			  var currentTemplate = currentRoute.lookupTemplate();
			  if (template == currentTemplate){
				  return "active";
			  } else {
				  return "";
			  }
		}
	});
}


