var DomPlane = function( itemData, c, width, spacing ) {
    var that=this;
    
    this.id = itemData._id;
    
    
    this.html = itemData.text;
    this.css = c;
    
    this.width;
    this.incoming = false;
    this.finished = false;
    var startX = -width/2;
    var endX = width/2;
    
	
	var geo = new THREE.PlaneBufferGeometry(1, 1);
	var mat = new THREE.MeshLambertMaterial({transparent:true});
	var tex;
	var mesh = new THREE.Mesh(geo, mat);
	this.mesh = mesh;
	
	
	this.updatePosition = function(offset){
		if (that.incoming && that.mesh.position.x > startX + that.width/2){
			that.incoming = false;
		}
		if (that.mesh.position.x > endX + that.width/2) {
			that.finished = true;
		}
		that.mesh.position.x += offset;
	}
	this.reset = function(){
		that.mesh.position.x = startX - that.width/2 - spacing;
		that.finished = false;
	}
	
	this.render = function(){
		
		var domElement = document.createElement( 'div' );
		domElement.innerHTML = that.html;
		var style = '';
		for ( var key in that.css ){
			domElement.style[key] = that.css[key];
		}

		document.body.appendChild(domElement);
		var width = domElement.offsetWidth;
		var height = domElement.offsetHeight*1.1;	
		
		html2canvas(domElement, {
			onrendered: function(canvas) {
				tex = new THREE.Texture(canvas);
				tex.needsUpdate = true;
				mat.map = tex;
				mat.needsUpdate = true;
				that.mesh.scale.x = width;
				that.mesh.scale.y = height;
				that.mesh.position.x = startX - width/2 - spacing;
				setTimeout( function(){document.body.removeChild(domElement);}, 10 );
				that.width = width;
			},
			width:width,
			height:height
		});
	}
	
	this.render();

}	
DomPlane.prototype.constructor = DomPlane;
