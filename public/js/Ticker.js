var Ticker = function( sceneWidth, initialData ) {
    THREE.Object3D.apply(this);
    
	var that = this;
	this.active = true;
	var width = sceneWidth;
	var startX = -sceneWidth / 2;
	
	var itemSpacing = 80;

	var allItems = [];
	var displayItems = [];
	var queueItems = [];

    var css = {'display':'inline-block',
	    	   'fontSize':'20px',
	    	   'fontFamily':'Swiss',
	    	   'color':'white'
    };	
	
	this.addItem = function( itemData, now ) {
		var item = new DomPlane( itemData, css, width, itemSpacing, 'left' );
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
					that.add( displayItems[0].mesh );
				}
			}
			var len = displayItems.length;
			for (var i=0; i<len; i++){
				displayItems[i].updatePosition(-2);
				// WHAT TO DO IF A ITEM HAS GONE OFF THE END..
				if ( displayItems[i].finished ) {
					that.remove( displayItems[i].mesh );
					displayItems[i].reset();
					if (queueItems.length == 0){
						queueItems.push(displayItems[i]);
					} else {
						var dbItem = TickerItems.findOne({_id:displayItems[i].id});
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
			that.addItem( initialData[i] );
		}
	}
	init();

}	
Ticker.prototype = Object.create(THREE.Object3D.prototype);
Ticker.prototype.constructor = Ticker;
