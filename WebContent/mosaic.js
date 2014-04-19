var busiList = new Array();
busiList[0] = new Object;
busiList[0].id = "panda-express";
busiList[0].name = "PandaExpress";
busiList[0].stars = new Array();
busiList[0].stars[0] = 5;
busiList[0].stars[1] = 8;
busiList[0].stars[2] = 9;
busiList[0].stars[3] = 15;
busiList[0].stars[4] = 8;

busiList[1] = new Object;
busiList[1].id = "jack-in-the-box";
busiList[1].name = "Jack in the box";
busiList[1].stars = new Array();
busiList[1].stars[0] = 8;
busiList[1].stars[1] = 9;
busiList[1].stars[2] = 14;
busiList[1].stars[3] = 5;
busiList[1].stars[4] = 1;

busiList[2] = new Object;
busiList[2].id = "kfc-at-mill";
busiList[2].name = "KFC at mill";
busiList[2].stars = new Array();
busiList[2].stars[0] = 2;
busiList[2].stars[1] = 1;
busiList[2].stars[2] = 4;
busiList[2].stars[3] = 5;
busiList[2].stars[4] = 1;

busiList[3] = new Object;
busiList[3].id = "cvs-at-apache";
busiList[3].name = "CVS at apache";
busiList[3].stars = new Array();
busiList[3].stars[0] = 2;
busiList[3].stars[1] = 1;
busiList[3].stars[2] = 4;
busiList[3].stars[3] = 5;
busiList[3].stars[4] = 1;

//

var mosaicEntryHeight;
drawMosaic();

document.getElementById("canvasMosaic").addEventListener('mousedown',
		mouseDownHandler, false);

function mouseDownHandler(event) {
	var canvas = document.getElementById("canvasMosaic");
	var mousePos = getMousePos(canvas, event);
	mosaicIndex = (Math.floor((mousePos.y / mosaicEntryHeight)));
	busiid = busiList[mosaicIndex].id;
	drawMosaic();
};

function getMousePos(canvas, evt) {
	var rect = canvas.getBoundingClientRect();
	return {
		x : evt.clientX - rect.left,
		y : evt.clientY - rect.top
	};
}

function drawMosaic() {
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
	var FONT_HEIGHT_MAX = 22;

	var count = Math.min(COUNT_MAX, busiList.length);
	mosaicEntryHeight = HEIGHT / count;
	var fontHeight = Math.min(FONT_HEIGHT_MAX, mosaicEntryHeight * 0.8);

	for (var r = 0; r < count; r++) {
		var posX = 0;
		var posY = r * mosaicEntryHeight;

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
			//alert((posX + offsetX) + ", " + posY + ", " + width + ", " + (mosaicEntryHeight - 1));
			ctx.fillRect(posX + offsetX, posY, width, mosaicEntryHeight - 1);
			ctx.fill();
			leftSide += busiList[r].stars[c];
		}

		//alert("r = " + r + ", index = " + mosaicIndex);
		if (r == mosaicIndex) {
			ctx.fillStyle = "red";
			ctx.font = 1.2 * fontHeight + "px Arial";
			ctx.fillText(busiList[r].name, 15, (r + 0.5) * mosaicEntryHeight
					+ fontHeight / 2);
		} else {
			ctx.fillStyle = "black";
			ctx.font = fontHeight + "px Arial";
			ctx.fillText(busiList[r].name, 10, (r + 0.5) * mosaicEntryHeight
					+ fontHeight / 2);
		}
		
		
		ctx.fill();
	}
}
