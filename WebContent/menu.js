/****** Data Menu Event ******/
$('#dataM').change(function () {
	if ($(this).val() === 'pop') {
		geojson.clearLayers();
		geojson = L.geoJson(tractData, {
				style : function (feature) {
					if ($('#schemeM').val() == 'equalInterval') {
						return {
							weight : 2,
							opacity : 1,
							color : 'white',
							dashArray : '3',
							fillOpacity : 0.7,
							fillColor : getBlueColor(feature.properties.Population, Status.POP.eint)
						};
					} else {
						return {
							weight : 2,
							opacity : 1,
							color : 'white',
							dashArray : '3',
							fillOpacity : 0.7,
							fillColor : getBlueColor(feature.properties.Population, Status.POP.qint)
						};
					}
				},
				onEachFeature : onEachFeature
			}).addTo(map);
		if ($('#schemeM').val() == 'equalInterval') {
			updateLegend(Status.POP.eint, 'blue');
		} else {
			updateLegend(Status.POP.qint, 'blue');
		}
		info.update = function (props) {
			this._div.innerHTML = '<h4>Phoenix Population</h4>' + (props ?
					'<b>' + 'Census Tract# ' + props.NAME + '</b><br /><b>Population: </b>' + props.Population + ' people' +
					'<br /><b>Income: </b> $' + props.Income
					 : 'Hover over a census tract');
		};
	} else if ($(this).val() === 'income') {
		geojson.clearLayers();
		geojson = L.geoJson(tractData, {
				style : function (feature) {
					if ($('#schemeM').val() == 'equalInterval') {
						return {
							weight : 2,
							opacity : 1,
							color : 'white',
							dashArray : '3',
							fillOpacity : 0.7,
							fillColor : getGreenColor(feature.properties.Income, Status.INC.eint)
						};
					} else {
						return {
							weight : 2,
							opacity : 1,
							color : 'white',
							dashArray : '3',
							fillOpacity : 0.7,
							fillColor : getGreenColor(feature.properties.Income, Status.INC.qint)
						};
					}
				},
				onEachFeature : onEachFeature
			}).addTo(map);
		if ($('#schemeM').val() == 'equalInterval') {
			updateLegend(Status.INC.eint, 'green');
		} else {
			updateLegend(Status.INC.qint, 'green');
		}
		info.update = function (props) {
			this._div.innerHTML = '<h4>Phoenix Population</h4>' + (props ?
					'<b>' + 'Census Tract# ' + props.NAME + '</b><br /><b>Population: </b>' + props.Population + ' people' +
					'<br /><b>Income: </b> $' + props.Income
					 : 'Hover over a census tract');
		};
	} else if ($(this).val() === 'crime') {
		var left = $("#slider").slider("values", 0);
		var right = $("#slider").slider("values", 1);

		$("#amount").val("Month" + left + " - Month" + right);
		var monthTotal = 0;
		geojson.clearLayers();
		geojson = L.geoJson(tractData, {
				style : function (feature) {
					monthTotal = 0;
					if (left != right) {
						for (var i = left; i <= right; i++) {
							var crimeNum = feature.properties['C_M' + i];
							monthTotal += crimeNum;
						}
					} else {
						var crimeNum = feature.properties['C_M' + left];
						monthTotal = crimeNum;
					}
					if ($('#schemeM').val() == 'equalInterval') {
						return {
							weight : 2,
							opacity : 1,
							color : 'white',
							dashArray : '3',
							fillOpacity : 0.7,
							fillColor : getRedColor(monthTotal, Status.CRM.eint)
						};
					} else {
						return {
							weight : 2,
							opacity : 1,
							color : 'white',
							dashArray : '3',
							fillOpacity : 0.7,
							fillColor : getRedColor(monthTotal, Status.CRM.qint)
						};
					}
				},
				onEachFeature : function (feature, layer) {
					layer.on({
						mouseover : function (e) {
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
						},
						mouseout : resetHighlight,
						click : function (e) {
							onTileClick(e);
						}
					});
				}
			}).addTo(map);
		if ($('#schemeM').val() == 'equalInterval') {
			updateLegend(Status.CRM.eint, 'red');
		} else {
			updateLegend(Status.CRM.qint, 'red');
		}
		info.update = function (props) {
			var left = $("#slider").slider("values", 0);
			var right = $("#slider").slider("values", 1);
			if (props) {
				monthTotal = 0;
				if (left != right) {
					for (var i = left; i <= right; i++) {
						var Num = props['C_M' + i];
						monthTotal += Num;
					}
				} else {
					var Num = props['C_M' + left];
					monthTotal = Num;
				}
			}
			var n = 10;
			this._div.innerHTML = '<h4>Crime Number over Month ' + left + ' to Month ' + right + '</h4>' + (props ?
					'<b>' + 'Census Tract# ' + props.NAME + '</b><br /><b>Number of Crimes: </b>' + monthTotal
					 : 'Hover over a census tract');
		};

	} else if ($(this).val() === 'rateN') {
		var left = $("#slider").slider("values", 0);
		var right = $("#slider").slider("values", 1);
		var monthTotal = 0;
		geojson.clearLayers();
		geojson = L.geoJson(tractData, {
				style : function (feature) {
					monthTotal = 0;
					if (left != right) {
						for (var i = left; i <= right; i++) {
							var num = feature.properties['R_M' + i];
							monthTotal += num;
						}
					} else {
						var num = feature.properties['R_M' + left];
						monthTotal = num;

					}
					if ($('#schemeM').val() == 'equalInterval') {
						return {
							weight : 2,
							opacity : 1,
							color : 'white',
							dashArray : '3',
							fillOpacity : 0.7,
							fillColor : getYellowColor(monthTotal, Status.REV.eint)
						};
					} else {
						return {
							weight : 2,
							opacity : 1,
							color : 'white',
							dashArray : '3',
							fillOpacity : 0.7,
							fillColor : getYellowColor(monthTotal, Status.REV.qint)
						};
					}
				},
				onEachFeature : onEachFeature
			}).addTo(map);
		if ($('#schemeM').val() == 'equalInterval') {
			updateLegend(Status.REV.eint, 'yellow');
		} else {
			updateLegend(Status.REV.qint, 'yellow');
		}
		info.update = function (props) {
			var left = $("#slider").slider("values", 0);
			var right = $("#slider").slider("values", 1);
			if (props) {
				monthTotal = 0;
				if (left != right) {
					for (var i = left; i <= right; i++) {
						var Num = props['R_M' + i];
						monthTotal += Num;
					}
				} else {
					var Num = props['R_M' + left];
					monthTotal = Num;
				}
			}
			this._div.innerHTML = '<h4>Number of Reviews over Month ' + left + ' to Month ' + right + '</h4>' + (props ?
					'<b>' + 'Census Tract# ' + props.NAME + '</b><br /><b>Number of Reviews: </b>' + monthTotal
					 : 'Hover over a census tract');
		};
	}
});

