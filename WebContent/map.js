getGrade(1, 24);
setMapGrades();
var map = L.map('map').setView([33.60, -112.10], 10.1);

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
	var n = 10;
	this._div.innerHTML = '<h4>Phoenix Population</h4>' + (props ?
			'<b>' + 'Census Tract# ' + props.NAME + '</b><br /><b>Population: </b>' + props.Population + ' people' +
			'<br /><b>Income: </b> $' + props.Income
			 : 'Hover over a census tract');
};

info.addTo(map);

// get color depending on population density value

function getColor(d, grades) {
	return d > grades[6] ? '#BD0026' :
	d > grades[5] ? '#E31A1C' :
	d > grades[4] ? '#FC4E2A' :
	d > grades[3] ? '#FD8D3C' :
	d > grades[2] ? '#FEB24C' :
	d > grades[1] ? '#FED976' :
	'#FFEDA0';
}
function getRedColor(d, grades) {
	return d > grades[6] ? '#BD0026' :
	d > grades[5] ? '#E31A1C' :
	d > grades[4] ? '#FC4E2A' :
	d > grades[3] ? '#FD8D3C' :
	d > grades[2] ? '#FEB24C' :
	d > grades[1] ? '#FED976' :
	'#FFEDA0';
}

function getGreenColor(d, grades) {
	return d > grades[6] ? '#103800' :
	d > grades[5] ? '#195400' :
	d > grades[4] ? '#267F00' :
	d > grades[3] ? '#32A800' :
	d > grades[2] ? '#3FD300' :
	d > grades[1] ? '#4CFF00' :
	'#ABFF87';
}

function getBlueColor(d, grades) {
	return d > grades[6] ? '#001556' :
	d > grades[5] ? '#0028A0' :
	d > grades[4] ? '#003FFF' :
	d > grades[3] ? '#265CFF' :
	d > grades[2] ? '#4772FF' :
	d > grades[1] ? '#688BFF' :
	'#A3B8FF';
}

function getYellowColor(d, grades) {
	return d > grades[6] ? '#FF4200' :
	d > grades[5] ? '#FF6900' :
	d > grades[4] ? '#FF8C00' :
	d > grades[3] ? '#FFB200' :
	d > grades[2] ? '#FFDD00' :
	d > grades[1] ? '#FFFF00' :
	'#F4FF7C';
}
function style(feature) {
	return {
		weight : 2,
		opacity : 1,
		color : 'white',
		dashArray : '3',
		fillOpacity : 0.7,
		fillColor : getBlueColor(feature.properties.Population, Status.pop.eint)
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
	.setContent("The Geo.ID for this census tract is " + geoid )
	.openOn(map);
	
	$(function(){
		var left = $("#slider").slider("values", 0);
		var right = $("#slider").slider("values", 1);
		updateGeoid(geoid, left, right);
		updateChart(geoid, TIMELS, left, right);
	});
}
function onEachFeature(feature, layer) {
	layer.on({
		mouseover : highlightFeature,
		mouseout : resetHighlight,
		click : onTileClick
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
	grades = Status.pop.eint,
	labels = [],
	from,
	to;

	for (var i = 0; i < grades.length - 1; i++) {
		from = grades[i];
		to = grades[i + 1];

		labels.push(
			'<i style="background:' + getBlueColor(from + 1, Status.pop.eint) + '"></i> ' +
			Math.round(from) + (to ? '&ndash;' + Math.round(to) : '+'));
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
					Math.round(from) + (to ? '&ndash;' + Math.round(to) : '+'));
			} else if (flag == 'blue') {
				labels.push(
					'<i style="background:' + getBlueColor(from + 1, pgrades) + '"></i> ' +
					Math.round(from) + (to ? '&ndash;' + Math.round(to) : '+'));
			} else if (flag == 'yellow') {
				labels.push(
					'<i style="background:' + getYellowColor(from + 1, pgrades) + '"></i> ' +
					Math.round(from) + (to ? '&ndash;' + Math.round(to) : '+'));
			} else if (flag == 'red') {
				labels.push(
					'<i style="background:' + getRedColor(from + 1, pgrades) + '"></i> ' +
					Math.round(from) + (to ? '&ndash;' + Math.round(to) : '+'));
			} else {
				labels.push(
					'<i style="background:' + getColor(from + 1, pgrades) + '"></i> ' +
					Math.round(from) + (to ? '&ndash;' + Math.round(to) : '+'));
			}
		}

		div.innerHTML = labels.join('<br>');
		return div;
	};

	legend.addTo(map);
}