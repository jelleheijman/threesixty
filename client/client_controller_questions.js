if (Meteor.isClient) {
	Template.controllerQuestions.helpers({
		questions: function(){
			var activeQuestion = SystemSettings.findOne({name:'activeQuestion'});
			var questions = Questions.find().fetch();
			if (activeQuestion){
    			for (var i=0; i<questions.length; i++){
    				if (questions[i]._id == activeQuestion.value){
    					questions[i].isActive = true;
    				} else {
    					questions[i].isActive = false;
    				}
    			}
			}
			return questions;
		},
		questionData:function(key){
		    if (Session.get('editQuestion')){
    		    return Session.get('editQuestion')[key];
    		} else {
        		return null;
    		}
		},
		questionFormHeader: function(){
			if (Session.get('activeQuestion')){
				return "EDIT QUESTION";
			} else {
				return "ADD QUESTION";
			}
		},
		questionFormVisible: function(){
    		if (Session.get('editQuestion')){
        		return '';
    		} else {
        		return 'hidden';
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
				if ( editQuestion == 'new' ){
				    Questions.insert( newVals );
				} else {
					Questions.update( editQuestion._id, {$set:newVals} );
				}
				event.target.questionText.value = '';
				event.target.answer1.value = '';
				event.target.answer2.value = '';
				event.target.answer3.value = '';
				event.target.answer4.value = '';
				event.target.answer5.value = '';
				event.target.answer6.value = '';
			}
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
		},
		'click #addQuestion':function(event, template){
			Session.set('editQuestion', 'new');
		},
		'click .editQuestion':function(event, template){
			var activeQuestion = Questions.findOne(event.target.name);
			if (activeQuestion){			
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
}	