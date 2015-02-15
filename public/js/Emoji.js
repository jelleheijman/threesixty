var Emoji = function( id, backerGeom, backerMat, emojiGeom, emojiMat, positions ) {
    THREE.Object3D.apply(this);

    
    var that=this;
    this.rotation.x = Math.PI*2/4;
    this.scale.set(10,10,10);
    this.position.set(positions.home.x, positions.home.y, 0);
    
    var backer = new THREE.Mesh(backerGeom, backerMat);
    var emoji = new THREE.Mesh(emojiGeom, emojiMat);
    emoji.rotation.x = -Math.PI*2/4;
    emoji.position.y = 1;
    
    this.add(backer);
    this.add(emoji);

    this.setBacker = function(mat){
        backer.material = mat;
        backer.material.needsUpdate = true;
    };
    this.setEmoji = function(mat){
        TweenLite.to( that.rotation, .3, {z:Math.PI*2/4, ease:Linear.easeInOut, onComplete:function(){
            emoji.material = mat;
            emoji.material.needsUpdate = true;       
            that.rotation.z = -Math.PI*2/4;
            TweenLite.to( that.rotation, .3, {z:0, ease:Linear.easeInOut} );
        }} );

    };


}
Emoji.prototype = Object.create(THREE.Object3D.prototype);
Emoji.prototype.constructor = Emoji;
