var count = GEOIDs.length;

var facesSize = new Array();
var facesLoc = new Array();
var facesIcon = new Array();
var facesMarker = new Array();

begin = 1;
end = 24;

var FACE_BASE_SIZE = 32;

//setChernoffVisible(true);

function setChernoffVisible(visible) {
	/*
	 * var opacity = 0.0; if (visible) opacity = 1.0; for (var i = 0; i <
	 * GEOIDs.length; i++) { var geoid = GEOIDs[i];
	 * facesMarker[geoid].setOpacity(opacity); }
	 */
	if (visible) {
		addChernoff();
	} else {
		for (var i = 0; i < GEOIDs.length; i++) {
			var geoid = GEOIDs[i];
			map.removeLayer(facesMarker[geoid]);

		}
	}

}

// do not use this function directly, use setChernoffVisible
function addChernoff() {
	for (var i = 0; i < count; i++) {
		var geoid = GEOIDs[i];

		var scale = getScale(geoid);
		var skin = getSkin(geoid);
		var eye = getEye(geoid, begin, end);
		var eyebrow = getEyebrow(geoid, begin, end);
		var smile = getSmile(geoid, begin, end);
		var mouth = getMouth(geoid, begin, end);

		var size = FACE_BASE_SIZE * scale;
		facesSize[geoid] = new L.Point(size, size);
		facesLoc[geoid] = L.latLng(getLat(geoid), getLng(geoid));
		facesIcon[geoid] = L.divIcon({
			iconSize : facesSize[geoid],
			className : 'my-div-icon',
			html : '<canvas id = "facesCanvas' + geoid + '" class = "canvasFace" width = "100%" height = "100%" >error</canvas>'
		});
		facesMarker[geoid] = L.marker(facesLoc[geoid], {
			icon : facesIcon[geoid]
		});
		map.addLayer(facesMarker[geoid]);
		// facesMarker[geoid].addTo(map);

		drawFace("facesCanvas" + geoid, skin, eye, eyebrow, smile, mouth);
	}
}

var sizeTable = new Array();
sizeTable[1] =  [0.10, 0.20, 0.30, 0.40, 0.50, 0.60, 0.70];
sizeTable[2] =  [0.10, 0.20, 0.30, 0.40, 0.50, 0.60, 0.70];
sizeTable[3] =  [0.10, 0.20, 0.30, 0.40, 0.50, 0.60, 0.70];
sizeTable[4] =  [0.10, 0.20, 0.30, 0.40, 0.50, 0.60, 0.70];
sizeTable[5] =  [0.10, 0.20, 0.30, 0.40, 0.50, 0.60, 0.70];
sizeTable[6] =  [0.10, 0.20, 0.30, 0.40, 0.50, 0.60, 0.70];
sizeTable[7] =  [0.10, 0.20, 0.30, 0.40, 0.50, 0.60, 0.70];
sizeTable[8] =  [0.10, 0.20, 0.30, 0.40, 0.50, 0.60, 0.70];
sizeTable[9] =  [0.10, 0.20, 0.30, 0.40, 0.50, 0.60, 0.70];
sizeTable[10] = [0.15, 0.30, 0.45, 0.60, 0.75, 0.90, 1.05];
sizeTable[11] = [0.20, 0.40, 0.60, 0.80, 1.00, 1.20, 1.40];
sizeTable[12] = [0.30, 0.60, 0.90, 1.20, 1.50, 1.80, 2.10];
sizeTable[13] = [0.45, 0.90, 1.35, 1.80, 2.25, 2.70, 3.15];
sizeTable[14] = [0.60, 1.20, 1.80, 2.40, 3.00, 3.60, 4.20];
sizeTable[15] = [0.80, 1.60, 2.40, 3.20, 4.00, 4.80, 5.60];
sizeTable[16] = [0.80, 1.60, 2.40, 3.20, 4.00, 4.80, 5.60];
sizeTable[17] = [0.80, 1.60, 2.40, 3.20, 4.00, 4.80, 5.60];
sizeTable[18] = [0.80, 1.60, 2.40, 3.20, 4.00, 4.80, 5.60];



function getSizeByPopZoom(pop, zoom) {
	return sizeTable[zoom][pop];
}

