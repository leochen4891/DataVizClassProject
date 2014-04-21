getGrade(1, 24);
setMapGrades();
var map = L.map('map').setView([33.60, -112.10], 10.1);

map.on('zoomend', onZoomChange);

function onZoomChange(e){
		var box = document.getElementById('checkboxShowFaces');
		if (box.checked == true){
			setChernoffVisible(false);
			setChernoffVisible(true);
		}
}
/*var cloudmade = L.tileLayer('http://{s}.tile.cloudmade.com/{key}/{styleId}/256/{z}/{x}/{y}.png', {
attribution: 'Map data &copy; 2011 OpenStreetMap contributors, Imagery &copy; 2011 CloudMade',
key: 'BC9A493B41014CAABB98F0471D759707',
styleId: 22677
}).addTo(map);*/

// control that shows tract info on hover
var info = L.control();

info.onAdd = function (map) {
	this._div = L.DomUtil.create('div', 'info');
	this.update();
	return this._div;
};

info.update = function (props) {
	this._div.innerHTML = '<h4>Phoenix Population</h4>' + (props ?
			'<b>' + 'Census Tract# ' + props.NAME + '</b><br /><b>Population: </b>' + props.Population + ' people' +
			'<br /><b>Income: </b> $' + props.Income
			 : 'Hover over a census tract');
};

info.addTo(map);

// get color depending on population density value

function value2grade(value, intervals) {
	for (var i = 1; i < intervals.length; i++) {
		if (value <= intervals[i])
			return i-1;
	}
}

var orangePalette = ['#FFEDA0', '#FED976', '#FEB24C', '#FD8D3C', '#FC4E2A', '#E31A1C', '#BD0026'];
var redPalette    = ['#FFEDA0', '#FED976', '#FEB24C', '#FD8D3C', '#FC4E2A', '#E31A1C', '#BD0026'];
var greenPalette  = ['#ABFF87', '#4CFF00', '#3FD300', '#32A800', '#267F00', '#195400', '#103800'];
var bluePalette   = ['#A3B8FF', '#688BFF', '#4772FF', '#265CFF', '#003FFF', '#0028A0', '#001556'];
var yellowPalette = ['#F4FF7C', '#FFFF00', '#FFDD00', '#FFB200', '#FF8C00', '#FF6900', '#FF4200'];

function getOrangeColor(value, intervals) {
	return orangePalette[value2grade(value, intervals)];	
}
function getRedColor(value, intervals) {
	return redPalette[value2grade(value, intervals)];	
}

function getGreenColor(value, intervals) {
	return greenPalette[value2grade(value, intervals)];	
}

function getBlueColor(value, intervals) {
	return bluePalette[value2grade(value, intervals)];
}

function getYellowColor(value, intervals) {
	return bluePalette[value2grade(value, intervals)];
}
function style(feature) {
	return {
		weight : 2,
		opacity : 1,
		color : 'white',
		dashArray : '3',
		fillOpacity : 0.7,
		fillColor : getBlueColor(feature.properties.Population, Status.POP.eint)
	};
}

function highlightFeature(e) {
	var layer = e.target;

	layer.setStyle({
		weight : 5,
		color : '#666',
		dashArray : '',
		fillOpacity : 0.7
	});

	if (!L.Browser.ie && !L.Browser.opera) {
		layer.bringToFront();
	}

	info.update(layer.feature.properties);
}

var geojson;

function resetHighlight(e) {
	geojson.resetStyle(e.target);
	info.update();
}

function zoomToFeature(e) {
	map.fitBounds(e.target.getBounds());
}

function onTileClick(e) {
	geoid = e.target.feature.properties.GEOID;
	var popup = L.popup();
	popup
	.setLatLng(e.latlng)
	.setContent(geoid)
	.openOn(map);
	
	$(function(){
		var left = $("#slider").slider("values", 0);
		var right = $("#slider").slider("values", 1);
		updateGeoid(geoid, left, right);
		updateChart(geoid, TIMELS, left, right);
		updateParaLines(left, right);
		drawParallel("canvasParallel");
	});
	
	var layer = e.target;
	geojson.resetStyle(layer);
	layer.setStyle({
		weight : 5,
		color : '#666',
		dashArray : '',
		fillOpacity : 0.7
	});

	//update mosaic
	mosaicIndex = 0;

	updateBusiList();
	drawMosaic();
	drawTagCloud();
}


function onEachFeature(feature, layer) {
	layer.on({
		mouseover : highlightFeature,
		mouseout : resetHighlight,
		click : onTileClick,
	});
}

geojson = L.geoJson(tractData, {
		style : style,
		onEachFeature : onEachFeature
	}).addTo(map);

//map.attributionControl.addAttribution('data &copy; <a href="http://census.gov/">US Census Bureau</a>');

var legend = L.control({
		position : 'bottomright'
	});

legend.onAdd = function (map) {

	var div = L.DomUtil.create('div', 'info legend'),
	grades = Status.POP.eint,
	labels = [],
	from,
	to;

	for (var i = 0; i < grades.length - 1; i++) {
		from = grades[i];
		to = grades[i + 1];

		labels.push(
			'<i style="background:' + getBlueColor(from + 1, Status.POP.eint) + '"></i> ' +
			Math.round(from) + (to ? '&ndash;' + Math.round(to) : ''));
	}

	div.innerHTML = labels.join('<br>');
	return div;
};

legend.addTo(map);

function updateLegend(pgrades, flag) {
	if ((typeof legend != 'undefined'))
		legend.removeFrom(map);
	legend = L.control({
			position : 'bottomright'
		});
	legend.onAdd = function (map) {

		var div = L.DomUtil.create('div', 'info legend'),
		grades = pgrades,
		labels = [],
		from,
		to;

		for (var i = 0; i < grades.length - 1; i++) {
			from = grades[i];
			to = grades[i + 1];
			if (flag == 'green') {
				labels.push(
					'<i style="background:' + getGreenColor(from + 1, pgrades) + '"></i> ' +
					Math.round(from) + (to ? '&ndash;' + Math.round(to) : ''));
			} else if (flag == 'blue') {
				labels.push(
					'<i style="background:' + getBlueColor(from + 1, pgrades) + '"></i> ' +
					Math.round(from) + (to ? '&ndash;' + Math.round(to) : ''));
			} else if (flag == 'yellow') {
				labels.push(
					'<i style="background:' + getYellowColor(from + 1, pgrades) + '"></i> ' +
					Math.round(from) + (to ? '&ndash;' + Math.round(to) : ''));
			} else if (flag == 'red') {
				labels.push(
					'<i style="background:' + getRedColor(from + 1, pgrades) + '"></i> ' +
					Math.round(from) + (to ? '&ndash;' + Math.round(to) : ''));
			} else {
				labels.push(
					'<i style="background:' + getOrangeColor(from + 1, pgrades) + '"></i> ' +
					Math.round(from) + (to ? '&ndash;' + Math.round(to) : ''));
			}
		}

		div.innerHTML = labels.join('<br>');
		return div;
	};

	legend.addTo(map);
}
