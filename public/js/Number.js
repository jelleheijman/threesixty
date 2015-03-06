var ValueNumber = function( numPlanes ) {
    THREE.Object3D.apply(this);
	
	
	
	
}
ValueNumber.prototype = Object.create(THREE.Object3D.prototype);
ValueNumber.prototype.constructor = ValueNumber;

var ValueNumbers = function() {
    THREE.Object3D.apply(this);
    
    var numsCss = "color:white; "
    var pctCss = "color:white; "

	var numPlanes = [];
	
	for (var i=0; i<10; i++){
		var plane = new DomPlane(i.toString(), numsCss);
		numPlanes.push(plane);
	}
	
	var percent = new DomPlane('%', pctCss);

}
ValueNumbers.prototype = Object.create(THREE.Object3D.prototype);
ValueNumbers.prototype.constructor = ValueNumbers;

