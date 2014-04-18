var SSS = {
"pop": 0,
"med": 0,
"avg": 0,
"crimeN": 0,
"vCrimeN":0,
"rateN":0,
"rateR":0
};

function updateGeoid(geoid, left, right){
	var test = document.getElementById("test");
	var t = "left = " + left;
	addstring(test, t);
	newline(test);
	t = "right = " + right;
	addstring(test, t);
	newline(test);
}