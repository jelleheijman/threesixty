if (Meteor.isClient) {

	///////////////////////////////////////////////////////////////////////////////
	///////////////////   CONTROLLER MAIN PAGE  ///////////////////////////////////
	///////////////////////////////////////////////////////////////////////////////
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
	

	///////////////////////////////////////////////////////////////////////////////
	///////////////////   CONTROLLER TICKER PAGE  /////////////////////////////////
	///////////////////////////////////////////////////////////////////////////////	
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
	
	
		///////////////////////////////////////////////////////////////////////////////
	///////////////////   CONTROLLER TICKER PAGE  /////////////////////////////////
	///////////////////////////////////////////////////////////////////////////////	
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
	

	///////////////////////////////////////////////////////////////////////////////
	///////////////////   CONTROLLER IPAD CONTROLS PAGE  //////////////////////////
	///////////////////////////////////////////////////////////////////////////////	
	Template.controllerIpadControls.helpers({
		
	});
	Template.controllerIpadControls.events({
		'click button.ipadUpper': function(event, template){
			var ipadUpperSetting = SystemSettings.findOne({name:'ipadUpper'});
			SystemSettings.update(ipadUpperSetting._id, {$set:{value:event.target.name}});
		},
	});

	///////////////////////////////////////////////////////////////////////////////
	///////////////////////   CONTROLLER QUESTIONS PAGE  //////////////////////////
	///////////////////////////////////////////////////////////////////////////////	
	Template.controllerQuestions.helpers({
		questions: function(){
			return Questions.find().fetch();
		}
	});
	Template.controllerQuestions.events({
		'submit form': function(event, template){
			if (event.target.questionText.value.length > 5){
				Questions.insert({
									questionText:event.target.questionText.value,
									answer1:event.target.answer1.value,
									answer2:event.target.answer2.value,
									answer3:event.target.answer3.value,
									answer4:event.target.answer4.value,
									answer5:event.target.answer5.value,
									answer6:event.target.answer6.value,
									
								});
				event.target.questionText.value = '';
				event.target.answer1.value = '';
				event.target.answer2.value = '';
				event.target.answer3.value = '';
				event.target.answer4.value = '';
				event.target.answer5.value = '';
				event.target.answer6.value = '';
			}
			$('#questionForm').fadeOut();
			$('#fadeout').fadeOut();
			event.preventDefault();
			return false;
		},
		'click #closeQuestion':function(event, template){
			$('form [name="questionText"]').val('');
			$('form [name="answer1"]').val('');
			$('form [name="answer2"]').val('');
			$('form [name="answer3"]').val('');
			$('form [name="answer4"]').val('');
			$('form [name="answer5"]').val('');
			$('form [name="answer6"]').val('');
			$('#fadeout').fadeOut();
			$('#questionForm').fadeOut();
		},
		'click #addQuestion':function(event, template){
			$('#fadeout').fadeIn();
			$('#questionForm').fadeIn();
		},
		'click .editQuestion':function(event, template){
			$('#fadeout').fadeIn();
			$('#questionForm').fadeIn();
		}
	});



	///////////////////////////////////////////////////////////////////////////////
	//////////////   CONTROLLER IPAD CONNECTIONS PAGE  ////////////////////////////
	///////////////////////////////////////////////////////////////////////////////
	Template.controllerIpadConnections.helpers({
		iPads: function () {
		  return Users.find({}, {sort:{ipadid:1}});
		}
	});
		

	///////////////////////////////////////////////////////////////////////////////
	/////////////////////////   CONTROLLER NAVIGATION  ////////////////////////////
	///////////////////////////////////////////////////////////////////////////////	
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


