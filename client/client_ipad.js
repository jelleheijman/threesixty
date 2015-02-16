
if (Meteor.isClient) {
    Session.set('ipadLower', 'emoji');

	Template.ipad.helpers({
		activeQuestion:function(key){
			var activeQuestionSetting = SystemSettings.findOne({'name':'activeQuestion'});
			if ( activeQuestionSetting ){
				var activeQuestion = Questions.findOne(activeQuestionSetting.value);
				if ( activeQuestion ) {
					return activeQuestion[key];			
				}		
			}

		},
		answerVisible:function(name){
			var activeQuestionSetting = SystemSettings.findOne({'name':'activeQuestion'});
			if ( activeQuestionSetting ){
				var activeQuestion = Questions.findOne(activeQuestionSetting.value);
				if ( activeQuestion ) {
					return activeQuestion[name] ? 'visible' : 'hidden';		
				} 
			}		    
		},
		answerActive:function(answer){
			var activeQuestionSetting = SystemSettings.findOne({'name':'activeQuestion'});
			if (activeQuestionSetting) {
				activeQuestion = activeQuestionSetting.value;
				if (Connections.findOne(Session.get('mongo_id'))){
					var answers = Connections.findOne(Session.get('mongo_id')).answers;
					for (var i=0; i<answers.length; i++){
						if (answers[i].question == activeQuestion && answers[i].answer == answer ) {
							return 'selected';
						}
					}
					return 'unselected'
				}
			}
		},
		ipadTopVisible:function(name){
			var activeTop = SystemSettings.findOne({'name':'ipadUpper'});
			if (activeTop) {
				return name === activeTop.value ? 'visibleFade' : 'hiddenFade';
			} else {
				return '';
			}
		},
		ipadLowerVisible:function(name){
		    return name === Session.get('ipadLower') ? 'visibleFade' : 'hiddenFade';
		},
		emojis:function(){
			if (SystemSettings.findOne({name:'emojis'})){
				return SystemSettings.findOne({name:'emojis'}).value;
			}
		}
	});
	Template.ipad.events({
		'click .answer':function (event, template){
			var activeQuestionSettings = SystemSettings.findOne({'name':'activeQuestion'});
			if (activeQuestionSettings.value){
				var activeQuestion = activeQuestionSettings.value;
				Meteor.call( 'answerQuestion', Session.get('mongo_id'), activeQuestion, $(event.target).attr('name') );
			}
		},
		'click  .emojiButton': function(event, template){
		    if (Session.get('mongo_id')) {
    		    Connections.update(Session.get('mongo_id'), {$set:{emoji:event.target.name}});
		    }			
		},
		'submit form': function(event, template){
			TickerItems.insert( { created:new Date(), user:Session.get('deviceid'), approved:true, cyclesRemaining:1, text:event.target.message.value } );
			$('#messageInput').val('');
			event.preventDefault();
			return false;
		}
	});
	
	Template.emojiButton.helpers({
		emojiActive:function( emojiName ){
			if (Connections.findOne(Session.get('mongo_id'))){
				return Connections.findOne(Session.get('mongo_id')).emoji == emojiName ? 'active' : 'inactive';
			}
		}
	});
	
}
