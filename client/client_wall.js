if (Meteor.isClient) {
	Template.wall.rendered = function(){
	  // This code only runs on the client
		var scene, renderer;
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

		var flareGeom = new THREE.PlaneBufferGeometry( 1,1 );
		var flareTex = THREE.ImageUtils.loadTexture('/img/blue_flare.jpg');
		flareTex.repeat = new THREE.Vector2(.99,.99);
		flareTex.offset = new THREE.Vector2(.005,0);
		var flareMat = new THREE.MeshBasicMaterial({map:flareTex, transparent:true, blending:THREE.AdditiveBlending});
		flareMat.depthWrite = false;
		flareMat.depthTest = false;
		flareMat.needsUpdate = true;
		var flare = {geometry:flareGeom, material:flareMat};
		var scenes = {};
		var mainBkg;
		
		var settings = {};

		var views = [
			{
				left: 0, bottom: 2/3, width: .5, height: 1/3, camLeft:-3000, camRight:-2000,
			},
			{ 
				left: 0, bottom: 1/3, width: .5, height: 1/3, camLeft:-1000, camRight:0,
			},
			{ 
				left: 0, bottom: 0, width: .5, height: 1/3, camLeft:1000, camRight:2000, 
			},
			{
				left: .5, bottom: 2/3, width: .5, height: 1/3,  camLeft:-2000, camRight:-1000,
			},
			{ 
				left: .5, bottom: 1/3, width: .5, height: 1/3,  camLeft:0, camRight:1000, 
			},
			{ 
				left: .5, bottom: 0, width: .5, height: 1/3, camLeft:2000, camRight:3000,
			}
		];

		$(document).ready( function(){
		    initScene();
		    $("body").css('overflow', 'hidden');
		    $('.forceFontLoad').remove();
			    
			var tickerCursor = TickerItems.find({'cyclesRemaining':{$gt:0}});
				
			setTimeout( function(){
				
			    mainBkg = new BackgroundScene();
			    scene.add(mainBkg);
				
				ticker = new Ticker( sceneWidth, tickerCursor.fetch(), SystemSettings.findOne({name:'tickerStatus'}).value == 'on' );
				ticker.position.y = -80;
				scene.add(ticker);
	
				scenes.titleScene = new TitleScene(flare);
				scene.add(scenes.titleScene);
	
			    scenes.emoji = new EmojiTimesTwo(3000, 80, 100, 3);
			    scene.add(scenes.emoji);
			    
			    scenes.question = new QuestionDisplay(flare);
			    scene.add(scenes.question);
			    

			    
			    
			    var activeSceneSetting = SystemSettings.findOne({name:'activeScene'});
			    SystemSettings.update( activeSceneSetting._id, {$set: {value:'titleScene'}} );
			    var questionModeSetting = SystemSettings.findOne({name:'questionMode'});
			    SystemSettings.update( questionModeSetting._id, {$set: {value:'question'}} );
			    var emojiModeSetting = SystemSettings.findOne({name:'emojiMode'});
			    SystemSettings.update( emojiModeSetting._id, {$set: {value:'full'}} );

			    
		    }, 4000);
		    
		    setTimeout( function(){
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
					added: function(settingsItem){
						initializeSettings(settingsItem);
					},
		            changed: function(newSettingsItem, oldSettingsItem){
						updateSettings(newSettingsItem, oldSettingsItem);
		            },
	
			    });
			    initializingSettings = false;
			    
	            var connectionsCursor = Connections.find({type:'ipad'});
				var connectionsObserver = connectionsCursor.observe({
					added: function(newConnection){
						updateConnections(newConnection);
					},
		            changed: function(newConnection, oldConnection){   
		                if (newConnection.emoji != oldConnection.emoji){
						    updateConnections(newConnection);
						}
		            },
			    });
			    
	            var questionsCursor = Questions.find({});
				var questionsObserver = questionsCursor.observe({
		            changed: function(newQuestion, oldQuestion){   
		                scenes.question.updateQuestion(newQuestion);
		            },
			    });
			    
		    }, 6000);
		    
		    
		    setTimeout( function(){
			    // SET THE QUESTION DISPLAY TO THE ACTIVE QUESTION
			    var activeQuestionId = SystemSettings.findOne({name:'activeQuestion'}).value;
			    var activeQuestion = Questions.findOne(activeQuestionId);
			    scenes.question.setQuestion(activeQuestion);
		    }, 10000);
			
		    //var bkgGeom = new THREE.PlaneBufferGeometry(6000, 200);
		    //var bkgMat = new THREE.MeshBasicMaterial({map:THREE.ImageUtils.loadTexture('/img/wall_bkg.jpg')});
		    //var bkg = new THREE.Mesh(bkgGeom, bkgMat);
		    //bkg.position.z = -500;
		    //scene.add(bkg);

		    
            animate();
	    });
	    
	    

		function animate() {
			if (ticker){
				ticker.update();
			}
			if (scenes.question){
				scenes.question.tick();
			}
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

		
				camera.aspect = width / height;
				camera.updateProjectionMatrix();
		
				renderer.render( scene, camera );
			}
		}
		function initScene() {
			container = document.createElement( 'div' );
			document.body.appendChild( container );
			for (var i=0; i<views.length; i++){
				var thisCamera = new THREE.OrthographicCamera( views[i].camLeft, views[i].camRight, sceneStripHeight/2, sceneStripHeight/-2, 1, 20000
				 );
				thisCamera.position.set(0,0,camZ );
				views[i].camera = thisCamera;
			}
			scene = new THREE.Scene();		
			scene.add( new THREE.AmbientLight( 0x505050 ) );
		
			var light = new THREE.PointLight( 0xffffff, 1.5, 17000 );
			light.position.set( 0, 3000, 5000 );
			scene.add( light );
			
			renderer = new THREE.WebGLRenderer( { antialias:true } );
			renderer.sortObjects = false;
			renderer.setClearColor( 0x28405d );
			renderer.setSize( window.innerWidth, window.innerHeight );
			container.appendChild( renderer.domElement );
		}
		
		function updateSettings(newSetting, oldSetting){
			settings[newSetting.name] = newSetting.value;
			switch (newSetting.name){
				case 'tickerStatus':
					if (newSetting.value == 'on' && ticker.active === false){
						ticker.turnOn();
					} else if (newSetting.value == 'off' && ticker.active === true){
						ticker.turnOff();
					}
					break;
				case 'activeQuestion':
					var newQuestion = Questions.findOne( newSetting.value );
					scenes.question.setQuestion( newQuestion );
					break;
				case 'activeScene':
					if (oldSetting) {
						if (scenes[oldSetting.value]) {
							scenes[oldSetting.value].hide();
						}
					}
					if (scenes[newSetting.value]){
						scenes[newSetting.value].reveal(.5);
					}
					if ( oldSetting.value == 'titleScene' ){
						mainBkg.reveal();
					} else if ( newSetting.value == 'titleScene' ){
						mainBkg.hide();
					}
					break;
				case 'questionMode':
					scenes.question.setMode(newSetting.value);
					break;
				case 'emojiMode':
					scenes.emoji.setMode(newSetting.value);
					break;
			}
		}
		function initializeSettings( setting ) {
			settings[setting.name] = setting.value;
		}
		
		function updateConnections(newConnection){
    		var emojiId = parseInt(newConnection.deviceid);
    		if (scenes.emoji) {
    			scenes.emoji.setEmoji(emojiId, newConnection.emoji);
    		}
		}
		    
		    
	};



}


