var TitleScene = function( flare ) {
    THREE.Object3D.apply(this);
	var that = this;
	
	var europeMapLeft, europeMapRight, title;

	//CREATE FLARE FOR TITLE GRAPHIC
	var titleFlare = new THREE.Mesh(flare.geometry, flare.material);
	titleFlare.position.set(100, 60, -400);
	titleFlare.scale.set(35, 1.5, 1);
	this.add(titleFlare);

	// CREATE LIGHT BLOBS
	var blobGeom = new THREE.PlaneBufferGeometry(1000,200);
	var gradientTex = THREE.ImageUtils.loadTexture('/img/gradient.jpg');
	var blobMat = new THREE.MeshBasicMaterial({map:gradientTex, blending:THREE.AdditiveBlending, transparent:true});
	blobMat.depthWrite = false;

	var blob1 = new THREE.Mesh(blobGeom, blobMat)
	blob1.position.set(-2800, -130, -500);
	
	var blob2 = new THREE.Mesh(blobGeom, blobMat);
	blob2.position.set(2800, -130, -500);

	var titleBlob = new THREE.Mesh(blobGeom, blobMat);
	titleBlob.position.set(0,0,-1100);
	this.add(titleBlob)
	
	this.add(blob1);
	this.add(blob2);
	

	
	// CREATE GLASS PANELS
	var glassGeom = new THREE.PlaneBufferGeometry(800,200);
	var glassTex = THREE.ImageUtils.loadTexture('img/glass_panel.jpg');
	var glassMat = new THREE.MeshBasicMaterial({map:glassTex, blending:THREE.AdditiveBlending, transparent:true});
	glassMat.depthWrite = false;
	var glassLeft = new THREE.Mesh(glassGeom, glassMat);
	var glassRight = new THREE.Mesh(glassGeom, glassMat);
	glassLeft.position.set(-1200, 0, -600);
	glassRight.position.set(1200, 0, -600);
	this.add(glassLeft, glassRight);




	

    //// LOAD COLUMN MAPS
	var loader = new THREE.OBJMTLLoader();
	loader.load( '/models/360cubes_europe.obj', '/models/360cubes_europe.mtl', function(obj){
		
		//////////////////////////////////////////////
		//TODO SHARE GEOMETRIES BETWEEN LEFT AND RIGHT
		obj.children[0].children[1].material.emissive = new THREE.Color(0xd8f6ff);// UK TOP
		obj.children[0].children[2].material.emissive = new THREE.Color(0x333333);// UK SIDES
		
		obj.children[1].children[1].material.emissive = new THREE.Color(0x28405d);// EUROPE SIDES
		obj.children[1].children[2].material.emissive = new THREE.Color(0x78bbce);// EUROPE TOP
		
		obj.children[0].scale.set(50, 50, 50);
		obj.children[1].scale.set(50, 50, 50);
		
		// CLONE THE LOADED OBJECT TO LEFT AND RIGHT OF SCREEN
		europeMapLeft = new THREE.Object3D();
		europeMapLeft.add(obj.children[0].clone());
		europeMapLeft.add(obj.children[1].clone());
		europeMapLeft.rotation.set (.2, .2, 0);
		europeMapLeft.position.set(-2000, 0 , -1500);
		
		europeMapRight = new THREE.Object3D();
		europeMapRight.add(obj.children[0].clone());
		europeMapRight.add(obj.children[1].clone());
		europeMapRight.rotation.set(.2, -.2, 0);
		europeMapRight.position.set(2000, 0 , -1500);

		that.add(europeMapLeft);
		that.add(europeMapRight);
		rotateMapA();
		// START BLOB TWEENS
		moveEffectsA();
	});
	

	
	
	//// LOAD TITLE OBJECT
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
	});
	
	// PUBLIC FUNCTION TO HIDE THE TITLE
	this.hide = function(){
		TweenLite.killTweensOf(blob1.position);
		TweenLite.killTweensOf(blob2.position);
		TweenLite.killTweensOf(glassLeft.position);
		TweenLite.killTweensOf(glassRight.position);
		TweenLite.killTweensOf(titleFlare.position);
		TweenLite.to(glassLeft.position, 1, {x:-3500});
		TweenLite.to(glassRight.position, 1, {x:3500});
		TweenLite.to(title.rotation, 1, {x:Math.PI});
		TweenLite.to(title.scale, .2, {x:80, y:80, z:80, onComplete:function(){
			TweenLite.to(title.scale, .8, {x:1, y:1, z:1});
		}});
		TweenLite.to(titleFlare.position, .2, {x:0, y:0});
		TweenLite.to(titleFlare.scale, .2, {x:350, y:30, onComplete:function(){
			TweenLite.to(titleFlare.scale, .8, {x:1, y:1, z:1, onComplete:function(){
				that.visible = false;
			}});
		}});

	}
	this.reveal = function(){
		that.visible = true;
		TweenLite.killTweensOf(blob1.position);
		TweenLite.killTweensOf(blob2.position);
		TweenLite.killTweensOf(glassLeft.position);
		TweenLite.killTweensOf(glassRight.position);
		TweenLite.killTweensOf(titleFlare.position);
		TweenLite.to(glassLeft.position, 1, {x:-3500});
		TweenLite.to(glassRight.position, 1, {x:3500});
		
		TweenLite.to(title.scale, 1, {x:60, y:60, z:60});
		TweenLite.to(title.rotation, 1, {x:Math.PI*2/4, y:Math.PI});
		TweenLite.to( titleFlare.scale, 1, {x:350, y:15} );
		TweenLite.to( titleFlare.position, 1, {x:100, y:60, z:-400} );
	}
	
	function moveEffectsA(){
			TweenLite.to( blob1.position, 70, {x:-1100, ease:Sine.easeInOut, onComplete:moveEffectsB} );
			TweenLite.to( blob2.position, 70, {x:1100, ease:Sine.easeInOut} );
			TweenLite.to( glassLeft.position, 70, {x:-2900, ease:Sine.easeInOut} );
			TweenLite.to( glassRight.position, 70, {x:2900, ease:Sine.easeInOut} );
	}
	function moveEffectsB(){
			TweenLite.to( blob1.position, 70, {x:-2800, ease:Sine.easeInOut, onComplete:moveEffectsA} );
			TweenLite.to( blob2.position, 70, {x:2800, ease:Sine.easeInOut} );
			TweenLite.to( glassLeft.position, 70, {x:-1200, ease:Sine.easeInOut} );
			TweenLite.to( glassRight.position, 70, {x:1200, ease:Sine.easeInOut} );
	}
	
	function rotateMapA(){
			TweenLite.to( europeMapLeft.rotation, 50, {y:-.2, ease:Sine.easeInOut, onComplete:rotateMapB} );
			TweenLite.to( europeMapRight.rotation, 50, {y:.2, ease:Sine.easeInOut} );
	}
	function rotateMapB(){
			TweenLite.to( europeMapLeft.rotation, 50, {y:.2, ease:Sine.easeInOut, onComplete:rotateMapA} );
			TweenLite.to( europeMapRight.rotation, 50, {y:-.2, ease:Sine.easeInOut} );
	}		
    
}
TitleScene.prototype = Object.create(THREE.Object3D.prototype);
TitleScene.prototype.constructor = TitleScene;




