var busiList = new Array();
var totalStars = 0;
var busiStars = new Array();
var busiHeights = new Array();

// from geoid to get top 5 most reviewed business id
function updateBusiList(start, end) {
	// console.log("------------------- update top 5 busi list
	// ----------------------");
	var gid = Number(geoid);
	for (var i = 0; i < 5; i++) {
		busiList[i] = new Object;
		busiList[i].id = "";
		busiList[i].name = "";
		busiList[i].stars = new Array();
		busiList[i].stars[0] = 0;
		busiList[i].stars[1] = 0;
		busiList[i].stars[2] = 0;
		busiList[i].stars[3] = 0;
		busiList[i].stars[4] = 0;
	}

	if (null != top5busiList[gid]) {
		for (var i = 0; i < 5; i++) {
			try {
				var curid = top5busiList[gid][i];
				busiList[i].id = curid;
				// console.log("id " + i + ":" + busiid);
				busiList[i].name = busiStarsList[curid][0];
				// console.log("name " + i + ":" + busiList[i].name);
				busiList[i].stars = new Array();
				var start;
				var end;
				$(function() {
					start = $('#slider').slider("values", 0);
					end = $('#slider').slider("values", 1);
				});
				var stars = getStars(curid, start, end);
				busiList[i].stars = stars;
			} catch (err) {
				// console.log("i = " + i);
			}
		}
	}
}

function getStars(curid, start, end) {
	var STARS_OFFSET = 1;
	var starsCount = [ 0, 0, 0, 0, 0 ];

	for (var mon = start; mon <= end; mon++) {
		var str = busiStarsList[curid][STARS_OFFSET + mon];
		var temp = str.split("_");
		for (var i = 0; i < temp.length; i++) {
			starsCount[i] = starsCount[i] + Number(temp[i]);
		}
	}
	return starsCount;
}

//

document.getElementById("canvasMosaic").addEventListener('mousedown', mouseDownHandler, false);
document.getElementById("canvasMosaic").addEventListener('mousemove', mouseMoveHandler, false);

function mouseMoveHandler(event) {
	var canvas = document.getElementById("canvasMosaic");
	var mousePos = getMousePos(canvas, event);

	var offset = 0;
	var i = 0;
	for (i = 0; i < busiList.length; i++) {
		offset += busiHeights[i];
		// alert("i = " + i + ", mouse.Y = " + mousePos.y + ", offset = " +
		// offset);
		if (mousePos.y <= offset) {
			break;
		}
	}
	var context = canvas.getContext('2d');
	context.clearRect(0, 0, canvas.width, canvas.height);
	drawMosaic();

	if (busiHeights[i] < 30) {

		context.fillStyle = 'white';
		context.fillRect(mousePos.x + 5, mousePos.y - 30, canvas.width - mousePos.x , 25);

		context.font = '20pt Calibri';
		context.fillStyle = 'black';
		context.fillText(busiList[i].name, mousePos.x + 10, mousePos.y - 7);
	} else {
		
	}
};

function mouseDownHandler(event) {
	var canvas = document.getElementById("canvasMosaic");
	var mousePos = getMousePos(canvas, event);

	var offset = 0;
	var i = 0;
	for (i = 0; i < busiList.length; i++) {
		offset += busiHeights[i];
		// alert("i = " + i + ", mouse.Y = " + mousePos.y + ", offset = " +
		// offset);
		if (mousePos.y <= offset) {
			break;
		}
	}

	mosaicIndex = i;
	// alert(mosaicIndex);
	// mosaicIndex = (Math.floor((mousePos.y / mosaicEntryHeight)));
	busiid = busiList[mosaicIndex].id;
	
	$(function(){
		var start = $('#slider').slider("values", 0);
		var end = $('#slider').slider("values", 1);
		drawMosaic(start, end);
		drawTagCloud(start, end);
	});

};

function getMousePos(canvas, evt) {
	var rect = canvas.getBoundingClientRect();
	return {
		x : evt.clientX - rect.left,
		y : evt.clientY - rect.top
	};
}

function drawMosaic() {
	//console.log("draw mosaic, geoid = " + geoid);
	var canvas = document.getElementById("canvasMosaic");
	var ctx = canvas.getContext("2d");
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	var STAR_COL = new Array();
	STAR_COL[0] = "#F0F0FF";
	STAR_COL[1] = "#C8C8FF";
	STAR_COL[2] = "#8C8CFF";
	STAR_COL[3] = "#4646FF";
	STAR_COL[4] = "#00009F";

	var WIDTH = 400;
	var HEIGHT = 240;
	var COUNT_MAX = 5;
	var FONT_HEIGHT_MAX = 32;

	var count = Math.min(COUNT_MAX, busiList.length);

	totalStars = 0;
	busiStars = new Array();
	busiHeights = new Array();

	for (var i = 0; i < count; i++) {
		busiStars[i] = 0;
		for (var j = 0; j < 5; j++) {
			busiStars[i] += busiList[i].stars[j];
			totalStars += busiList[i].stars[j];
		}
	}

	for (var i = 0; i < count; i++) {
		busiHeights[i] = HEIGHT * (busiStars[i] / totalStars);
	}

	//console.log("---------- total = " + totalStars + " -------------------");
	//for (var i = 0; i < count; i++) {
	//	console.log("id = " + busiList[i].name + ", stars = " + busiStars[i] + ", height = " + busiHeights[i]);
	//}

	var offset = 0;

	for (var r = 0; r < count; r++) {
		var posX = 0;
		var posY = offset;
		offset += busiHeights[r];

		if (r == 1)
			ctx.fillStyle = "red";

		var total = 0;
		for (var c = 0; c < 5; c++) {
			total += busiList[r].stars[c];
		}

		var leftSide = 0;
		for (var c = 0; c < 5; c++) {
			ctx.fillStyle = STAR_COL[c];
			var offsetX = WIDTH * (leftSide / total);
			var width = WIDTH * busiList[r].stars[c] / total;
			// alert((posX + offsetX) + ", " + posY + ", " + width + ", " +
			// (mosaicEntryHeight - 1));
			ctx.fillRect(posX + offsetX, posY, width, busiHeights[r] - 1);
			ctx.fill();
			leftSide += busiList[r].stars[c];
		}

		if (r == mosaicIndex) {
			ctx.fillStyle = "red";
			var fontHeight = Math.min(FONT_HEIGHT_MAX, Math.floor(busiHeights[r] * 0.5));
			ctx.font = 1.2 * fontHeight + "px Arial";
			var textOffset = posY + busiHeights[r] * 0.5 + fontHeight * 0.5;
			ctx.fillText(busiList[r].name, 10, textOffset);
		} else {
			ctx.fillStyle = "black";
			var fontHeight = Math.min(FONT_HEIGHT_MAX, Math.floor(busiHeights[r] * 0.5));
			ctx.font = fontHeight + "px Arial";
			var textOffset = posY + busiHeights[r] * 0.5 + fontHeight * 0.5;
			ctx.fillText(busiList[r].name, 10, textOffset);
		}

		ctx.fill();
	}
}