/****** Color Menu Event **********/
$('#schemeM').change(function () {
	if( $('#checkboxShowFaces').prop("checked") ){
		setChernoffVisible(false);
		setChernoffVisible(true);
	}
	if ($(this).val() == 'equalInterval') {
		if ($('#dataM').val() === 'pop') {
			geojson.clearLayers();
			geojson = L.geoJson(tractData, {
					style : style,
					onEachFeature : onEachFeature
				}).addTo(map);
			updateLegend(Status.POP.eint, 'blue');
			info.update = function (props) {
				this._div.innerHTML = '<h4>Phoenix Population</h4>' + (props ?
						'<b>' + 'Census Tract# ' + props.NAME + '</b><br /><b>Population: </b>' + props.Population + ' people' +
						'<br /><b>Income: </b> $' + props.Income
						 : 'Hover over a census tract');
			};
		} else if ($('#dataM').val() === 'income') {
			geojson.clearLayers();
			geojson = L.geoJson(tractData, {
					style : function (feature) {
						return {
							weight : 2,
							opacity : 1,
							color : 'white',
							dashArray : '3',
							fillOpacity : 0.7,
							fillColor : getGreenColor(feature.properties.Income, Status.INC.eint)
						};
					},
					onEachFeature : onEachFeature
				}).addTo(map);
			updateLegend(Status.INC.eint, 'green');
			info.update = function (props) {
				this._div.innerHTML = '<h4>Phoenix Population</h4>' + (props ?
						'<b>' + 'Census Tract# ' + props.NAME + '</b><br /><b>Population: </b>' + props.Population + ' people' +
						'<br /><b>Income: </b> $' + props.Income
						 : 'Hover over a census tract');
			};
		} else if ($('#dataM').val() === 'crime') {
			var left = $("#slider").slider("values", 0);
			var right = $("#slider").slider("values", 1);

			$("#amount").val("Month" + left + " - Month" + right);
			var monthTotal = 0;
			geojson.clearLayers();
			geojson = L.geoJson(tractData, {
					style : function (feature) {
						monthTotal = 0;
						if (left != right) {
							for (var i = left; i <= right; i++) {
								var crimeNum = feature.properties['C_M' + i];
								monthTotal += crimeNum;
							}
						} else {
							var crimeNum = feature.properties['C_M' + left];
							monthTotal = crimeNum;
						}
						return {
							weight : 2,
							opacity : 1,
							color : 'white',
							dashArray : '3',
							fillOpacity : 0.7,
							fillColor : getRedColor(monthTotal, Status.CRM.eint)
						};
					},
					onEachFeature : function (feature, layer) {
						layer.on({
							mouseover : function (e) {
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
							},
							mouseout : resetHighlight,
							click : function (e) {
								onTileClick(e);
							}
						});
					}
				}).addTo(map);
			updateLegend(Status.CRM.eint, 'red');
			info.update = function (props) {
				var left = $("#slider").slider("values", 0);
				var right = $("#slider").slider("values", 1);
				if (props) {
					monthTotal = 0;
					if (left != right) {
						for (var i = left; i <= right; i++) {
							var Num = props['C_M' + i];
							monthTotal += Num;
						}
					} else {
						var Num = props['C_M' + left];
						monthTotal = Num;
					}
				}
				this._div.innerHTML = '<h4>Crime Number over Month ' + left + ' to Month ' + right + '</h4>' + (props ?
						'<b>' + 'Census Tract# ' + props.NAME + '</b><br /><b>Number of Crimes: </b>' + monthTotal
						 : 'Hover over a census tract');
			};

		} else if ($('#dataM').val() === 'rateN') {
			var left = $("#slider").slider("values", 0);
			var right = $("#slider").slider("values", 1);
			var monthTotal = 0;
			geojson.clearLayers();
			geojson = L.geoJson(tractData, {
					style : function (feature) {
						monthTotal = 0;
						if (left != right) {
							for (var i = left; i <= right; i++) {
								var num = feature.properties['R_M' + i];
								monthTotal += num;
							}
						} else {
							var num = feature.properties['R_M' + left];
							monthTotal = num;
						}
						return {
							weight : 2,
							opacity : 1,
							color : 'white',
							dashArray : '3',
							fillOpacity : 0.7,
							fillColor : getYellowColor(monthTotal, Status.REV.eint)
						};
					},
					onEachFeature : onEachFeature
				}).addTo(map);
			updateLegend(Status.REV.eint, 'yellow');
			info.update = function (props) {
				var left = $("#slider").slider("values", 0);
				var right = $("#slider").slider("values", 1);
				if (props) {
					monthTotal = 0;
					if (left != right) {
						for (var i = left; i <= right; i++) {
							var Num = props['R_M' + i];
							monthTotal += Num;
						}
					} else {
						var Num = props['R_M' + left];
						monthTotal = Num;
					}
				}
				this._div.innerHTML = '<h4>Number of Reviews over Month ' + left + ' to Month ' + right + '</h4>' + (props ?
						'<b>' + 'Census Tract# ' + props.NAME + '</b><br /><b>Number of Reviews: </b>' + monthTotal
						 : 'Hover over a census tract');
			};
		}
	} else if ($(this).val() == 'quantile') {
		if ($('#dataM').val() === 'pop') {
			geojson.clearLayers();
			geojson = L.geoJson(tractData, {
					style : function (feature) {
						return {
							weight : 2,
							opacity : 1,
							color : 'white',
							dashArray : '3',
							fillOpacity : 0.7,
							fillColor : getBlueColor(feature.properties.Population, Status.POP.qint)
						};
					},
					onEachFeature : onEachFeature
				}).addTo(map);
			updateLegend(Status.POP.qint, 'blue');
			info.update = function (props) {
				this._div.innerHTML = '<h4>Phoenix Population</h4>' + (props ?
						'<b>' + 'Census Tract# ' + props.NAME + '</b><br /><b>Population: </b>' + props.Population + ' people' +
						'<br /><b>Income: </b> $' + props.Income
						 : 'Hover over a census tract');
			};
		} else if ($('#dataM').val() === 'income') {
			geojson.clearLayers();
			geojson = L.geoJson(tractData, {
					style : function (feature) {
						return {
							weight : 2,
							opacity : 1,
							color : 'white',
							dashArray : '3',
							fillOpacity : 0.7,
							fillColor : getGreenColor(feature.properties.Income, Status.INC.qint)
						};
					},
					onEachFeature : onEachFeature
				}).addTo(map);
			updateLegend(Status.INC.qint, 'green');
			info.update = function (props) {
				this._div.innerHTML = '<h4>Phoenix Population</h4>' + (props ?
						'<b>' + 'Census Tract# ' + props.NAME + '</b><br /><b>Population: </b>' + props.Population + ' people' +
						'<br /><b>Income: </b> $' + props.Income
						 : 'Hover over a census tract');
			};
		} else if ($('#dataM').val() === 'crime') {
			var left = $("#slider").slider("values", 0);
			var right = $("#slider").slider("values", 1);

			$("#amount").val("Month" + left + " - Month" + right);
			var monthTotal = 0;
			geojson.clearLayers();
			geojson = L.geoJson(tractData, {
					style : function (feature) {
						monthTotal = 0;
						if (left != right) {
							for (var i = left; i <= right; i++) {
								var crimeNum = feature.properties['C_M' + i];
								monthTotal += crimeNum;
							}
						} else {
							var crimeNum = feature.properties['C_M' + left];
							monthTotal = crimeNum;
						}
						return {
							weight : 2,
							opacity : 1,
							color : 'white',
							dashArray : '3',
							fillOpacity : 0.7,
							fillColor : getRedColor(monthTotal, Status.CRM.qint)
						};
					},
					onEachFeature : function (feature, layer) {
						layer.on({
							mouseover : function (e) {
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
							},
							mouseout : resetHighlight,
							click : function (e) {
								onTileClick(e);
							}
						});
					}
				}).addTo(map);
			updateLegend(Status.CRM.qint, 'red');
			info.update = function (props) {
				var left = $("#slider").slider("values", 0);
				var right = $("#slider").slider("values", 1);
				if (props) {
					monthTotal = 0;
					if (left != right) {
						for (var i = left; i <= right; i++) {
							var Num = props['C_M' + i];
							monthTotal += Num;
						}
					} else {
						var Num = props['C_M' + left];
						monthTotal = Num;
					}
				}
				this._div.innerHTML = '<h4>Crime Number over Month ' + left + ' to Month ' + right + '</h4>' + (props ?
						'<b>' + 'Census Tract# ' + props.NAME + '</b><br /><b>Number of Crimes: </b>' + monthTotal
						 : 'Hover over a census tract');
			};

		} else if ($('#dataM').val() === 'rateN') {
			var left = $("#slider").slider("values", 0);
			var right = $("#slider").slider("values", 1);
			var monthTotal = 0;
			geojson.clearLayers();
			geojson = L.geoJson(tractData, {
					style : function (feature) {
						monthTotal = 0;
						if (left != right) {
							for (var i = left; i <= right; i++) {
								var num = feature.properties['R_M' + i];
								monthTotal += num;
							}
						} else {
							var num = feature.properties['R_M' + left];
							monthTotal = num;
						}
						return {
							weight : 2,
							opacity : 1,
							color : 'white',
							dashArray : '3',
							fillOpacity : 0.7,
							fillColor : getYellowColor(monthTotal, Status.REV.qint)
						};
					},
					onEachFeature : onEachFeature
				}).addTo(map);
			updateLegend(Status.REV.qint, 'yellow');
			info.update = function (props) {
				var left = $("#slider").slider("values", 0);
				var right = $("#slider").slider("values", 1);
				if (props) {
					monthTotal = 0;
					if (left != right) {
						for (var i = left; i <= right; i++) {
							var Num = props['R_M' + i];
							monthTotal += Num;
						}
					} else {
						var Num = props['R_M' + left];
						monthTotal = Num;
					}
				}
				this._div.innerHTML = '<h4>Number of Reviews over Month ' + left + ' to Month ' + right + '</h4>' + (props ?
						'<b>' + 'Census Tract# ' + props.NAME + '</b><br /><b>Number of Reviews: </b>' + monthTotal
						 : 'Hover over a census tract');
			};
		}
	}
});

/*****Check Box Event*****/
$('#checkboxShowFaces').change(function() {
	if ($(this).prop("checked")) {
		setChernoffVisible(true);
		document.getElementById('faceLegend').style.visibility = 'visible';
	} else {
		setChernoffVisible(false);
		document.getElementById('faceLegend').style.visibility = 'hidden';
	}
});