function getScale(geoid) {
	var population = getPop(geoid);
	var pop = value2grade(population, Status.POP.eint);
	var zoom = Math.floor(map.getZoom());
	var size = getSizeByPopZoom(pop, zoom);
	console.log("pop = " + pop + ", zoom = " + zoom + ", size = " + size);
	return size;
}
// skin is the income, 1 to 10, 10 is the highest
function getSkin(geoid) {
	var currentIncome = getIncome(geoid);
	var currentGrades = [];
	$(function(){
		if ( $('#schemeM').val() == 'equalInterval'){
			currentGrades = Status.INC.eint;
		}
		else{
			currentGrades = Status.INC.qint;
		}
	});
	return getGradeIndex(currentIncome, currentGrades);
}

// eye is the crime
function getEye(geoid, begin, end) {
	var nSum = getCrime(geoid, begin, end);
	var currentGrades = [];
	$(function(){
		if ( $('#schemeM').val() == 'equalInterval'){
			currentGrades = Status.CRM.eint;
		}
		else{
			currentGrades = Status.CRM.qint;
		}
	});
	return getGradeIndex(nSum , currentGrades);
}

// eyebrow is the vio-crime
function getEyebrow(geoid, begin, end) {
	var currentVCrime = getVioCrime(geoid, begin, end);
	var currentGrades = [];
	$(function(){
		if ( $('#schemeM').val() == 'equalInterval'){
			currentGrades = Status.VCR.eint;
		}
		else{
			currentGrades = Status.VCR.qint;
		}
	});
	return getGradeIndex(currentVCrime, currentGrades);
}

// smile is the avg-rating
function getSmile(geoid, begin, end) {
	var nSum = getReview(geoid, begin, end);
	var rSum = getStar(geoid, begin, end);
	var ave = rSum / nSum;
	
	var currentGrades = [];
	$(function(){
		if ( $('#schemeM').val() == 'equalInterval'){
			currentGrades = Status.RAT.eint;
		}
		else{
			currentGrades = Status.RAT.qint;
		}
	});
	return getGradeIndex(ave, currentGrades);
}

// mouth is the review
function getMouth(geoid, begin, end) {
	var sum = getReview(geoid, begin, end);
	//var rList = GEOIDTable[geoid].slice(28, GEOIDTable[geoid].length);
	
	var currentGrades = [];
	$(function(){
		if ( $('#schemeM').val() == 'equalInterval'){
			currentGrades = Status.REV.eint;
		}
		else{
			currentGrades = Status.REV.qint;
		}
	});
	return getGradeIndex(sum, currentGrades);
}

