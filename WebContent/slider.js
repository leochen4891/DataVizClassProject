/***** The Slider Event **********/
(function($){$(function () {
	$('#slider').slider({
		range : true,
		min : 1,
		max : 24,
		values : [1, 24],
		slide : function (event, ui) {
			
            // should always update Status
            var start = ui.values[0];
            var end = ui.values[1];
			updateChart(geoid, TIMELS, start, end);
			updateGrade(start, end);
			/* TEST */ 
			var test = document.getElementById("test");
			var testStr = "ave = " + Status.RAT.ave;
			addstring(test, testStr);
			newline(test);
			testStr = "med = " + Status.RAT.med;
			addstring(test, testStr);
			newline(test);
			 /* end */
			updateParaLines();
			drawParallel("canvasParallel");
			if ($('#dataM').val() == 'crime') {
				if (!$('#chk1').prop("checked")) {
					setMapGrades();
				}
				var monthTotal = 0;
				geojson.clearLayers();
				geojson = L.geoJson(tractData, {
						style : function (feature) {
							monthTotal = 0;
							if (start != end) {
								for (var i = start; i <= end; i++) {
									var crimeNum = feature.properties['C_M' + i];
									monthTotal += crimeNum;
								}
							} else {
								var crimeNum = feature.properties['C_M' + start];
								monthTotal = crimeNum;
							}
							if ($('#schemeM').val() == 'equalInterval') {
								return {
									weight : 2,
									opacity : 1,
									color : 'white',
									dashArray : '3',
									fillOpacity : 0.7,
									fillColor : getRedColor(monthTotal, mapGrades.crimeGrades.eint)
								};
							} else {
								return {
									weight : 2,
									opacity : 1,
									color : 'white',
									dashArray : '3',
									fillOpacity : 0.7,
									fillColor : getRedColor(monthTotal, mapGrades.crimeGrades.qint)
								};
							}
						},
						onEachFeature : onEachFeature
					}).addTo(map);
				if ($('#schemeM').val() == 'equalInterval') {
					updateLegend(mapGrades.crimeGrades.eint, 'red');
				} else {
					updateLegend(mapGrades.crimeGrades.qint, 'red');
				}
				info.update = function (props) {
					if (props) {
						monthTotal = 0;
						if (start != end) {
							for (var i = start; i <= end; i++) {
								var Num = props['C_M' + i];
								monthTotal += Num;
							}
						} else {
							var Num = props['C_M' + start];
							monthTotal = Num;
						}
					}
					var n = 10;
					this._div.innerHTML = '<h4>Crime Number over Month ' + start + ' to Month ' + end + '</h4>' + (props ?
							'<b>' + 'Census Tract# ' + props.NAME + '</b><br /><b>Number of Crimes: </b>' + monthTotal
							 : 'Hover over a census tract');
				};
			} else if ($('#dataM').val() == 'rateN') {
				if (!$('#chk1').prop("checked")) {
					setMapGrades();
				}
				var monthTotal = 0;
				geojson.clearLayers();
				geojson = L.geoJson(tractData, {
						style : function (feature) {
							monthTotal = 0;
							if (start != end) {
								for (var i = start; i <= end; i++) {
									var num = feature.properties['R_M' + i];
									monthTotal += num;
								}
							} else {
								var num = feature.properties['R_M' + start];
								monthTotal = num;
							}
							if ($('#schemeM').val() == 'equalInterval') {
								return {
									weight : 2,
									opacity : 1,
									color : 'white',
									dashArray : '3',
									fillOpacity : 0.7,
									fillColor : getYellowColor(monthTotal, mapGrades.rateGrades.eint)
								};
							} else {
								return {
									weight : 2,
									opacity : 1,
									color : 'white',
									dashArray : '3',
									fillOpacity : 0.7,
									fillColor : getYellowColor(monthTotal, mapGrades.rateGrades.qint)
								};
							}
						},
						onEachFeature : onEachFeature
					}).addTo(map);
				if ($('#schemeM').val() == 'equalInterval') {
					updateLegend(mapGrades.rateGrades.eint, 'yellow');
				} else {
					updateLegend(mapGrades.rateGrades.qint, 'yellow');
				}

				info.update = function (props) {
					if (props) {
						monthTotal = 0;
						if (start != end) {
							for (var i = start; i <= end; i++) {
								var Num = props['R_M' + i];
								monthTotal += Num;
							}
						} else {
							var Num = props['R_M' + start];
							monthTotal = Num;
						}
					}
					var n = 10;
					this._div.innerHTML = '<h4>Number of Ratings over Month ' + start + ' to Month ' + end + '</h4>' + (props ?
							'<b>' + 'Census Tract# ' + props.NAME + '</b><br /><b>Number of Ratings: </b>' + monthTotal
							 : 'Hover over a census tract');
				};
			}
		}
	});
});}(jQuery));