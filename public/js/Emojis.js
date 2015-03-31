var EmojiTimesTwo = function(width, height, numEmoji, numRows){
    THREE.Object3D.apply(this);
    var that = this;
    var left, right;
	var status = 'full';
 
	var answerBox = new AnswerBox();
	answerBox.addEventListener('ready', function(){
		var emojiAnswers = [
			{answer:'HAPPY', result:{percent:0.33, votes:50}},	
			{answer:'NEUTRAL', result:{percent:0.33, votes:50}},	
			{answer:'SAD', result:{percent:0.33, votes:50}}	
		];
		setTimeout( function(){
			answerBox.setAnswers(emojiAnswers);	
		}, 1000);
		
	});

	this.add(answerBox);
	
	answerBox.hide();
 
 
    this.setEmoji = function(id, mood){
        left.setEmoji(id, mood);
        right.setEmoji(id, mood);
    };
    
    this.setMode = function( setting ) {
	    if (status == setting) {
		    return;
	    }
	    if (setting == 'full') {
		    left.goFull(0.2);
		    right.goFull(0.2);
		    answerBox.hide(0.6, 0);
	    } else if (setting == 'results'){
		    var result = left.calcResults
		    left.goResults();
		    right.goResults();
		    answerBox.updateAnswers( left.calcResults() );
		    answerBox.reveal(0.6, 1);
			
	    } 
	    status = setting;
    };
    
    this.hide = function(){
	    left.hide();
	    right.hide();
	    setTimeout(function(){
		    that.visible = false;
	    }, 2000);
	    
    };
    this.reveal = function(delay){
	    left.reveal(delay);
	    right.reveal(delay);
	    that.visible = true;
    };
    
    
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
    
    var emojiGeom, emojiBackerGeom;
    
    emojiGeom = new THREE.PlaneBufferGeometry(1.5,1.5);
    emojiBackerGeom = new THREE.BoxGeometry(1.5, 1.5, 0.5);
    createEmoji();

	this.tick = function(){
		answerBox.tick();
	};

    
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
    var emojiSizeFullHeight = 53;
    var emojiSizeSquishedHeight = 53;
    
    var numCols = numEmoji / numRows;
    
    var verticalOffset = -2;
    var yTrackFull = numRows/2 * emojiDiameter + verticalOffset;
    var yTrackSquished = numRows/2 * emojiDiameter + verticalOffset;
    var xTrackSquished, xTrackFull;
    if (leftRight){
	    xTrackSquished = 50;
	    xTrackFull = 0;
    } else {
	    xTrackSquished = width - emojiSizeFullWidth - 50;
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

        yTrackFull = numRows/2 * emojiDiameter + verticalOffset;
        yTrackSquished = numRows/2 * emojiDiameter + verticalOffset;
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
    this.calcResults = function(){
		var moodResults = getMoodsAndResults();
		var moods = moodResults.mood;
		var results = moodResults.results;
	    for (var k=0; k<results.length; k++){
		    if ( results[k].answer.toLowerCase() == emojis[j].mood ){
			    results[k].result.vote ++;
		    }
	    }
	    for ( k=0; k<results.length; k++ ){
		    results[k].result.percent = results[k].result.votes/100;
	    }
	    return results;
    }
    this.goResults = function(dur){
	    dur = dur || 1.5;
		var moodResults = getMoodsAndResults();
		var moods = moodResults.moods;
	    
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
	function getMoodsAndResults(){
	    var emojiSetting = SystemSettings.findOne({name:'ipadEmoji'}).value;
	    var moods;
	    var results;
	    if (emojiSetting == 'emoji'){
		    moods = ['happy', 'neutral', 'sad'];
		    results = [ {answer:'HAPPY', result:{percent:0, votes:0}},
		    			{answer:'NEUTRAL', result:{percent:0, votes:0}},
		    			{answer:'SAD', result:{percent:0, votes:0}} ];
	    } else if (emojiSetting == 'thumbs') {
		    moods = ['thumbsUp', 'neutral', 'thumbsDown'];
		    results = [ {answer:'THUMBS UP', result:{percent:0, votes:0}},
		    			{answer:'NEUTRAL', result:{percent:0, votes:0}},
		    			{answer:'THUMBS DOWN', result:{percent:0, votes:0}}  ];
	    }
	    return {moods:moods, results:results};
	}

}
Emojis.prototype = Object.create(THREE.Object3D.prototype);
Emojis.prototype.constructor = Emojis;
