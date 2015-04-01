if (Meteor.isClient) {
	
	var colorOptions = [ '#FF0000', '#009900', '#777777', '#D50000', '#0087DC', '#FDBB30', '#FFF95D', '#EFE600',  ];
	
	Template.controllerQuestions.helpers({
		questions: function(){
			var activeQuestion = SystemSettings.findOne({name:'activeQuestion'});
			var questions = Questions.find().fetch();
			if ( questions && activeQuestion){
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
		colorOptions:function(){
			return colorOptions;
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
			if (Session.get('viewQuestion')) {
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
		}
	});
	Template.controllerQuestions.events({
		'click #addQuestion':function(event, template){
			Session.set('editQuestion', 'new');
			
		},
		'submit form': function(event, template){
			if (event.target.questionText.value.length > 1){
				
				var newVals = {	questionText:event.target.questionText.value };
				


				for (var i=1; i<=6; i++) {
					newVals['answer' + i.toString()] = event.target['answer' + i.toString()]['value'];	
					newVals['answerColor' + i.toString()] = event.target['answerColor' + i.toString()]['value'];	
				}


				var editQuestion = Session.get('editQuestion');
				if ( editQuestion == 'new' ){
					for (i=1; i<=6; i++) {
						newVals['result' + i.toString()] = {votes:0, percent:0};
					}
				    Questions.insert( newVals );
				} else {
					Questions.update( editQuestion._id, {$set:newVals} );
				}
				
				event.target.questionText.value = '';
				for (i=1; i<=6; i++){
					event.target['answer' + i.toString()].value = '';
					event.target['answerColor' + i.toString()].value = '#FF0000';
				}
				
			}
			Session.set('editQuestion', undefined);
			event.preventDefault();
			return false;			
			
		},
		'click .closeButton':function(event, template){
			$('form [name="questionText"]').val('');
			
			for(i=1; i>=6; i++){
				$('form [name="answer1"]').val('');
				$('form [name="answerColor' + i.toString() + '"]').val('#FF0000');
			}
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