var BackgroundScene = function() {
    THREE.Object3D.apply(this);
    var that = this;
	// CREATE THE BLUR BACKGROUND PLANE TO SHOW WHEN THE TITLE IS OFFSCREEN
	var bkgGeom = new THREE.PlaneBufferGeometry(3000, 200);
	var bkgTex = THREE.ImageUtils.loadTexture( 'img/blur_bkg.jpg' );
	var bkgMat = new THREE.MeshBasicMaterial({map:bkgTex, transparent:true, opacity:0});
	var bkgLeft = new THREE.Mesh(bkgGeom, bkgMat);
	var bkgRight = new THREE.Mesh(bkgGeom, bkgMat);
	bkgLeft.position.set(-1500, 0, -500);
	bkgRight.position.set(1500, 0, -500);

	this.add(bkgLeft, bkgRight);
	this.visible = false;
	
	this.reveal = function(delay){
		that.visible = true;
		TweenLite.to(bkgMat, .6, {opacity:1, delay:delay, onUpdate:function(){
			bkgMat.needsUpdate = true;
		}});
	}
	this.hide = function(){
		TweenLite.to(bkgMat, .6, {opacity:0, delay:.2, onUpdate:function(){
				bkgMat.needsUpdate = true;
			}, onComplete:function(){
				that.visible = false;
			}
		});
	}
}
BackgroundScene.prototype = Object.create(THREE.Object3D.prototype);
BackgroundScene.prototype.constructor = BackgroundScene;

