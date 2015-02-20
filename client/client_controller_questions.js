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
		questionData:function(key, which){
			return Session.get(which) ? Session.get(which)[key] : null;		
		},
		questionFormHeader: function(){
			return Session.get('editQuestion') != 'new' ? "EDIT QUESTION" : "ADD QUESTION";		
		},
		questionFormVisible: function(){
			return Session.get('editQuestion') ? '' : 'hidden';		
		},
		questionViewVisible: function(){
			return Session.get('viewQuestion') ? '' : 'hidden';		
		},
		fadeoutVisible: function(){
    		return Session.get('editQuestion') || Session.get('viewQuestion') ? '' : 'hidden';
		},
		answerVisible: function(answer){
		    if (Session.get('viewQuestion')){
    			return Session.get('viewQuestion')[answer].length > 0 ? '' : 'hidden';
    		}
		},
		answerPercent: function(answer){
            var ipads = Connections.find({type:'ipad'}).fetch();
            var votesForThisAnswer = 0;
            var total = 0;
            for (var i=0; i<ipads.length; i++){
                for (var j=0; j<ipads[i].answers.length; j++){
                    if (ipads[i].answers[j].question == Session.get('viewQuestion')._id){
                        
                        var thisAnswer = ipads[i].answers[j].answer;
                        if (thisAnswer){
                            total++;
                        }
                        if (thisAnswer == answer){
                            votesForThisAnswer++;
                        }
                    }
                }
            }
            if (total > 0){
                return (votesForThisAnswer / total * 100).toFixed(1);
            }   
		}
	});
	Template.controllerQuestions.events({
		'click #addQuestion':function(event, template){
			Session.set('editQuestion', 'new');
		},
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
					newVals.result1 = {votes:0, percent:0},
					newVals.result2 = {votes:0, percent:0},
					newVals.result3 = {votes:0, percent:0},
					newVals.result4 = {votes:0, percent:0},
					newVals.result5 = {votes:0, percent:0},
					newVals.result6 = {votes:0, percent:0},
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
		'click .closeButton':function(event, template){
			$('form [name="questionText"]').val('');
			$('form [name="answer1"]').val('');
			$('form [name="answer2"]').val('');
			$('form [name="answer3"]').val('');
			$('form [name="answer4"]').val('');
			$('form [name="answer5"]').val('');
			$('form [name="answer6"]').val('');
			Session.set('editQuestion', undefined);
			Session.set('viewQuestion', undefined);
		}
	});
	
	Template.question.events({
 		'click .viewQuestion':function(event, template){
			var viewQuestion = Questions.findOne(event.target.name);
			if (viewQuestion){			
				Session.set('viewQuestion', viewQuestion);
			}
		},
		'click .editQuestion':function(event, template){
			var editQuestion = Questions.findOne(event.target.name);
			if (editQuestion){			
				Session.set('editQuestion', editQuestion);
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