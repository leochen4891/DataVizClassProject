// the data of a selected geoid
/*var selectedGEOIDs = new Array();
 selectedGEOIDs[0] = new Object;
 selectedGEOIDs[0].POP = 6000;
 selectedGEOIDs[0].INC = 5000;
 selectedGEOIDs[0].CRM = 4000;
 selectedGEOIDs[0].VCR = 7000
 selectedGEOIDs[0].REV = 2000;
 selectedGEOIDs[0].STR = 3.2;
 selectedGEOIDs[0].COL = "#FF0000";

 selectedGEOIDs[1] = new Object;
 selectedGEOIDs[1].POP = 4000;
 selectedGEOIDs[1].INC = 5000;
 selectedGEOIDs[1].CRM = 2400;
 selectedGEOIDs[1].VCR = 5000
 selectedGEOIDs[1].REV = 3000;
 selectedGEOIDs[1].STR = 4.2;
 selectedGEOIDs[1].COL = "#00FF00";

 selectedGEOIDs[2] = new Object;
 selectedGEOIDs[2].POP = 2000;
 selectedGEOIDs[2].INC = 7600;
 selectedGEOIDs[2].CRM = 1400;
 selectedGEOIDs[2].VCR = 3000
 selectedGEOIDs[2].REV = 8000;
 selectedGEOIDs[2].STR = 2.9;
 selectedGEOIDs[2].COL = "#0000FF";
 */

updateParaLines();

//alert("mark0");
drawParallel("canvasParallel");
//alert("mark1");

function drawParallel(canvasName) {
    // prepare the 3 lines, avg, med, and target

	var c = document.getElementById(canvasName);
	var ctx = c.getContext("2d");
    ctx.clearRect(0, 0, c.width, c.height);
   // ctx.translate(0.5, 0.5); // to fix the blurry text issue

	var WIDTH = 400;
	var HEIGHT = 240;

	var MARGIN_LEFT = 30;
	var MARGIN_TOP = 15;
	var MARGIN_RIGHT = 50;
	var MARGIN_BOTTOM = 15;
	var TEXT_HEIGHT = 18;
	var FONT_HEIGHT = TEXT_HEIGHT * 0.8;

	// draw bottom hor line
	ctx.beginPath();
	ctx.moveTo(MARGIN_LEFT, HEIGHT - MARGIN_BOTTOM - TEXT_HEIGHT);
	ctx.lineTo(WIDTH - MARGIN_RIGHT, HEIGHT - MARGIN_BOTTOM - TEXT_HEIGHT);
	ctx.lineWidth = 1;
	ctx.strokeStyle = 'black';
	ctx.stroke();

	// draw each axis
	var keys = Object.keys(Status);
	//alert(keys);
	for (var i = 0; i < keys.length; i++) {
		var entryCount = keys.length;
		var entryWidth = (WIDTH - MARGIN_LEFT - MARGIN_RIGHT)
				/ (entryCount - 1);
		var posX = MARGIN_LEFT + entryWidth * i;
		var posY = HEIGHT - MARGIN_BOTTOM - TEXT_HEIGHT;

		// title
		ctx.font = FONT_HEIGHT + "px Arial";
		ctx.fillText(keys[i], posX - FONT_HEIGHT, HEIGHT - MARGIN_BOTTOM);
		ctx.stroke();
		ctx.fill();

		// vertical line
		ctx.beginPath();
		ctx.moveTo(posX, posY);
		ctx.lineTo(posX, MARGIN_TOP);
		ctx.stroke();

		// scale bar and numbers on vertical line
		var intervals = Status[keys[i]].eint;
		//alert(intervals);
		var entryHeight = (HEIGHT - MARGIN_TOP - MARGIN_BOTTOM - TEXT_HEIGHT) / (intervals.length - 1);
		var barWidth = 5;
		for (var j = 0; j < intervals.length; j++) {

			ctx.beginPath();
			ctx.moveTo(posX, posY - entryHeight * j);
			ctx.lineTo(posX + barWidth, posY - entryHeight * j);
			ctx.stroke();
		}
		// scale number
		ctx.font = FONT_HEIGHT * 0.8 + "px Arial";
		ctx.fillText(intervals[0], posX + barWidth + 2, posY - FONT_HEIGHT
				* 0.2);
		ctx.stroke();
		ctx.fill();
		// scale number
		ctx.font = FONT_HEIGHT * 0.8 + "px Arial";
		ctx.fillText(intervals[intervals.length - 1], posX + barWidth + 2, posY
				- FONT_HEIGHT * 0.2 - entryHeight * (intervals.length - 1));
		ctx.stroke();
		ctx.fill();
	}

	// draw data lines
	for (var i = paraLines.length-1; i >= 0; i--) {
	    var keys = Object.keys(paraLines[i]);
        //alert(paraLines[i]);
	    ctx.strokeStyle = paraLines[i].COL;
	    ctx.beginPath();
	    for (var j = 0; j < keys.length - 1; j++) {
	    	//var intervals = Status[keys[j]].eint;
            var intervals = Status[Object.keys(Status)[j]].eint;
	    	var value = paraLines[i][keys[j+1]];
	    	var max = intervals[intervals.length - 1];
	    	var min = intervals[0];
	    	var temp = (value - min) / (max - min);
	    	var offset = (HEIGHT - MARGIN_TOP - MARGIN_BOTTOM - TEXT_HEIGHT)
	    			* (temp);
	    	var posX = MARGIN_LEFT + entryWidth * j;
	    	var posY = HEIGHT - MARGIN_BOTTOM - TEXT_HEIGHT - offset;

	    	/*if (j == 5) {
	    		alert(keys[j+1]);
	    	}*/
	    	if (j == 0) {
	    		ctx.moveTo(posX, posY);
	    	} else {
	    		ctx.lineTo(posX, posY);
	    }

	}
	ctx.stroke();

	}
}
