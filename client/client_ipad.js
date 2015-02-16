
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
		answerVisible:function(name){
			var activeQuestionSetting = SystemSettings.findOne({'name':'activeQuestion'});
			if ( activeQuestionSetting ){
				var activeQuestion = Questions.findOne(activeQuestionSetting.value);
				if ( activeQuestion ) {
					return activeQuestion[name] ? 'visible' : 'hidden';		
				} 
			}		    
		}
	});
	Template.ipad.events({
		'click #emoji button': function(event, template){
		    if (!Session.get('mongoid')){
		        console.log('nomongo');
		        var device = Connections.findOne({deviceid:Session.get('deviceid')});
                Session.set('mongoid', device['_id']);
		    }
		    if (Session.get('mongoid')) {
		        console.log(Session.get('mongoid')._id);
    		    Connections.update(Session.get('mongoid')._id, {$set:{emoji:event.target.name}});
		    }			
			console.log(Session.get('mongoid'), event.target.name);
		},
		'submit form': function(event, template){
			TickerItems.insert( { created:new Date(), user:Session.get('deviceid'), approved:true, cyclesRemaining:1, text:event.target.message.value } );
			$('#messageInput').val('');
			event.preventDefault();
			return false;
		}
	});
}
