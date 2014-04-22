var tagHash;// = new HashTable();
var top20Words;// = new Array();
var fill;// = d3.scale.category20();

function drawTagCloud() {
	//console.log("draw tag cloud, busiid = " + busiid);
	var start = 1;
	var end = 24;
	$(function() {
		start = $('#slider').slider("values", 0);
		end = $('#slider').slider("values", 1);
	});

	//var s1 = WorkCountTable["juba-restaurant-phoenix"];
	var s1 = WorkCountTable[busiid];
	if (null == s1) {
		d3.select("p").html("");
		d3.layout.cloud().size([ 400, 224 ]);
		return;
	}
	
	tagHash = new HashTable();
	top20Words = new Array();
	top20Words = findTop20(s1, start, end);
	
	var sizeArray = new Array (40,35,30,25,20,18,17,16,15,14,13,12,11,10,9,8,7,6,5);
   	var index = 0;
	fill = d3.scale.category20();

	var arrayWords = new Array();
	arrayWords = top20Words;
	d3.select("p").html("");
	d3.layout.cloud().size([ 400, 224 ]).words(arrayWords.map(function(d) {
		return {
			text : d,
			size : sizeArray[index++]
		};
	})).padding(5).rotate(function() {
		return ~~(Math.random() * 2) * 90;
	}).font("Impact").fontSize(function(d) {
		return d.size;
	}).on("end", draw).start();
}

function HashTable(obj) {
	this.length = 0;
	this.items = {};
	for ( var p in obj) {
		if (obj.hasOwnProperty(p)) {
			this.items[p] = obj[p];
			this.length++;
		}
	}

	this.setItem = function(key, value) {
		var previous = undefined;
		if (this.hasItem(key)) {
			previous = this.items[key];
		} else {
			this.length++;
		}
		this.items[key] = value;
		return previous;
	};

	this.getItem = function(key) {
		return this.hasItem(key) ? this.items[key] : undefined;
	};

	this.hasItem = function(key) {
		return this.items.hasOwnProperty(key);
	};

	this.removeItem = function(key) {
		if (this.hasItem(key)) {
			previous = this.items[key];
			this.length--;
			delete this.items[key];
			return previous;
		} else {
			return undefined;
		}
	};

	this.keys = function() {
		var keys = [];
		for ( var k in this.items) {
			if (this.hasItem(k)) {
				keys.push(k);
			}
		}
		return keys;
	};

	this.values = function() {
		var values = [];
		for ( var k in this.items) {
			if (this.hasItem(k)) {
				values.push(this.items[k]);
			}
		}
		return values;
	};

	this.each = function(fn) {
		for ( var k in this.items) {
			if (this.hasItem(k)) {
				fn(k, this.items[k]);
			}
		}
	};

	this.clear = function() {
		this.items = {};
		this.length = 0;
	};
}

function findTop20(s1, monthStart, monthEnd) {
	var startIndex = monthStart;
	var stopIndex = monthEnd;
	var words = new Array();
	//var length = stopIndex - startIndex;
	//document.write(length);

	for (var i = startIndex; i <= stopIndex; i++) {
		var m = s1[i - 1];
		var singleWord = m.split(";");
		var length1 = singleWord.length;
		length1 = length1 - 1;
		for (var k = 0; k < length1; k++) {
			words.push(singleWord[k]);
			//document.write(singleWord[k]+"<br/>");
		}
	}

	var l = words.length;
	//for (i = 0; i < l; i++) {
	//document.write(words[i]+"<br/>");
	//}

	for (var r = 0; r < l; r++) {

		var eachWord = words[r].split("_");
		if (tagHash.hasItem(eachWord[0])) {
			var k = tagHash.getItem(eachWord[0]);
			tagHash.removeItem(eachWord[0]);
			tagHash.setItem(eachWord[0], parseInt(eachWord[1]) + parseInt(k));
		} else {
			tagHash.setItem(eachWord[0], eachWord[1]);
		}

	}
	//document.write(tagHash.keys()+"<br/>");
	//document.write(tagHash.values()+"<br/>");

	//sorting the hash table and returning top 20 words
	var counts = new Array();
	var wordsArray = new Array();
	var temp = 0;
	var tempWord = "";
	//var max = 0;
	wordsArray = tagHash.keys();
	counts = tagHash.values();
	//document.write(counts.length);

	for (i = 0; i < counts.length - 1; i++) {

		for (var j = i + 1; j < counts.length; j++) {
			if (counts[i] < counts[j]) {
				temp = counts[i];
				counts[i] = counts[j];
				counts[j] = temp;
				tempWord = wordsArray[i];
				wordsArray[i] = wordsArray[j];
				wordsArray[j] = tempWord;
			}
		}
	}

	//document.write(len+"<br/>");
	for (i = 0; i < 20; i++) {
		top20Words[i] = wordsArray[i];
	}
	return top20Words;

}

function draw(words) {
	d3.select("p").append("svg").attr("width", 400).attr("height", 225).append(
			"g").attr("transform", "translate(185,110)").selectAll("text")
			.data(words).enter().append("text").style("font-size", function(d) {
				return d.size + "px";
			}).style("font-family", "Impact").style("fill", function(d, i) {
				return fill(i);
			}).attr("text-anchor", "middle").attr(
					"transform",
					function(d) {
						return "translate(" + [ d.x, d.y ] + ")rotate("
								+ d.rotate + ")";
					}).text(function(d) {
				return d.text;
			});
}
