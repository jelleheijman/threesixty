var EmojiTimesTwo = function(width, height, numEmoji, numRows){
    THREE.Object3D.apply(this);
    var that = this;
    var left, right;
 
 
    this.setEmoji = function(id, mood){
        left.setEmoji(id, mood);
        right.setEmoji(id, mood);
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
                        sad:new THREE.MeshLambertMaterial({map:THREE.ImageUtils.loadTexture('/img/emoji/sad.png')}),
                        neutral:new THREE.MeshLambertMaterial({map:THREE.ImageUtils.loadTexture('/img/emoji/neutral.png')})
                    };
    emojiMats.neutral.map
    
    var emojiGeom, emojiBackerGeom;
    
    emojiGeom = new THREE.CircleGeometry(1.5,20);
    var geomLoader = new THREE.OBJLoader();
    geomLoader.load('/models/emojiBacker.obj', function(obj){
        emojiBackerGeom = obj.children[0].geometry;
        createEmoji();    
    });
    
    function createEmoji(){
        left =  new Emojis(width, height, numEmoji, numRows, emojiBackerGeom, emojiGeom, backerMats, emojiMats);
        left.position.x = -3000 + 50;
        left.position.y = 5;
        that.add(left);
            
        right= new Emojis(width, height, numEmoji, numRows, emojiBackerGeom, emojiGeom, backerMats, emojiMats);
        right.position.x = 0 + 50;
        right.position.y = left.position.y;
        that.add(right);
        
        that.hide();
    }
    
    
    
    
}
EmojiTimesTwo.prototype = Object.create(THREE.Object3D.prototype);
EmojiTimesTwo.prototype.constructor = EmojiTimesTwo;




var Emojis = function( width, height, numEmoji, numRows, emojiBackerGeom, emojiGeom, backerMats, emojiMats ) {

    THREE.Object3D.apply(this);
    var that=this;
    var emojis = [null]; //FILL ZERO INDEX SO WE CAN JUST USE THEIR ID NUMBER AS THE INDEX


    var emojiSizeFullWidth = 87.85;
    var emojiSizeSquishedWidth = 40;
    var emojiSizeFullHeight = 48;
    var emojiSizeSquishedHeight = 48;
    
    var emojiPerRow = numEmoji / numRows;
    

    var xTrackFull = 0;
    var yTrackFull = numRows/2 * emojiSizeSquishedWidth;
    var xTrackSquished = 0;
    var yTrackSquished = numRows/2 * emojiSizeSquishedHeight;
    
    var count = 1;
    
    for (var i=0; i<numRows; i++){
        for (var j=0; j<emojiPerRow; j++){
            var emoji = new Emoji(count, emojiBackerGeom, backerMats.none, emojiGeom, emojiMats.neutral, {home:new THREE.Vector2(xTrackFull, yTrackFull),
                                                                                                          squished:new THREE.Vector2(xTrackSquished, yTrackSquished)
                                                                                                    } );
            emojis.push(emoji);
            that.add(emoji);
            xTrackFull += emojiSizeFullWidth;
            xTrackSquished += emojiSizeSquishedWidth;
            count++;
        }
        yTrackFull -= emojiSizeFullHeight;
        yTrackSquished -= emojiSizeFullHeight;
        xTrackFull = 0;
        xTrackSquished = 0;
    }

    this.setEmoji = function(id, mood){
	    if(emojis[id]){
        	emojis[id].setEmoji(emojiMats[mood]);
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


}
Emojis.prototype = Object.create(THREE.Object3D.prototype);
Emojis.prototype.constructor = Emojis;
