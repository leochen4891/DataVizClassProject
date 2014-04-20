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

function getDisplayList(list, flag){
	var step = Math.floor(list.length/20);
	var newLS = [];
	
	/*var dayM = 86400000;
	var initDay = new Date(2012, 0, 1);
	var geo = Number(geoid);
	var preDay = new Date(list[0].x);
	preDay.setDate(preDay.getDate() - step + 1);
	var firstDay = TIMELS[0].DATE;
	var beginDay;
	if (preDay < firstDay){
		beginDay = firstDay;
	}
	else{
		beginDay = preDay;
	}
	var sum = 0;
	var coun = 0;
	for(var d = new Date(list[0].x); d >= beginDay; d.setDate(d.getDate()-1)){
		var i = (d.getTime() - initDay.getTime()) / dayM;
		var t = flag + '_' + geo;
		sum += list[i][t];
		coun++;
	}
	var test = document.getElementById("test");
	addstring(test, "sum is " + sum);
	newline(test);
	addstring(test, "t is " + coun);
	newline(test);
	newLS.push({
		"x" : list[0].x,
		"y" : sum/t,
	}); */
	newLS.push(list[0]);
	for(var i = step-1; i < list.length; i += step){
		var sum = 0;
		for(var j = i; j >= i-step+1; j--){
			sum += list[j].y;
		}
		newLS.push({"x" : list[i].x, 
					"y" : sum/step,
			});
	}
	return newLS;
}


var TIMELS = convertList(timeData);

/*var test = document.getElementById("test");
for (var i = 0; i < newLS1.length; i++) {
addstring(test, "len = " + newLS1.length);
newline(test);
}*/
var palette = new Rickshaw.Color.Palette();

var graph = new Rickshaw.Graph({
		element : document.querySelector("#chart"),
		width : 500,
		height : 162,
		renderer : 'line',
		series : [{
				name : "Crime",
				data : [],
				color : palette.color(),
			}, {
				name : "Review",
				data : [],
				color : palette.color(),
			},
		]
	});

var x_axis = new Rickshaw.Graph.Axis.X({
		graph : graph,
		orientation: 'bottom',
		element: document.getElementById('x_axis'),
		tickFormat: function(d) {
						var t = new Date(d);
						return d3.time.format("%b")(t);
					},
	});

var y_axis = new Rickshaw.Graph.Axis.Y.Scaled({
		graph : graph,
		orientation : 'left',
		tickFormat : function (d) {
			return d / 200;
		},
		scale : d3.scale.linear().range([0, 162]),
		element : document.getElementById('y_axis'),

	});
var y_axis1 = new Rickshaw.Graph.Axis.Y.Scaled({
		graph : graph,
		orientation : 'right',
		tickFormat : function (d) {
			return d / 200;
		},
		scale : d3.scale.linear().range([0, 162]),
		element : document.getElementById('y_axis1'),

	});

/*var timeLegend = new Rickshaw.Graph.Legend({
		element : document.querySelector('#timeLegend'),
		graph : graph
	}); */
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

updateChart(geoid, TIMELS, 1, 24);
function updateChart(geoid, TIMELS, left, right) {
	var crimeLS = getTimeList(geoid, TIMELS, 'C', left, right);
	var rateLS = getTimeList(geoid, TIMELS, 'R', left, right);
	crimeLS = getDisplayList(crimeLS, 'C');
	rateLS = getDisplayList(rateLS, 'R');
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
	var start = d3.min(crimeLS, function(d){
		return d.x;
		});
	var end = d3.max(crimeLS, function(d){
		return d.x;
	});
	start = new Date(start);
	end = new Date(end);
	var startStr = d3.time.format("%b/%y")(start);
	var endStr = d3.time.format("%b/%y")(end);
	$(function(){
		$("#startTime").html(startStr);
		$("#endTime").html(endStr);
	});
	
	
}