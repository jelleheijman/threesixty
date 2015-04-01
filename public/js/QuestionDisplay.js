var QuestionDisplay = function( flare ) {
    THREE.Object3D.apply(this);
	var that = this;

	this.mode;

	
	var questionFontSize = 50;			/// THAT'S THE BIG QUESTION IN THE MIDDLE
	var sideQuestionScale = .6;			/// FOR THE SIDE QUESTIONS, WE'LL SHRINK THEM DOWN BY THEIS MUCH
	var questionLeftPos = -2400;		/// SIDE QUESTION X POSITIONS, FAR ENOUGH INSIDE TO LEAVE ROOM FOR THE MINI RESULTS BOXES AT THE VERY EDGES
	var questionRightPos = 2400;
	var questionLeftOff = -4000;		/// OFFSCREEN POSITION FOR THE SIDE QUESTIONS AND ANSWERS
	var questionRightOff = 4000;
	var answerLeftPos = -2700;			/// POSITIONS FOR THE MINI ANSWER BOXES AT THE SIDES
	var answerRightPos = 2900;
	var questionWidth, questionHeight;	/// WE'LL NEED THIS LATER TO POSITION THE 3D QUESTION TEXT
	var questionData;					/// WE'LL HANG ONTO THE QUESTION DATA THAT'S PASSED IN SINCE WE DONT' WANT TO ACTUALLY UPDATE EVERY SINGLE TIME
	var questionNeedsUpdate = false;	/// WE'LL SET THIS TO TRUE WHEN WE GET NEW DATA, THEN CHECK IT EVERY SO OFTEN.  WOULDN'T WANT TO BE TWEENING STUFF ON FREQUENT UPDATES
	
	// CREATE CENTER QUESTION MESH
	var questionMat = new THREE.MeshLambertMaterial({color:0xFFFFFF});
	var questionMesh = new THREE.Mesh(new THREE.Geometry(), questionMat);
	var question = new THREE.Object3D();
	question.visible = false;
	question.add(questionMesh);
	this.add(question);

	// CREATE SIDE QUESTION MESHES
	var questionMeshLeft = new THREE.Mesh(questionMesh.geometry.clone(), questionMat);
	var questionMeshRight = new THREE.Mesh(questionMesh.geometry.clone(), questionMat);
	questionMeshLeft.scale.set(sideQuestionScale, sideQuestionScale, sideQuestionScale);
	questionMeshRight.scale.set(sideQuestionScale, sideQuestionScale, sideQuestionScale);
	var questionLeft = new THREE.Object3D();
	var questionRight = new THREE.Object3D();
	questionLeft.add(questionMeshLeft);
	questionRight.add(questionMeshRight);
	questionLeft.position.x = questionLeftOff;
	questionRight.position.x= questionRightOff;
	this.add(questionLeft);
	this.add(questionRight);
	
	/// CREATE THE MAIN ANSWER BOX
	var answerBox = new AnswerBox();
	answerBox.addEventListener('ready', function(e){
		setTimeout( function(){
			that.dispatchEvent(e);
		}, 100)		
	});
	this.add(answerBox);	

	/// CREATE THE SIDE ANSWER BOXES
	var answerBoxLeft = new AnswerBoxMini();
	answerBoxLeft.position.x = questionLeftOff;
	this.add(answerBoxLeft);
	
	var answerBoxRight = new AnswerBoxMini();
	answerBoxRight.position.x = questionRightOff;
	this.add(answerBoxRight);
	
	
	// SET UP FLARES
	var flare1 = new THREE.Mesh(flare.geometry, flare.material);
	var flare2 = new THREE.Mesh(flare.geometry, flare.material);
	flare1.position.x = -3500;
	flare2.position.x = 3500;
	flare1.position.z = 50;
	flare2.position.z = 50;
	flare1.scale.y = 100;
	flare1.scale.x = 200;
	flare2.scale.y = 100;
	flare2.scale.x = 200;
	this.add(flare1, flare2);

	/// THIS GETS CALLED BY THE ROOT WALL PAGE WHEN IT SEES THE ACTIVE QUESTION HAS BEEN CHANGED
	this.setQuestion = function(_questionData){
		questionData = _questionData;
		/// WE'LL TRY TO COMPLETELY WIPE OUT THE PREVIOUS QUESTION GEOMETRY SO WE DON'T LEAK MEMORY
		questionMesh.geometry.dispose();
		/// SET THE GEOMETRY TO THE NEW QUESTION
		questionMesh.geometry = getText(questionData.questionText.toUpperCase());
		questionMesh.geometry.needsUpdate = true;
		/// SET THE WIDTH BASED ON THE NEW BOUNDING BOX
		questionMesh.geometry.computeBoundingBox();		
		questionWidth = questionMesh.geometry.boundingBox.max.x - questionMesh.geometry.boundingBox.min.x;
		questionHeight = questionMesh.geometry.boundingBox.max.y - questionMesh.geometry.boundingBox.min.y;
		/// CENTER THE QUESTION
		questionMesh.position.x = -questionWidth/2;
		questionMesh.position.y = -questionHeight/2;
		
		/// AND CREATE THE SIDE QUESTIONS ALSO.  THESE WILL COME ON WHEN THE BIG QUESTION GOES AWAY TO REVEAL THE ANSWERS
		questionMeshLeft.geometry.dispose();
		questionMeshLeft.geometry = questionMesh.geometry.clone();
		questionMeshLeft.geometry.needsUpdate = true;
		questionMeshRight.geometry.dispose();
		questionMeshRight.geometry = questionMesh.geometry.clone();
		questionMeshRight.geometry.needsUpdate = true;
		/// AND POSITION THEM, THE RIGHT ONE RIGHT JUSTIFIED
		questionMeshRight.position.x = - questionWidth * sideQuestionScale;
		questionMeshLeft.position.x = 0;
		
		/// RUN THRU ALL THE POSSIBLE ANSWERS FOR THIS QUESTION AND CREATE AN ARRAY OF THEIR DATA
		var answers = [];
		for (var i=1; i<=6; i++){
			if (questionData['answer' + i.toString()]){
				answers.push( {answer:questionData['answer' + i.toString()], result:questionData['result' + i.toString()]} );
			}
		}
		/// AND ASSUMING WE HAVE ANSWERS, LET'S SET THEM TO THE CURRENT ANSWERS
		if (answers.length > 1) {
			answerBox.setAnswers(answers);
			answerBoxLeft.setAnswers(answers);
			answerBoxRight.setAnswers(answers);
		}
	}
	
	this.updateQuestion = function(_questionData){
		questionData = _questionData;
		questionNeedsUpdate = true;
	}
	setInterval( function(){
		if (questionNeedsUpdate) {
			if (that.visible && answerBox.visible) {
				var activeQuestion = SystemSettings.findOne({name:'activeQuestion'}).value;
				if ( questionData._id == activeQuestion ) {
					answerBox.updateAnswers(questionData);
					answerBoxLeft.updateAnswers(questionData);
					answerBoxRight.updateAnswers(questionData);
				}
				questionNeedsUpdate = false;
			}
			
		}
	}, 2000);
	
	this.setMode = function(mode){
		var dur = 0;
		if ( that.visible ){
			dur = .5;
		}
		if (mode == 'answer'){
			TweenLite.to( question.rotation, dur/2, {x:Math.PI*2/4, onComplete:function(){
				question.visible = false;
			}} );
			answerBox.reveal(dur/2, dur/2);
			TweenLite.to( flare2.scale, dur/2, {x:1, y:1, onComplete:function(){
    			flare2.visible = false;
			}});
			TweenLite.to( questionLeft.position, dur/2, {x:questionLeftPos});
			TweenLite.to( questionRight.position, dur/2, {x:questionRightPos});
			TweenLite.to( answerBoxLeft.position, dur/2, {x:answerLeftPos});
			TweenLite.to( answerBoxRight.position, dur/2, {x:answerRightPos});
		} else if (mode == 'question'){
			answerBox.hide( dur/2, 0 );
			TweenLite.to( question.rotation, dur/2, {x:0, delay:dur/4, onStart:function(){
				question.visible = true;
			}});
			flare2.visible = true;
			TweenLite.to( flare2.scale, dur/2, {x:questionWidth, y:50});
			TweenLite.to( questionLeft.position, dur/2, {x:questionLeftOff});
			TweenLite.to( questionRight.position, dur/2, {x:questionRightOff});		
			TweenLite.to( answerBoxLeft.position, dur/2, {x:questionLeftOff});
			TweenLite.to( answerBoxRight.position, dur/2, {x:questionRightOff});	
		}
	}
	
	this.setQuestion({questionText:'INITIAL QUESTION'});

	this.reveal = function(delay){
			
		setTimeout( function(){
			flare1.scale.y = 100;
			flare1.scale.x = 200;
			flare2.scale.y = 100;
			flare2.scale.x = 200;
			flare1.position.x = -3500;
			flare2.position.x = 3500;
			flare1.visible = true;
			flare2.visible = true;
			question.visible = false;
			that.visible = true;
			TweenLite.to(flare1.position, .5, {x:0, ease:Linear.easeInOut});
			TweenLite.to(flare2.position, .5, {x:0, ease:Linear.easeInOut});
			setTimeout( function(){
						question.visible = true;
						TweenLite.from(question.rotation, .5, {x:Math.PI*2 * .75});
						TweenLite.to(flare1.position, .2, {x:-500, y:30, ease:Linear.easeInOut});
						TweenLite.to(flare1.scale, .2, {x:1, y:1, ease:Linear.easeInOut, onComplete:function(){
    						flare1.visible = false;
						}});
						
						//TweenLite.to(flare1.scale, .2, {x:2, y:2});
						TweenLite.to(flare2.scale, .2, {x:questionWidth*2, y:questionHeight, onComplete:function(){
							TweenLite.to(flare2.position, .5, {y:-32, ease:Linear.easeInOut});
							TweenLite.to(flare2.scale, .5, {x:questionWidth, y:50});
						}});
				}, 500);			
		}, delay*1000);
	};
	
	this.hide = function(){
		TweenLite.to(flare1.scale, .2, {x:1, y:1, onComplete:function(){
			question.visible = false;
		}});
		TweenLite.to(flare2.scale, .2, {x:1, y:1});
		TweenLite.to(flare1.position, .5, {x:-3500, y:0});
		TweenLite.to(flare2.position, .5, {x:3500, y:0, onComplete:function(){
			that.visible = false;
			that.setMode('question');
			var questionModeSetting = SystemSettings.findOne({name:'questionMode'});
			SystemSettings.update(questionModeSetting._id, {$set:{value:'question'}});
		}});
	};
	
	this.tick = function(){
		answerBox.tick();
	}
	
	this.hide();
	
	function getText(text){
		return new THREE.TextGeometry( text, {
									size: questionFontSize,
									height: 3,
									curveSegments: 3,
				
									font: 'swis721 bt',
									weight: 'bold',
									//style: 'bold',
				
									bevelThickness: 2,
									bevelSize: 1.3,
									bevelEnabled: true,	
								});
	}



}
QuestionDisplay.prototype = Object.create(THREE.Object3D.prototype);
QuestionDisplay.prototype.constructor = QuestionDisplay;

