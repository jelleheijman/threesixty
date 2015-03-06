var ValueNumberArray = function( numPlanes, percent ) {
    THREE.Object3D.apply(this);
	
	var numDigits
	
	
	
}
ValueNumber.prototype = Object.create(THREE.Object3D.prototype);
ValueNumber.prototype.constructor = ValueNumber;

var ValueNumberGenerator = function() {
    
    var numsCss = "color:white; "
    var pctCss = "color:white; "

	var numPlanes = [];
	
	for (var i=0; i<10; i++){
		var plane = new DomPlane(i.toString(), numsCss);
		numPlanes.push(plane);
	}
	
	var percent = new DomPlane('%', pctCss);
	
	
	this.createValueNumberArray = function(){
		return new ValueNumberArray( numPlanes, percent );
	}

}
ValueNumbers.prototype.constructor = ValueNumbers;

