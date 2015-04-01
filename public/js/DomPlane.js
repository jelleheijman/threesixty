var DomPlane = function( html, css ) {
    var that=this;
    this.html = html
    this.css = css;
    this.eventEmitter = document.createElement('div');
    
    this.width;
    this.height;
    this.incoming = false;
    this.finished = false;
    
	
	var geo = new THREE.PlaneBufferGeometry(1, 1);
	var mat = new THREE.MeshBasicMaterial({transparent:true, depthWrite:false});
	var tex;
	var mesh = new THREE.Mesh(geo, mat);
	this.mesh = mesh;
	
	
	this.setScale = function(scale){
		that.mesh.scale.x = that.width * scale;
		that.mesh.scale.y = that.height * scale;
	}
	
	this.render = function(){
		if (tex){
			tex.dispose();
		}
		var domElement = document.createElement( 'div' );
		//domElement.style.padding = '1%';
		domElement.innerHTML = that.html;
		var style = '';
		for ( var key in that.css ){
			domElement.style[key] = that.css[key];
		}

		document.body.appendChild(domElement);
		var width = $(domElement).width() + 5;
		var height = $(domElement).height();	
		
		html2canvas(domElement, {
			onrendered: function(canvas) {
				tex = new THREE.Texture(canvas);
				tex.needsUpdate = true;
				mat.map = tex;
				mat.needsUpdate = true;
				that.mesh.scale.x = width
				that.mesh.scale.y = height;
				that.width = width;
				that.height = height;
				that.eventEmitter.dispatchEvent( new Event('ready') );
				setTimeout( function(){document.body.removeChild(domElement);}, 10 );
				
			},
			width:width,
			height:height
		});
	}
	this.render();
}	
DomPlane.prototype.constructor = DomPlane;
