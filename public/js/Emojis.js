var EmojiTimesTwo = function(width, height, numEmoji, numRows){
    THREE.Object3D.apply(this);
    var that = this;
    var left, right;
	var status = 'full';
 
	var answerBox = new AnswerBox();
	this.add(answerBox);
	answerBox.hide();
 
 
    this.setEmoji = function(id, mood){
        left.setEmoji(id, mood);
        right.setEmoji(id, mood);
    }
    
    this.setMode = function( setting ) {
	    if (status == setting) {
		    return;
	    }
	    if (setting == 'full') {
		    left.goFull(.2);
		    right.goFull(.2);
		    answerBox.hide(.6, 0);
	    } else if (setting == 'results'){
		    left.goResults();
		    right.goResults();
		    //answerBox.reveal(.6, 1);
	    } 
	    status = setting;
    }
    
    this.hide = function(){
	    left.hide();
	    right.hide();
	    setTimeout(function(){
		    that.visible = false;
	    }, 2000);
	    
    }
    this.reveal = function(delay){
	    left.reveal(delay);
	    right.reveal(delay);
	    that.visible = true;
    }
    
    
    var backerMats = {
                        conservative:new THREE.MeshPhongMaterial({diffuse:0x8888FF}),
                        labour:new THREE.MeshPhongMaterial({diffuse:0xFF8888}),
                        none:new THREE.MeshPhongMaterial({diffuse:0xFFFFFF})
                     };
    var emojiMats = {
                        happy:new THREE.MeshLambertMaterial({map:THREE.ImageUtils.loadTexture('/img/emoji/happy.png')}),
                        neutral:new THREE.MeshLambertMaterial({map:THREE.ImageUtils.loadTexture('/img/emoji/neutral.png')}),
                        sad:new THREE.MeshLambertMaterial({map:THREE.ImageUtils.loadTexture('/img/emoji/sad.png')}),
                        thumbsUp:new THREE.MeshLambertMaterial({map:THREE.ImageUtils.loadTexture('/img/emoji/thumbsUp.png')}),
                        thumbsDown:new THREE.MeshLambertMaterial({map:THREE.ImageUtils.loadTexture('/img/emoji/thumbsDown.png')}),
                    };
    emojiMats.neutral.map
    
    var emojiGeom, emojiBackerGeom;
    
    emojiGeom = new THREE.PlaneBufferGeometry(1.5,1.5);
    emojiBackerGeom = new THREE.BoxGeometry(1.5, 1.5, .5);
    createEmoji();

    
    function createEmoji(){
        left =  new Emojis(width, height, numEmoji, numRows, emojiBackerGeom, emojiGeom, backerMats, emojiMats, true);
        left.position.x = -3000 + 50;
        left.position.y = 5;
        that.add(left);
            
        right= new Emojis(width, height, numEmoji, numRows, emojiBackerGeom, emojiGeom, backerMats, emojiMats, false);
        right.position.x = 0 + 50;
        right.position.y = left.position.y;
        that.add(right);
        
        that.hide();
    }
    
    
    
    
}
EmojiTimesTwo.prototype = Object.create(THREE.Object3D.prototype);
EmojiTimesTwo.prototype.constructor = EmojiTimesTwo;




var Emojis = function( width, height, numEmoji, numRows, emojiBackerGeom, emojiGeom, backerMats, emojiMats, leftRight ) {

    THREE.Object3D.apply(this);
    var that=this;
    var emojis = []; 
	var squishPositions = [];
	var resultsUpdateTimeout;
	
	var emojiDiameter = 43;
    var emojiSizeFullWidth = 87.85;
    var emojiSizeSquishedWidth = 56;
    var emojiSizeFullHeight = 48;
    var emojiSizeSquishedHeight = 48;
    
    var numCols = numEmoji / numRows;
    
    var yTrackFull = numRows/2 * emojiDiameter;
    var yTrackSquished = numRows/2 * emojiDiameter;
    var xTrackSquished, xTrackFull;
    if (leftRight){
	    xTrackSquished = 0;
	    xTrackFull = 0;
    } else {
	    xTrackSquished = width - emojiSizeFullWidth;
	    xTrackFull = width - emojiSizeFullWidth;
    }

    
    var count = 1;
    
    for (var i=0; i<numCols; i++){
        for (var j=0; j<numRows; j++){
            var emoji = new Emoji(count, emojiBackerGeom, backerMats.none, emojiGeom, emojiMats.neutral, new THREE.Vector2(xTrackFull, yTrackFull) );
            
            that.add(emoji);

			squishPositions.push( new THREE.Vector2(xTrackSquished, yTrackSquished) );
			emojis.push(emoji);

			yTrackFull -= emojiSizeFullHeight;
        	yTrackSquished -= emojiSizeFullHeight;
            count++;
        }
        if (leftRight) {
        	xTrackFull += emojiSizeFullWidth;
        	xTrackSquished += emojiSizeSquishedWidth;
        } else {
	        xTrackFull -= emojiSizeFullWidth;
        	xTrackSquished -= emojiSizeSquishedWidth;
        }

        yTrackFull = numRows/2 * emojiDiameter;
        yTrackSquished = numRows/2 * emojiDiameter;
    }
    
    //FILL ZERO INDEX SO WE CAN JUST USE THEIR ID NUMBER AS THE INDEX
    emojis.unshift(undefined);

    this.setEmoji = function(id, mood){
	    if(emojis[id]){
        	emojis[id].setEmoji(mood, emojiMats[mood]);
        }
    }
    
    this.hide = function(){
	    for (var i=1; i<emojis.length; i++){
		    emojis[i].hide(i*.005);
	    }
    }
    this.reveal = function(delay){
	    
	    for (var i=1; i<emojis.length; i++){
		    emojis[i].reveal(i*.005 + delay);
	    }
    }
    
    this.goFull = function(delay){
	    if (resultsUpdateTimeout){
		    clearTimeout(resultsUpdateTimeout);
	    }
		for (var i=1; i<emojis.length; i++){
		    emojis[i].goHome(1, delay);
	    }

    }
    this.goResults = function(dur){
	    dur = dur || 1.5;
	    var emojiSetting = SystemSettings.findOne({name:'ipadEmoji'}).value;
	    var moods;
	    if (emojiSetting == 'emoji'){
		    moods = ['happy', 'neutral', 'sad'];
	    } else if (emojiSetting == 'thumbs') {
		    moods = ['thumbsUp', 'neutral', 'thumbsDown'];
	    }
	    
	    var positionCount = 0;
	    for (var i=0; i < moods.length; i++){
		    for (var j=1; j<emojis.length; j++){
			    if ( emojis[j].mood == moods[i] && (emojis[j].x != squishPositions[positionCount].x || emojis[j].y != squishPositions[positionCount].y) ) {
				    TweenLite.to(emojis[j].position, dur, {x:squishPositions[positionCount].x, y:squishPositions[positionCount].y});
				    positionCount++;
			    }
		    }
	    }
	    resultsUpdateTimeout = setTimeout( function(){
		    that.goResults(.5);
		}, 5000 );
    }


}
Emojis.prototype = Object.create(THREE.Object3D.prototype);
Emojis.prototype.constructor = Emojis;
