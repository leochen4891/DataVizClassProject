function convertList(ls) {
	var newLS = [];
	for (var i = 0; i < ls.length; i++) {
		newRow = ls[i];
		newRow.DATE = new Date(ls[i].DATE);
		for (var prop in newRow) {
			if (newRow.hasOwnProperty(prop)) {
				if (typeof newRow[prop] == 'string') {
					newRow[prop] = Number(newRow[prop]);
				}
			}
		}
		newLS.push(newRow);
	}
	return newLS;
}

function getTimeList(geoid, LS, flag, left, right) {
	var newLS = [];
	var dayM = 86400000;
	var initDay = new Date(2012, 0, 1);

	if (left > 12) {
		var t = left - 13;
		left = new Date(2013, t, 1);
	} else {
		var t = left - 1;
		left = new Date(2012, t, 1);
	}

	if (right > 12) {
		var t = right - 12;
		if (t == 2) {
			right = new Date(2013, t - 1, 28);
		} else if (t == 4 || t == 6 || t == 9 || t == 11) {
			right = new Date(2013, t - 1, 30);
		} else {
			right = new Date(2013, t - 1, 31);
		}
	} else {
		var t = right;
		if (t == 2) {
			right = new Date(2012, t - 1, 29);
		} else if (t == 4 || t == 6 || t == 9 || t == 11) {
			right = new Date(2012, t - 1, 30);
		} else {
			right = new Date(2012, t - 1, 31);
		}
	}

	var geo = 0;
	if (typeof geoid == 'undefined') {
		geo = 4013103604;
	} else {
		geo = Number(geoid);
	}
	for (var d = new Date(left); d <= right; d.setDate(d.getDate() + 1)) {
		var i = (d.getTime() - initDay.getTime()) / dayM;
		var t = flag + '_' + geo;
		var item = {
			"x" : new Date(d).getTime(),
			"y" : LS[i][t]
		};
		newLS.push(item);
	}
	return newLS;
}

function getDisplayList(list){
	var step = Math.floor(list.length/20);
	var newLS = [];
	for(var i = step-1; i < list.length; i += step){
		var sum = 0;
		for(j = i; j >= i-step+1; j--){
			sum += list[j].y;
		}
		newLS.push({"x" : list[i].x, 
					"y" : sum/step,
			});
	}
	return newLS;
}


var TIMELS = convertList(timeData);
var newLS1 = getTimeList(4013103604, TIMELS, 'C', 1, 24);
var newLS2 = getTimeList(4013103604, TIMELS, 'R', 1, 24);
newLS1 = getDisplayList(newLS1);
newLS2 = getDisplayList(newLS2);
/*var test = document.getElementById("test");
for (var i = 0; i < newLS1.length; i++) {
addstring(test, "len = " + newLS1.length);
newline(test);
}*/
var palette = new Rickshaw.Color.Palette();

var d1 = newLS1; //[{x:0, y: 10}, {x: 1, y: 20}, {x: 2, y:30}, {x: 3, y : 90}];
var d2 = newLS2; //[{x:0, y:1},{x:1, y:2},{x:2, y:3}, {x:3, y: 5}];
var min1 = d3.min(d1, function (d) {
		return d.y;
	});
var max1 = d3.max(d1, function (d) {
		return d.y;
	});
var min2 = d3.min(d2, function (d) {
		return d.y;
	});
var max2 = d3.max(d2, function (d) {
		return d.y;
	});

var linearScale1 = d3.scale.linear().domain([min1, max1]).range([0, 162]);
var linearScale2 = d3.scale.linear().domain([min2, max2]).range([0, 162]);

var graph = new Rickshaw.Graph({
		element : document.querySelector("#chart"),
		width : 500,
		height : 162,
		renderer : 'line',
		series : [{
				name : "Crime",
				data : d1,
				color : palette.color(),
				scale : linearScale1,
			}, {
				name : "Review",
				data : d2,
				color : palette.color(),
				scale : linearScale2,
			},
		]
	});

var x_axis = new Rickshaw.Graph.Axis.X({
		graph : graph,
		orientation: 'bottom',
		element: document.getElementById('x_axis'),
		tickFormat: function(d) {
						var t = new Date(d);
						return d3.time.format("%m/%d/%y")(t);
					},
	});

var y_axis = new Rickshaw.Graph.Axis.Y.Scaled({
		graph : graph,
		orientation : 'left',
		scale : linearScale1,
		tickFormat : function (d) {
			return d / 200;
		},
		element : document.getElementById('y_axis'),

	});
var y_axis1 = new Rickshaw.Graph.Axis.Y.Scaled({
		graph : graph,
		orientation : 'right',
		scale : linearScale2,
		tickFormat : function (d) {
			return d / 200;
		},
		element : document.getElementById('y_axis1'),

	});

var timeLegend = new Rickshaw.Graph.Legend({
		element : document.querySelector('#timeLegend'),
		graph : graph
	});
/*
var offsetForm = document.getElementById('offset_form');

offsetForm.addEventListener('change', function (e) {
var offsetMode = e.target.value;

if (offsetMode == 'lines') {
graph.setRenderer('line');
graph.offset = 'zero';
} else {
graph.setRenderer('stack');
graph.offset = offsetMode;
}
graph.render();

}, false);
 */
graph.render();

updateChart(4013103604, TIMELS, 1, 24);
function updateChart(geoid, TIMELS, left, right) {
	var crimeLS = getTimeList(geoid, TIMELS, 'C', left, right);
	var rateLS = getTimeList(geoid, TIMELS, 'R', left, right);
	crimeLS = getDisplayList(crimeLS);
	rateLS = getDisplayList(rateLS);
	var cmin = d3.min(crimeLS, function (d) {
			return d.y;
		});
	var cmax = d3.max(crimeLS, function (d) {
			return d.y;
		});
	var rmin = d3.min(rateLS, function (d) {
			return d.y;
		});
	var rmax = d3.max(rateLS, function (d) {
			return d.y;
		});
	var cScale = d3.scale.linear().domain([cmin, cmax]).range([0, 162]);
	var rScale = d3.scale.linear().domain([rmin, rmax]).range([0, 162]);

	graph.series[0].data = crimeLS;
	graph.series[0].scale = cScale;
	y_axis.scale = cScale;
	graph.series[1].data = rateLS;
	graph.series[1].scale = rScale;
	y_axis1.scale = rScale;
	graph.render();
	y_axis.render();
	y_axis1.render();
}