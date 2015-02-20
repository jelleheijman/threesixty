var Ticker = function( sceneWidth, initialData, active ) {
    THREE.Object3D.apply(this);

    
	var that = this;
	this.active = active;
	var width = sceneWidth;
	var startX = sceneWidth / 2;
	var endX = -sceneWidth / 2;
	
	var spacing = 10;

	var allItems = [];
	var displayItems = [];
	var queueItems = [];

    var css = {'display':'inline-block',
	    	   'fontSize':'20px',
	    	   'fontFamily':'Swiss',
	    	   'color':'white'
    };	
	
	this.addItem = function( itemData, now ) {
		var item = new TickerItem( itemData, css, startX, endX, spacing );
		if (now) {
			queueItems.unshift( item )
		} else {
			queueItems.push( item );
		}
	}
	
	this.turnOn = function(){
		that.active = true;
		that.visible = true;
	}
	this.turnOff = function(){
		that.active = false;
		that.visible = false;
	}
	
	this.update = function(){
		if (that.active) {
			if ( displayItems.length == 0 || displayItems[0].incoming === false ) {
				if (queueItems.length > 0){
					displayItems.unshift( queueItems[0] );
					queueItems.shift();
					displayItems[0].incoming = true;
					that.add( displayItems[0] );
				}
			}
			var len = displayItems.length;
			for (var i=0; i<len; i++){
				displayItems[i].updatePosition(-5);
				// WHAT TO DO IF A ITEM HAS GONE OFF THE END..
				if ( displayItems[i].finished ) {
					that.remove( displayItems[i].mesh );
					displayItems[i].reset();
					if (queueItems.length == 0){
						queueItems.push(displayItems[i]);
					} else {
						var dbItem = TickerItems.findOne(displayItems[i].mongoId);
						var cyclesRemaining = dbItem.cyclesRemaining;
						cyclesRemaining--;
						TickerItems.update(dbItem._id, {$set:{cyclesRemaining:cyclesRemaining}});
					}
					displayItems.splice(i, 1);
					len = displayItems.length;
				}
			}
		}
	}

	function init(){
		for (var i=0; i<initialData.length; i++){
			if (initialData[i].cyclesRemaining > 0){
				that.addItem( initialData[i] );
			}
		}
	}
	init();

}	
Ticker.prototype = Object.create(THREE.Object3D.prototype);
Ticker.prototype.constructor = Ticker;

var TickerItem = function(itemData, css, startX, endX, spacing){
	THREE.Object3D.apply(this);
	var that = this;
	this.mongoId = itemData._id;
	this.incoming = false;
	this.finished = false;
	
	var plane = new DomPlane( itemData.text, css );
	this.position.x = startX + spacing;
	plane.eventEmitter.addEventListener( 'ready', onRendered );
	this.add(plane.mesh);
	
	this.updatePosition = function( offset){
		if (that.incoming && that.position.x < startX - plane.width - spacing){
			that.incoming = false;
		}
		if (that.position.x < endX - plane.width) {
			that.finished = true;
		}
		that.position.x += offset;
	}
	this.reset = function(){
		that.position.x = startX + spacing;
		that.finished = false;
	}	
	function onRendered(){
		plane.mesh.position.x = plane.width/2;
		plane.eventEmitter.removeEventListener( 'ready', onRendered );
	}
}
TickerItem.prototype = Object.create(THREE.Object3D.prototype);
TickerItem.prototype.constructor = TickerItem;