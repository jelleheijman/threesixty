var Emoji = function( id, backerGeom, backerMat, emojiGeom, emojiMat, homePosition ) {
    THREE.Object3D.apply(this);

    var scale = 20;
    var that=this;
    this.mood = 'neutral';
    this.rotation.x = Math.PI*2/4;
    this.scale.set(scale,scale,scale);
    this.position.set(homePosition.x, homePosition.y, 0);
    
    var backer = new THREE.Mesh(backerGeom, backerMat);
    backer.rotation.x = -Math.PI*2/4;
    var emoji = new THREE.Mesh(emojiGeom, emojiMat);
    emoji.rotation.x = -Math.PI*2/4;
    emoji.position.y = .8;
    
    this.add(backer);
    this.add(emoji);

    this.setBacker = function(mat){
        backer.material = mat;
        backer.material.needsUpdate = true;
    };
    this.setEmoji = function(mood, mat){
	    that.mood = mood;
        TweenLite.to( that.rotation, .3, {z:Math.PI*2/4, ease:Linear.easeInOut, onComplete:function(){
            emoji.material = mat;
            emoji.material.needsUpdate = true;       
            that.rotation.z = -Math.PI*2/4;
            TweenLite.to( that.rotation, .3, {z:0, ease:Linear.easeInOut} );
        }} );
        TweenLite.to( that.scale, .3, {x:scale*1.5, y:scale*1.5, z:scale*1.5, onComplete:function(){
             TweenLite.to( that.scale, .3, {x:scale, y:scale, z:scale} );
        }} );
    };
    
    this.goHome = function(dur, delay){
	    dur = dur || 1;
	    delay = delay || 0;
	    TweenLite.to( that.position, 1, {x:homePosition.x, y:homePosition.y, delay:delay} );
    }
    
    this.hide = function(delay){
	    TweenLite.to(that.rotation, .3, {z:Math.PI*2/4, delay:delay, onComplete:function(){
		    that.visible = false;
	    }});
    }
    this.reveal = function(delay){
	    that.rotation.z = Math.PI*2/4;
	    TweenLite.to(that.rotation, .3, {z:0, delay:delay, onStart:function(){
		    that.visible = true;
	    }});
    }
}
Emoji.prototype = Object.create(THREE.Object3D.prototype);
Emoji.prototype.constructor = Emoji;