function getGradeIndex(item, grades){
	var index = 1;
	for(var i = 1; i < grades.length; i++){
		if(item <= grades[i]){
			index = i;
			break;
		}
	}
	return index; 
}
// Input:
// - canvasName: elementId in the html file
// - posX and posY: center position of the face
// - scale: float, 1 = original size(100 * 100)
// - skin: 1 - 7, gold color of the skin
// - eye: 1 - 7, size of the eyes
// - eyebrow: 1 - 7, angle of the eyebrows
// - smile: 1 - 7, smile curve
// - mouth: 1 - 7, openess of the mouth
function drawFace(canvasName, skin, eye, eyebrow, smile, mouth) {
	var posX = 50;
	var posY = 50;
	var scale = 1.0;
	var canvas = document.getElementById(canvasName);
	var ctx = canvas.getContext("2d");
	var RADIUS = 40;
	var LINE_WIDTH = RADIUS * 0.06;

	var SKIN_MAX = 7;
	var SKIN_STEP = 0xFF / (SKIN_MAX - 1);

	var EYE_OFFSET_X = RADIUS * 0.5;
	var EYE_OFFSET_Y = RADIUS * 0.2;
	var EYE_RADIUS = RADIUS * 0.1;
	var EYE_MAX = 7;

	var EYEBROW_OFFSET_X = RADIUS * 0.2;
	var EYEBROW_OFFSET_Y = RADIUS * 0.5;
	var EYEBROW_LENGTH = RADIUS * 0.9;
	var EYEBROW_MAX = 7;
	var EYEBROW_STEP = (Math.PI / 180) * 90 / (EYEBROW_MAX - 1);

	var MOUTH_OFFSET_Y = RADIUS * 0.25;
	var MOUTH_WIDTH = RADIUS * 0.5;

	var SMILE_MAX = 7;
	var MOUTH_MAX = 7;

	posY = posY + RADIUS * 0.2;

	var skinColor = 0xFF - Math.floor((skin - 1) * SKIN_STEP);
	var skinColorStr = skinColor <= 0xF ? "0" + skinColor : skinColor.toString(16);
	skinColorStr = "#FFFF" + skinColorStr.toUpperCase();

	var leye = new Object();
	leye.x = posX - EYE_OFFSET_X * scale;
	leye.y = posY - EYE_OFFSET_Y * scale;
	leye.r = EYE_RADIUS * scale * (2.5 * eye / EYE_MAX);

	var reye = new Object();
	reye.x = posX + EYE_OFFSET_X * scale;
	reye.y = posY - EYE_OFFSET_Y * scale;
	reye.r = EYE_RADIUS * scale * (2.5 * eye / EYE_MAX);

	var dx = EYEBROW_LENGTH * Math.cos((eyebrow - 1) * EYEBROW_STEP) * scale;
	var dy = EYEBROW_LENGTH * Math.sin((eyebrow - 1) * EYEBROW_STEP) * scale;

	var leyebrow = new Object();
	leyebrow.x = posX - (EYEBROW_OFFSET_X) * scale;
	leyebrow.y = posY - (EYEBROW_OFFSET_Y) * scale;
	leyebrow.x1 = leyebrow.x - dx;
	leyebrow.y1 = leyebrow.y - dy;

	var reyebrow = new Object();
	reyebrow.x = posX + (EYEBROW_OFFSET_X) * scale;
	reyebrow.y = posY - (EYEBROW_OFFSET_Y) * scale;
	reyebrow.x1 = reyebrow.x + dx;
	reyebrow.y1 = reyebrow.y - dy;

	var smileScale = 1.5 * (smile / SMILE_MAX - 0.5);
	var mouthScale = 0.4 * (1 + mouth) / MOUTH_MAX;

	// Draw the face
	ctx.fillStyle = skinColorStr;
	ctx.beginPath();
	ctx.arc(posX, posY, RADIUS * scale, 0, 2 * Math.PI);
	ctx.closePath();
	ctx.fill();
	ctx.lineWidth = LINE_WIDTH * scale;
	ctx.stroke();
	ctx.fillStyle = "black";

	// Draw the left eye
	ctx.beginPath();
	ctx.arc(leye.x, leye.y, leye.r, 0, 2 * Math.PI);
	ctx.closePath();
	ctx.fill();
	ctx.stroke();

	// Draw the right eye
	ctx.beginPath();
	ctx.arc(reye.x, reye.y, reye.r, 0, 2 * Math.PI);
	ctx.closePath();
	ctx.fill();
	ctx.stroke();

	// Draw the left eyebrow
	ctx.moveTo(leyebrow.x, leyebrow.y);
	ctx.lineTo(leyebrow.x1, leyebrow.y1);
	ctx.stroke();

	// Draw the right eyebrow
	ctx.moveTo(reyebrow.x, reyebrow.y);
	ctx.lineTo(reyebrow.x1, reyebrow.y1);
	ctx.stroke();

	// mouth up lip
	ctx.save();
	ctx.translate(posX, posY + MOUTH_OFFSET_Y * scale + (SMILE_MAX - smile) * 3 * scale);
	ctx.scale(1, smileScale - mouthScale);
	ctx.beginPath();
	ctx.arc(0, 0, MOUTH_WIDTH * scale, 0, Math.PI, false);
	ctx.restore();
	ctx.strokeStyle = 'black';
	ctx.stroke();

	// mouth bottom lip
	ctx.save();
	ctx.translate(posX, posY + MOUTH_OFFSET_Y * scale + (SMILE_MAX - smile) * 3 * scale);
	ctx.scale(1, smileScale + mouthScale);
	ctx.beginPath();
	ctx.arc(0, 0, MOUTH_WIDTH * scale, 0, Math.PI, false);
	ctx.restore();
	ctx.strokeStyle = 'black';
	ctx.stroke();
}
