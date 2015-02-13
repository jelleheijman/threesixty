if (Meteor.isClient) {

	///////////////////////////////////////////////////////////////////////////////
	///////////////////   CONTROLLER MAIN PAGE  ///////////////////////////////////
	///////////////////////////////////////////////////////////////////////////////
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
			var activeQuestion = SystemSettings.findOne({name:'activeQuestion'});
			var questions = Questions.find().fetch();
			for (var i=0; i<questions.length; i++){
				if (questions[i]._id == activeQuestion.value){
					questions[i].isActive = true;
				} else {
					questions[i].isActive = false;
				}
			}
			return questions;
		},
		questionText: function(){
			if (Session.get('editQuestion')){
				return Session.get('editQuestion').questionText;
			}
		},
		answer1: function(){
			if (Session.get('editQuestion')){
				return Session.get('editQuestion').answer1;
			}
		},
		answer2: function(){
			if (Session.get('editQuestion')){
				return Session.get('editQuestion').answer2;
			}
		},
		answer3: function(){
			if (Session.get('editQuestion')){
				return Session.get('editQuestion').answer3;
			}
		},
		answer4: function(){
			if (Session.get('editQuestion')){
				return Session.get('editQuestion').answer4;
			}
		},
		answer5: function(){
			if (Session.get('editQuestion')){
				return Session.get('editQuestion').answer5;
			}
		},
		answer6: function(){
			if (Session.get('editQuestion')){
				return Session.get('editQuestion').answer6;
			}
		},
		questionFormHeader: function(){
			if (Session.get('activeQuestion')){
				return "EDIT QUESTION";
			} else {
				return "ADD QUESTION";
			}
		}
	});
	Template.controllerQuestions.events({
		'submit form': function(event, template){
			if (event.target.questionText.value.length > 5){
				
				var newVals = {		questionText:event.target.questionText.value,
									answer1:event.target.answer1.value,
									answer2:event.target.answer2.value,
									answer3:event.target.answer3.value,
									answer4:event.target.answer4.value,
									answer5:event.target.answer5.value,
									answer6:event.target.answer6.value,
									
								};
				var editQuestion = Session.get('editQuestion');
				if ( editQuestion ){
					Questions.update( editQuestion._id, {$set:newVals} );
				} else {
					Questions.insert( newVals );
				}
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
			Session.set('editQuestion', undefined);
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
			Session.set('editQuestion', undefined);
			$('#fadeout').fadeOut();
			$('#questionForm').fadeOut();
		},
		'click #addQuestion':function(event, template){
			$('#fadeout').fadeIn();
			$('#questionForm').fadeIn();
		},
		'click .editQuestion':function(event, template){
			var activeQuestion = Questions.findOne(event.target.name);
			if (activeQuestion){
				$('#fadeout').fadeIn();
				$('#questionForm').fadeIn();				
				Session.set('editQuestion', activeQuestion);
			}
		},
		'click .deleteQuestion':function(event, template){
			Questions.remove(event.target.name);
		},
		'click .setActiveQuestion':function(event, template){
			var id = SystemSettings.findOne({'name':'activeQuestion'})._id;
			SystemSettings.update(id, {$set:{value:event.target.name}});
		}
	});

	///////////////////////////////////////////////////////////////////////////////
	//////////////   CONTROLLER IPAD CONNECTIONS PAGE  ////////////////////////////
	///////////////////////////////////////////////////////////////////////////////
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


