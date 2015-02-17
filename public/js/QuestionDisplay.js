var QuestionDisplay = function( ) {
    THREE.Object3D.apply(this);
	var that = this;
	var questionBox;
	var scale = 70;
	
	var positions = {
		2:[
			new THREE.Vector2(-150, 30), new THREE.Vector2(150, -30)	
		   ],

		6:[
				{position: new THREE.Vector2(-400, -10), align:'left'},
				{position: new THREE.Vector2(0, -10), align:'center'},
				{position: new THREE.Vector2(400, -10), align:'right'},
				{position: new THREE.Vector2(-400, -50), align:'left'},
				{position: new THREE.Vector2(0, -50), align:'center'},
				{position: new THREE.Vector2(400, -50), align:'center'}
			]
	}
	
    var questionCss = {'display':'inline-block',
	    	   'fontSize':'35px',
	    	   'fontFamily':'SwissBlack',
	    	   'color':'white',
	    	   'fontWeight':'bolder'
    };	
    
    var answerCss = {'display':'inline-block',
	    	   'fontSize':'25px',
	    	   'fontFamily':'Swiss',
	    	   'color':'white'
    };

    var questionData = {text:'INITIAL QUESTION'};
    
    var question = new DomPlane(questionData, questionCss, 0, 0, 'center');
    question.mesh.position.z = 20;
    question.mesh.position.y = 40;
    
    
    var answers = [null];
    var answerData = [ {text:'INITIAL ANSWER'}, {text:'INITIAL'}, {text:'INITIAL ANSWER LONGER'}, {text:'ANSWER'}, {text:'INITIAL ANSWER'}, {text:'ANSWER'}, {text:'INITIAL'} ];
    for (var i=0; i<6; i++) {
	    var thisAnswer = new DomPlane(answerData[i], answerCss, 0, 0, positions[6].align);
	    answers.push( thisAnswer );
	    thisAnswer.mesh.position.z = 20;
    }
    
    setTimeout( function(){
	    for (i=0; i<6; i++){
	    	answers[i].mesh.position.x = positions[6][i].position.x;
			answers[i].mesh.position.y = positions[6][i].position.y;
	    }
	}, 4000);


	this.setQuestion = function(questionData){
		question.html = questionData.questionText;
		question.render();
		
		var answerCount = 0;
		for (var i=1; i<=6; i++){
			if (question['answer' + i.toString()]){
				answerCount++;
			}
		}
		for ( i=1; i<=answerCount; i++ ){

		}
	}


	var loader = new THREE.OBJMTLLoader();
	loader.load( '/models/question_box.obj', '/models/question_box.mtl', function(obj){
		questionBox = obj.children[0];
		questionBox.rotation.x = Math.PI*2/4;
		questionBox.scale.set(scale, scale, scale);
		that.add(questionBox);
		that.add(question.mesh);
		for (var i=1; i<answers.length; i++){
			that.add(answers[i].mesh);
		}
		TweenLite.to(that.rotation, 2, {x:Math.PI*2, delay:2});
	});

}
QuestionDisplay.prototype = Object.create(THREE.Object3D.prototype);
QuestionDisplay.prototype.constructor = QuestionDisplay;

