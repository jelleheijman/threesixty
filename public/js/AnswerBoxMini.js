var AnswerBoxMini = function( ) {
    THREE.Object3D.apply(this);
	var that = this;
	var AnswerBoxMiniScale = 78;
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
				var thisAnswer = new AnswerMini( settings[6].scale, settings[6].barSize, i, valueGenerator );
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
    
    
    /*
	var loader = new THREE.OBJMTLLoader();
	loader.load( '/models/question_box.obj', '/models/question_box.mtl', function(obj){
		AnswerBoxMini = obj.children[0];
		AnswerBoxMini.rotation.x = Math.PI*2/4;
		AnswerBoxMini.scale.set(AnswerBoxMiniScale, AnswerBoxMiniScale, AnswerBoxMiniScale);
		that.add(AnswerBoxMini);
		init();
	});
    */
    init();
}
AnswerBoxMini.prototype = Object.create(THREE.Object3D.prototype);
AnswerBoxMini.prototype.constructor = AnswerBoxMini;




var AnswerMini = function( scale, barSize, iter, valueNumberGenerator ) {
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
	    if (that.percent < .001){
		    that.percent = .01;
	    }
	    valueNumber.position.x = 100;
	    valueNumber.setNum( that.percent );
	    //plane.setScale(scale);
    }
    
    this.updateAnswer = function ( answerData ) {
	    that.votes = answerData.votes;
	    TweenLite.to(that, 1, {percent:answerData.percent, onUpdate:function(){
		    valueNumber.setNum( that.percent );
	    }})
    }

    var plane = new DomPlane( 'INITIAL QUESTION TEXT', css );
    plane.eventEmitter.addEventListener('ready', planeReady);
    this.add(plane.mesh);
    
    
    var valueNumber = valueNumberGenerator.createValueNumberArray();
    valueNumber.position.z = 20;
    
    this.add(valueNumber);
    
    function planeReady(){
	    plane.mesh.position.x = -plane.width/2;
	    //plane.setScale(scale);
    }
    
    var barPad = .03;
    

    
}
AnswerMini.prototype = Object.create(THREE.Object3D.prototype);
AnswerMini.prototype.constructor = AnswerMini;