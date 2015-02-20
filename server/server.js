if (Meteor.isServer) {
	Meteor.startup( function(){
		SystemSettings = new Mongo.Collection("system_settings");
		Users = new Mongo.Collection("users");
		TickerItems = new Mongo.Collection("ticker_items");
		Connections = new Mongo.Collection("connections");
		Questions = new Mongo.Collection("questions");
		
		var numIpads = 100;
	
	    for (var i=1; i<=numIpads; i++){
	        var id = i.toString();
	        if (id.length == 1){
	            id = '00' + id;
	        } else if (id.length == 2){
	            id = '0' + id;
	        }
	        if (!Connections.findOne({deviceid:id})){
	            Connections.insert({deviceid:id, type:'ipad', answers:[], emoji:'neutral'});
	        }
	    }
		var baseSettings = [{name:'activeQuestion', def:''}, {name:'ipadUpper', def:'standby'}, 
							{name:'activeScene', def:'emoji'}, {name:'tickerStatus', def:'on'},
							{name:'questionMode', def:'question'}];
		for (i=0; i<baseSettings.length; i++){
	    	if (!SystemSettings.findOne({name:baseSettings[i].name})){
	        	SystemSettings.insert({name:baseSettings[i].name, value:baseSettings[i].def});
	        }    	
		}
		
		if (!SystemSettings.findOne({name:'emojis'})) {
	    	SystemSettings.insert({name:'emojis', 'value':['happy', 'eyeRoll', 'neutral']});
		}
	
	
		
	
		
		var answerCursor = Connections.find({type:'ipad'}, {fields:{answers:1}});
		var newAnswers = false;
		answerCursor.observe( {
			added:function(newIpad){
				
			},
			changed:function(newIpad, oldIpad){
				var newAnswers = newIpad.answers;
				var oldAnswers = oldIpad.answers;
				var question, newAnswer, oldAnswer;
				var brandNewAnswer = true;
				
				for (var i=0; i<newAnswers.length; i++){
					for (var j=0; j<oldAnswers.length; j++ ) {
						if ( oldAnswers[j].question == newAnswers[i].question && oldAnswers[j].answer != newAnswers[i].answer){
							brandNewAnswer = false;
							question = newAnswers[i].question;
							newAnswer = newAnswers[i].answer;
							oldAnswer = oldAnswers[j].answer;
							break;
						}
					}				
				}
				if ( brandNewAnswer ) {
					for (var i=0; i<newAnswers.length; i++){
						var answerInOld = false;
						for (var j=0; j<oldAnswers.length; j++ ) {
							if ( oldAnswers[j].question == newAnswers[i].question ) {
								answerInOld = true;
							}
						}
						if (!answerInOld){
							question = newAnswers[i].question;
							newAnswer = newAnswers[i].answer;
							break;
						}			
					}	
				}
				if (question){
					var incQuery = {$inc:{}};
					incQuery['$inc']['result' + newAnswer + '.votes'] = 1;
					if (oldAnswer) {
						incQuery['$inc']['result' + oldAnswer + '.votes'] = -1;
					}
					Questions.update(question, incQuery);
					
					// UPDATE PERCENTS
					var questionDb = Questions.findOne(question);
					var total = questionDb.result1.votes + questionDb.result2.votes + questionDb.result3.votes + 
								questionDb.result4.votes + questionDb.result5.votes + questionDb.result6.votes;
					var setQuery = {$set:{}};
					
					Questions.update(question, {$set:{'result1.percent':questionDb.result1.votes/total,
													  'result2.percent':questionDb.result2.votes/total,
													  'result3.percent':questionDb.result3.votes/total,
													  'result4.percent':questionDb.result4.votes/total,
													  'result5.percent':questionDb.result5.votes/total,
													  'result6.percent':questionDb.result6.votes/total
													 }
					});
				}

			}
		});

		
		Meteor.methods({
		  	heartbeat: function (deviceid) {
			  	if (deviceid === null){
				  	return;
			  	}
			    if (!Connections.findOne({deviceid:deviceid})) {
			    	Connections.insert({deviceid:deviceid});
			    }
			    Connections.update({deviceid:deviceid}, {$set: {last_seen: (new Date()).getTime(), status:'connected'}});
		  	},
		  	answerQuestion:function(deviceid, question, answer){
	            Connections.update( {_id:deviceid, "answers.question" : question}, {$set:{'answers.$.answer': answer}} );
		  		Connections.update( {_id:deviceid, "answers.question" : {$ne:question}} ,
									{$addToSet : {"answers": {'question':question, 'answer':answer  }} }
								  );			  
		  	}
		});
		
		Meteor.setInterval(function () {
		  var now = (new Date()).getTime();
		  Connections.find({last_seen: {$lt: (now - 60 * 1000)}}).forEach(function (user) {
				if (user.status == 'connected') {
		    		Connections.update({deviceid:user.deviceid}, {$set: {status:'disconnected'}});
		    	}
		  });
		}, 10000);	
		
		
	
	
	});
}
