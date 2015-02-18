var AnswerBox = function() {
    THREE.Object3D.apply(this);
	var that = this;
	var answerBoxScale = 78;
    
    this.hide = function(dur, delay){
		TweenLite.to( that.rotation, dur, {x:0, delay:delay, onStart:function(){
						that.visible = true;
					}});
    }
    this.reveal = function(dur, delay){
		TweenLite.to( that.rotation, dur/2, {x:-Math.PI*2/4, onComplete:function(){
			that.visible = false;
		}} );
    }
    
	var loader = new THREE.OBJMTLLoader();
	loader.load( '/models/question_box.obj', '/models/question_box.mtl', function(obj){
		answerBox = obj.children[0];
		answerBox.rotation.x = Math.PI*2/4;
		answerBox.scale.set(answerBoxScale, answerBoxScale, answerBoxScale);
		that.add(answerBox);
		//for (var i=1; i<answers.length; i++){
		//	that.add(answers[i].mesh);
		//}
	});
    
}
AnswerBox.prototype = Object.create(THREE.Object3D.prototype);
AnswerBox.prototype.constructor = AnswerBox;


var AnswerQuestion = function() {
    THREE.Object3D.apply(this);
	var that = this;

    
}
AnswerQuestion.prototype = Object.create(THREE.Object3D.prototype);
AnswerQuestion.prototype.constructor = AnswerQuestion;

