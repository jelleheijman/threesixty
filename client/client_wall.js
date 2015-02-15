if (Meteor.isClient) {
	Template.wall.rendered = function(){
	  // This code only runs on the client
		var camera, scene, renderer;
		var ticker;
		var renderWidth = 1280 * 2;
		var renderHeight = 720;
		var realWidth = 36225;
		var realHeight = 900;
		var realAspect = realWidth / realHeight;
		var numRows = 3;
		var numCols = 2;
		
		var stripWidth = renderWidth / numCols;
		var stripHeight = renderHeight / numRows; 
		var stripAspect = stripWidth / stripHeight;
		var sceneWidth = 6000;
		var sceneStripWidth = sceneWidth / numCols / numRows;
		var sceneStripHeight = sceneStripWidth / stripAspect;
		var camZ = 16110;
		
		var emoji;

		var views = [
			{
				left: 0, bottom: 2/3, width: .5, height: 1/3, camLeft:-3000, camRight:-2000,
				background: new THREE.Color().setRGB( .4,.2,.3 )
			},
			{ 
				left: 0, bottom: 1/3, width: .5, height: 1/3, camLeft:-1000, camRight:0,
				background: new THREE.Color().setRGB( 0.7, 0.5, 0.5 )
			},
			{ 
				left: 0, bottom: 0, width: .5, height: 1/3, camLeft:1000, camRight:2000,
				background: new THREE.Color().setRGB( 0.5, 0.7, 0.7 )
			},
			{
				left: .5, bottom: 2/3, width: .5, height: 1/3, camX: -1500, camLeft:-2000, camRight:-1000,
				background: new THREE.Color().setRGB( 0.8, 0.5, 0.7 ),
			},
			{ 
				left: .5, bottom: 1/3, width: .5, height: 1/3, camLeft:0, camRight:1000,
				background: new THREE.Color().setRGB( 0.3, 0.5, 0.5 ),
			},
			{ 
				left: .5, bottom: 0, width: .5, height: 1/3, camLeft:2000, camRight:3000,
				background: new THREE.Color().setRGB( 0.9, 0.7, 0.7 ),
			}
		];

		$(document).ready( function(){
		    initScene();
		    $("body").css('overflow', 'hidden');
		    $('#forceFontLoad').remove();
			    
			var tickerCursor = TickerItems.find({'cyclesRemaining':{$gt:0}});
			
			ticker = new Ticker( sceneWidth, tickerCursor.fetch() );
			ticker.position.y = -80;
			scene.add(ticker);
			
			
			var initializingTicker = true;
			var tickerObserver = tickerCursor.observe({
		            addedAt: function(tickerItem, index, before){
			            if (!initializingTicker){
			            	ticker.addItem(tickerItem);
			            }
		            },
		            changedAt: function(newTickerItem, oldTickerItem, index){

		            },
		            removedAt: function (oldTickerItem, index) {
						//console.log(oldTickerItem);
		            },
		            movedTo: function(tickerItem, fromIndex, toIndex, before) {
			            //console.log(tickerItem);
		            }
		        });
		    initializingTicker = false;
			var settingsCursor = SystemSettings.find({});
			var initializingSettings = true;
			var settingsOberver = settingsCursor.observe({
	            changed: function(newSettingsItem, oldSettingsItem){
					updateSettings(newSettingsItem);
	            },

		    });
		    initializingSettings = false;
		    
		    
		    emoji = new EmojiTimesTwo(3000, 80, 100, 3);
		    scene.add(emoji);
		    
		    
		    setInterval( function(){
    		    emoji.setEmoji(Math.round(Math.random() * 100 + 1), 'happy');
		    }, 2000);
		    
            animate();
	    });
	    
	    

		function animate() {
			ticker.update();
			render();
			requestAnimationFrame( animate );
		}

		var ri, left, bottom, width, height;
		var numViews = views.length;
		
		function render() {
			for ( ri = 0; ri < numViews; ri++ ) {
				view = views[ri];
				camera = view.camera;
		
				var left   = Math.floor( renderWidth  * view.left );
				var bottom = Math.floor( renderHeight * view.bottom );
				var width  = Math.floor( renderWidth  * view.width );
				var height = Math.floor( renderHeight * view.height );
				renderer.setViewport( left, bottom, width, height );
				renderer.setScissor( left, bottom, width, height );
				renderer.enableScissorTest ( true );
				renderer.setClearColor( view.background );
		
				camera.aspect = width / height;
				camera.updateProjectionMatrix();
		
				renderer.render( scene, camera );
			}
		}
		function initScene() {
			container = document.createElement( 'div' );
			document.body.appendChild( container );
			for (var i=0; i<views.length; i++){
				var thisCamera = new THREE.OrthographicCamera( views[i].camLeft, views[i].camRight, sceneStripHeight/2, sceneStripHeight/-2, 1, 20000 );
				thisCamera.position.set(0,0,camZ);
				views[i].camera = thisCamera;
			}
			scene = new THREE.Scene();		
			scene.add( new THREE.AmbientLight( 0x505050 ) );
		
			var light = new THREE.PointLight( 0xffffff, 1.5, 6000 );
			light.position.set( 0, 500, 2000 );
			scene.add( light );
			
			renderer = new THREE.WebGLRenderer( { antialias:true} );
			renderer.setSize( window.innerWidth, window.innerHeight );
			container.appendChild( renderer.domElement );
		}
		
		function updateSettings(newSetting){
			switch (newSetting.name){
				case 'tickerStatus':
					if (newSetting.onOff == 'on' && ticker.active === false){
						ticker.turnOn();
					} else if (newSetting.onOff == 'off' && ticker.active === true){
						ticker.turnOff();
					}
			}
		}
		    
		    
	};



}


