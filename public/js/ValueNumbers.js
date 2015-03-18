var ValueNumberArray = function( numPlanes, decimalPrime, percentPrime ) {
    THREE.Object3D.apply(this);
	
	
	var tens = new ValueNumber( numPlanes );
	var ones = new ValueNumber( numPlanes );
	var tenths = new ValueNumber( numPlanes );
	
	var percent = percentPrime.mesh.clone();
	percent.position.x = -15;
	percent.position.y = -3;
	this.add(percent);
	
	tenths.position.x = percent.position.x - 15;
	this.add(tenths);
	
	var decimal = decimalPrime.mesh.clone();
	decimal.position.x = tenths.position.x - 10;
	this.add(decimal);
	
	ones.position.x = decimal.position.x - 10;
	this.add(ones);
	
	tens.position.x = ones.position.x - 15;
	this.add(tens);
	
	var hundreds = numPlanes[1].mesh.clone();
	hundreds.position.x = tens.position.x - 12;
	this.add(hundreds);
	
	this.setNum = function(num){
		num *= 100;
		var hasHundreds = num >= 100;
		var hasTens = num >= 10;
		var num = num.toFixed(1);
		var pos = 0;
		if (hasHundreds){
			pos = 1;
			hundreds.visible = true;
		} else {
			hundreds.visible = false;
		}
		if (hasTens) {
			tens.visible = true;
			tens.setNum( parseInt(num[pos]) );
			pos++;
		} else {
			tens.visible = false;
		}
		ones.setNum( parseInt(num[pos]) );
		pos += 2;
		tenths.setNum( parseInt(num[pos]) );
	}
	
	
}
ValueNumberArray.prototype = Object.create(THREE.Object3D.prototype);
ValueNumberArray.prototype.constructor = ValueNumberArray;


var ValueNumber = function( numPlanes ) {
	THREE.Object3D.apply(this);
	var nums = [];
	var currentNum = 0;
	for (var i=0; i<10; i++){
		nums.push(numPlanes[i].mesh.clone());
		nums[i].visible = false;
		this.add(nums[i]);
	}
	
	
	this.setNum = function(num){
		if (nums[currentNum]){
			nums[currentNum].visible = false;
		}
		if (nums[num]){
			nums[num].visible = true;
		}
		currentNum = num;
	}
	
	this.setNum(0);
	
}
ValueNumber.prototype = Object.create(THREE.Object3D.prototype);
ValueNumber.prototype.constructor = ValueNumber;



var ValueNumberGenerator = function() {
    var numsCss = {'display':'inline-block',
	    	   'fontSize':'23px',
	    	   'fontFamily':'Swiss',
	    	   'color':'white'
    };
    var pctCss = {'display':'inline-block',
	    	   'fontSize':'18px',
	    	   'fontFamily':'Swiss',
	    	   'color':'white'
    };

	var numPlanes = [];
	
	for (var i=0; i<10; i++){
		var plane = new DomPlane(i.toString(), numsCss);
		numPlanes.push(plane);
	}
	
	var percent = new DomPlane('%', pctCss);
	var decimal = new DomPlane('.', numsCss);
	
	this.createValueNumberArray = function(){
		return new ValueNumberArray( numPlanes, decimal, percent );
	}

}
ValueNumberGenerator.prototype.constructor = ValueNumberGenerator;

