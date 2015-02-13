
if (Meteor.isClient) {

	Template.ipad.rendered = function(){
		setTimeout( function(){
			if (Connections.findOne({'deviceid':Session.get('deviceid')}) === undefined){
				Connections.insert({'deviceid':Session.get('deviceid'), type:'ipad'});
				console.log('iPad ID doesn\'t exist. Creating new for ' + Session.get('deviceid'));
			} else {
				console.log('iPad ID already exists');
			}
			Session.set('mongoid', Connections.findOne({'deviceid':Session.get('deviceid')})._id );
		}, 2000);
	};
	
	Template.ipad.helpers({
		activeQuestion:function(key){
				var activeQuestionSetting = SystemSettings.findOne({'name':'activeQuestion'});
				if ( activeQuestionSetting ){
					var activeQuestion = Questions.findOne({'_id':activeQuestionSetting.value});
					if ( activeQuestion ) {
						return activeQuestion[key];			
					}		
				}

		},
		topHidden:function(name){
			var activeTop = SystemSettings.findOne({'name':'ipadUpper'});
			if (activeTop) {
				return name != activeTop.value ? 'hidden' : '';
			} else {
				return '';
			}
		}
	});
	Template.ipad.events({
		'click #emoji button': function(event, template){
			Connections.update(Session.get('mongoid'), {$set:{emoji:event.target.name}});
		},
		'submit form': function(event, template){
			TickerItems.insert( { created:new Date(), user:Session.get('deviceid'), approved:true, cyclesRemaining:1, text:event.target.message.value } );
			$('#messageInput').val('');
			event.preventDefault();
			return false;
		}
	});
}
