var AnswerBox = function( ) {
    THREE.Object3D.apply(this);
	var that = this;
	var answerBoxScale = 78;
	var answers = [];

	var settings = {
						2:{startY:29, ySpacing:55, scale:1.2, barSize:45/56},
						3:{startY:47, ySpacing:46, scale:1.2, barSize:38/56},
						4:{startY:52, ySpacing:33, scale:1.2, barSize:26/56},
						5:{startY:56, ySpacing:28, scale:1.1, barSize:23/56},
						6:{startY:62, ySpacing:25, scale:1, barSize:20/56}	
	};
	
	function init(){		
		var yTrack = settings[6].startY;
		var valueGenerator = new ValueNumberGenerator();
		setTimeout(function() {
			for (var i=0; i<6; i++){
				var thisAnswer = new Answer( settings[6].scale, settings[6].barSize, i, valueGenerator );
				thisAnswer.position.set(0, yTrack, 30);	
				yTrack -= settings[6].ySpacing;
				that.add( thisAnswer );
				answers.push( thisAnswer );
			}
			that.dispatchEvent(new Event('ready'));
		}, 3000);
	}
	
	this.setAnswers = function( newAnswers ){
		var setting = settings[newAnswers.length];
		var yTrack = setting.startY;
		for (var i=0; i<answers.length; i++){
			if (newAnswers[i]){
				answers[i].visible = true;
				answers[i].setAnswer( newAnswers[i], setting.scale, setting.barSize );
				answers[i].position.y = yTrack;
				yTrack -= setting.ySpacing;
			} else {
				answers[i].visible = false;
			}
		}
	}
	this.updateAnswers = function( newAnswer ){
		for (var i=0; i<answers.length; i++){
			answers[i].updateAnswer( newAnswer['result' + (i+1).toString()] );
		}
	}
    
    this.reveal = function(dur, delay){
		TweenLite.to( that.rotation, dur, {x:0, delay:delay, onStart:function(){
						that.visible = true;
					}});
    }
    this.hide = function(dur, delay){
		TweenLite.to( that.rotation, dur/2, {x:-Math.PI*2/4, delay:delay, onComplete:function(){
			that.visible = false;
		}} );
    }
    
    this.tick = function(){
	    if (answers[0]){
		    answers[0].tick();
		    answers[1].tick();
		    answers[2].tick();
		    answers[3].tick();
		    answers[4].tick();
		    answers[5].tick();		    
		}
    }
    
    /*
	var loader = new THREE.OBJMTLLoader();
	loader.load( '/models/question_box.obj', '/models/question_box.mtl', function(obj){
		answerBox = obj.children[0];
		answerBox.rotation.x = Math.PI*2/4;
		answerBox.scale.set(answerBoxScale, answerBoxScale, answerBoxScale);
		that.add(answerBox);
		init();
	});
    */
    init();
}
AnswerBox.prototype = Object.create(THREE.Object3D.prototype);
AnswerBox.prototype.constructor = AnswerBox;




var Answer = function( scale, barSize, iter, valueNumberGenerator ) {
	THREE.Object3D.apply(this);
	var that = this;
	var css = {'display':'inline-block',
	    	   'fontSize':'23px',
	    	   'fontFamily':'Swiss',
	    	   'color':'white'
    };
    
    this.percent;
    this.votes;
    
    this.setAnswer = function( answerData, scale, barSize ){
	    answerText = answerData.answer;
	    that.percent = answerData.result.percent;
	    that.votes = answerData.result.votes;
	    plane.html = answerText.toUpperCase();
	    plane.render();
	    bar.scale.y = bar.scale.z = barSize;
	    if (that.percent < .001){
		    that.percent = .01;
	    }
	    bar.scale.x = that.percent;
	    valueNumber.position.x = -600 + meshWidth * (that.percent+.03) + 84;
	    valueNumber.setNum( that.percent - barPad > .001 ? that.percent : 0 );
	    //plane.setScale(scale);
    }
    
    this.updateAnswer = function ( answerData ) {
	    that.percent = answerData.percent;
	    that.votes = answerData.votes;
	    TweenLite.to(bar.scale, 1, {x:that.percent + barPad});
	    TweenLite.to(valueNumber.position, 1, {x:-600 + meshWidth * (that.percent+.03) + 84, onUpdate:function(){
		    valueNumber.setNum( bar.scale.x - barPad > .001 ? bar.scale.x - barPad : 0 );
	    }, onComplete: function(){
		    valueNumber.setNum( that.percent );
	    }});
    }
    
    
    this.setColor = function( answerColor ){
	    
    }
    
    this.tick = function(){
	    bar.rotation.x += .005;
	    if (bar.rotation.x > Math.PI*2){
		    bar.rotation.x = 0;
	    }
    }
    
    
    var plane = new DomPlane( 'INITIAL QUESTION TEXT', css );
    plane.eventEmitter.addEventListener('ready', planeReady);
    this.add(plane.mesh);
    
    var meshWidth = 1350;
    var barMesh = new THREE.Mesh( new THREE.BoxGeometry(meshWidth, 45, 45), new THREE.MeshPhongMaterial({color:0xFF0000, shininess:150}) );
    barMesh.position.x = meshWidth/2;
    barMesh.rotation.x = .02 * iter;
    var bar = new THREE.Object3D();
    bar.scale.set(1, barSize, barSize);
    bar.position.x = -600;
    bar.add(barMesh);
    this.add(bar);
    
    var valueNumber = valueNumberGenerator.createValueNumberArray();
    valueNumber.position.z = 20;
    
    this.add(valueNumber);
    
    function planeReady(){
	    plane.mesh.position.x = -610 - plane.width/2;
	    //plane.setScale(scale);
    }
    
    var barPad = .03;
    

    
}
Answer.prototype = Object.create(THREE.Object3D.prototype);
Answer.prototype.constructor = Answer;