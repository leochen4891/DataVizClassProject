var busi = new Array();
busi[0] = new Object;
busi[0].name = "PandaExpress";
busi[0].stars = new Array();
busi[0].stars[0] = 5;
busi[0].stars[1] = 8;
busi[0].stars[2] = 9;
busi[0].stars[3] = 15;
busi[0].stars[4] = 8;
busi[0].id

busi[1] = new Object;
busi[1].name = "Jack in the box";
busi[1].stars = new Array();
busi[1].stars[0] = 8;
busi[1].stars[1] = 9;
busi[1].stars[2] = 14;
busi[1].stars[3] = 5;
busi[1].stars[4] = 1;

busi[2] = new Object;
busi[2].name = "KFC at mill";
busi[2].stars = new Array();
busi[2].stars[0] = 2;
busi[2].stars[1] = 1;
busi[2].stars[2] = 4;
busi[2].stars[3] = 5;
busi[2].stars[4] = 1;

busi[3] = new Object;
busi[3].name = "CVS at apache";
busi[3].stars = new Array();
busi[3].stars[0] = 2;
busi[3].stars[1] = 1;
busi[3].stars[2] = 4;
busi[3].stars[3] = 5;
busi[3].stars[4] = 1;

drawMosaic("canvasMosaic", busi);

function drawMosaic(canvasName, busiList) {
	var c = document.getElementById(canvasName);
	var ctx = c.getContext("2d");

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
	var entryHeight = HEIGHT / count;
	var fontHeight = Math.min(FONT_HEIGHT_MAX, entryHeight * 0.8)

	for (var r = 0; r < count; r++) {
		var posX = 0;
		var posY = r * entryHeight;

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
			ctx.fillRect(posX + offsetX, posY, width, entryHeight - 1);
			ctx.fill();
			leftSide += busiList[r].stars[c];
		}

		ctx.fillStyle = "black";
		ctx.font = fontHeight + "px Arial";
		ctx.fillText(busiList[r].name, 10, (r + 0.5) * entryHeight + fontHeight
				/ 2);
		ctx.stroke();
		ctx.fill();
	}
}
