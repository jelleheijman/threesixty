var BackgroundScene = function( flare ) {
    THREE.Object3D.apply(this);
	var that = this;
	
	var europeMapLeft, europeMapRight, title;
	
	var rotateMaps = true;
	var moveBlobs = true;
	
	var blobGeom = new THREE.PlaneBufferGeometry(1000,200);
	var gradientTex = THREE.ImageUtils.loadTexture('/img/gradient.jpg');
	var blobMat = new THREE.MeshBasicMaterial({map:gradientTex, blending:THREE.AdditiveBlending, transparent:true});

	var blob1 = new THREE.Mesh(blobGeom, blobMat)
	blob1.position.set(-2800, -130, -500);
	
	var blob2 = new THREE.Mesh(blobGeom, blobMat);
	blob2.position.set(2800, -130, -500);
	
	var titleFlare = new THREE.Mesh(flare.geometry, flare.material);
	titleFlare.position.set(100, 60, -400);
	titleFlare.scale.set(35, 1.5, 1);
	this.add(titleFlare);
	
	var titleBlob = new THREE.Mesh(blobGeom, blobMat);
	titleBlob.position.set(0,0,-1100);
	this.add(titleBlob)
	
	this.add(blob1);
	this.add(blob2);
	
	moveBlobsA();

    //// LOAD BOXY MAPS
	var loader = new THREE.OBJMTLLoader();
	loader.load( '/models/360cubes_europe.obj', '/models/360cubes_europe.mtl', function(obj){
		
		//TODO SHARE GEOMETRIES BETWEEN LEFT AND RIGHT
	
		obj.children[0].children[1].material.emissive = new THREE.Color(0xd8f6ff);// UK TOP
		obj.children[0].children[2].material.emissive = new THREE.Color(0x333333);// UK SIDES
		
		obj.children[1].children[1].material.emissive = new THREE.Color(0x28405d);// EUROPE SIDES
		obj.children[1].children[2].material.emissive = new THREE.Color(0x78bbce);// EUROPE TOP
		
		obj.children[0].scale.set(50, 50, 50);
		obj.children[1].scale.set(50, 50, 50);
		
		europeMapLeft = new THREE.Object3D();
		europeMapLeft.add(obj.children[0].clone());
		europeMapLeft.add(obj.children[1].clone());
		europeMapLeft.rotation.set (.2, .2, 0);
		europeMapLeft.position.set(-2000, 0 , -1000);
		
		europeMapRight = new THREE.Object3D();
		europeMapRight.add(obj.children[0].clone());
		europeMapRight.add(obj.children[1].clone());
		europeMapRight.rotation.set(.2, -.2, 0);
		europeMapRight.position.set(2000, 0 , -1000);

		that.add(europeMapLeft);
		that.add(europeMapRight);
		rotateMapA();
		
	});
	
	
	//// LOAD TITLE 
	loader.load( '/models/title.obj', '/models/title.mtl', function(obj){
		for (var i=0; i<obj.children.length; i++){
			for (var j=0; j<obj.children[i].children.length; j++){
				if (obj.children[i].children[j].material){
					var orig = obj.children[i].children[j].material;
					obj.children[i].children[j].material = new THREE.MeshLambertMaterial({ambient:0xFFFFFF, color:orig.color, map:orig.map});
					if (i==3){
						obj.children[i].children[j].material.emissive = new THREE.Color(0x333333);
					}
				}
			}
		}
		title = obj;
		title.position.set(0,0,-1000);
		title.scale.set(60,60,60);
		title.rotation.x = Math.PI*2/4;
		title.rotation.y = Math.PI;
		that.add(title);
		console.log(title);
	
	});
	
	
	
	function moveBlobsA(){
		if (moveBlobs){
			TweenLite.to( blob1.position, 70, {x:-1100, ease:Sine.easeInOut, onComplete:moveBlobsB} );
			TweenLite.to( blob2.position, 70, {x:1100, ease:Sine.easeInOut, onComplete:moveBlobsB} );
		}
	}
	function moveBlobsB(){
		if (moveBlobs){
			TweenLite.to( blob1.position, 70, {x:-2800, ease:Sine.easeInOut, onComplete:moveBlobsB} );
			TweenLite.to( blob2.position, 70, {x:2800, ease:Sine.easeInOut, onComplete:moveBlobsB} );
		}
	}
	
	function rotateMapA(){
		if ( rotateMaps ){
			TweenLite.to( europeMapLeft.rotation, 50, {y:-.2, ease:Sine.easeInOut, onComplete:rotateMapB} );
			TweenLite.to( europeMapRight.rotation, 50, {y:.2, ease:Sine.easeInOut, onComplete:rotateMapB} );
		}
	}
	function rotateMapB(){
		if ( rotateMaps ){
			TweenLite.to( europeMapLeft.rotation, 50, {y:.2, ease:Sine.easeInOut, onComplete:rotateMapA} );
			TweenLite.to( europeMapRight.rotation, 50, {y:-.2, ease:Sine.easeInOut, onComplete:rotateMapA} );
		}
	}		
    
}
BackgroundScene.prototype = Object.create(THREE.Object3D.prototype);
BackgroundScene.prototype.constructor = BackgroundScene;


