function newline(text) {
	var content = document.createElement('br');
	text.appendChild(content);
}

function addstring(text, s) {
	var content = document.createTextNode(s);
	text.appendChild(content);
}
var geoid = 4013103604;
var start;
var end;

var paraLines = new Array();
var paraAvgLine = new Object();
paraAvgLine.COL = "#FF0000";
var paraMedLine = new Object();
paraMedLine.COL = "#00FF00";
var paraGeoidLine = new Object();
paraGeoidLine.COL = "#000000";

paraLines[0] = paraAvgLine;
paraLines[1] = paraMedLine;
paraLines[2] = paraGeoidLine;
var mapGrades = {
	crimeGrades : {
		eint : [],
		qint : [],
	},
	rateGrades : {
		eint : [],
		qint : [],
	},
};
var Status = {
	pop : {
		"total" : 0,
		"ave" : 0,
		"med" : 0,
		"eint" : [],
		"qint" : []
	},
	income : {
		"total" : 0,
		"ave" : 0,
		"med" : 0,
		"eint" : [],
		"qint" : []
	},
	crimeN : {
		"total" : 0,
		"ave" : 0,
		"med" : 0,
		"eint" : [],
		"qint" : []
	},
	vCrimeN : {
		"total" : 0,
		"ave" : 0,
		"med" : 0,
		"eint" : [],
		"qint" : []
	},
	rateN : {
		"total" : 0,
		"ave" : 0,
		"med" : 0,
		"eint" : [],
		"qint" : []
	},
	rateR : {
		"total" : 0,
		"ave" : 0,
		"med" : 0,
		"eint" : [],
		"qint" : []
	},
	rateP: {
		"total" : 0,
		"ave" : 0,
		"med" : 0,
		"eint" : [],
		"qint" : []
	}
};
function calcTotal(flag, start, end) {
	var c = tractData.features;
	var sum = 0;
	for (var i = 0; i < c.length; i++) {
		var item = c[i].properties;
		if (start == end) {
			sum = sum + item[flag + start];
		} else {
			var t = 0;
			for (var j = start; j <= end; j++) {
				t = t + item[flag + j];
			}
			sum = sum + t;
		}
	}
	return sum;
}

function vCount(start, end) {
	var c = tractData.features;
	var vCount = 0;
	if (start == end) {
		vCount = c.length;
	} else {
		var t = end - start + 1;
		vCount = c.length * t;
	}
	return vCount;
}
function sCount(flag, start, end){
	var c = tractData.features;
	var ct = 0;
	for (var i = 0; i < c.length; i++) {
		var item = c[i].properties;
		for (var j = start; j <= end; j++) {
			if (item[flag + j] != 0){
				ct++;
			}
		}
	}
	return ct;
}
function total(str) {
	var list = tractData.features;
	var sum = 0;
	for (var i = 0; i < list.length; i++) {
		sum = sum + list[i].properties[str];
	}
	return sum;
}
function sumList(flag, start, end) {
	var c = tractData.features;
	var list = [];
	for (var i = 0; i < c.length; i++) {
		if (start == end) {
			list.push(c[i].properties[flag + start]);
		} else {
			var sum = 0;
			for (var j = start; j <= end; j++) {
				sum = sum + c[i].properties[flag + j];
			}
			list.push(sum);
		}
	}
	return list;
}

function getAveList(start, end){
	var nList = sumList('R_M', start, end);
	var rList = sumList('S_M', start, end);
	var aveList = [];
	for (var i = 0; i < nList.length; i++){
		aveList.push(rList[i]/nList[i]);
	}
	return aveList;
}


function getAveGrades(aveList){
	var list = aveList.sort(function(a, b){ return a-b;});
	Status.rateP.eint = equalInt(list);
	Status.rateP.qint = quantInt(list);
}
function totList(flag) {
	var c = tractData.features;
	var list = [];
	for (var i = 0; i < c.length; i++) {
		list.push(c[i].properties[flag]);
	}
	return list;
}
function median(slist) {
	return slist[Math.floor(slist.length / 2)];
}

function equalInt(slist) {
	var max = slist[slist.length - 1];
	var min = slist[0];
	var h = (max - min) / 7;
	return [
		min,
		min + h,
		min + h * 2,
		min + h * 3,
		min + h * 4,
		min + h * 5,
		min + h * 6,
		max
	];
}
function quantInt(slist) {
	var k = Math.ceil(slist.length / 7);
	return [
		slist[0],
		slist[k],
		slist[k * 2],
		slist[k * 3],
		slist[k * 4],
		slist[k * 5],
		slist[k * 6],
		slist[slist.length - 1]
	];
}
function getGrade(start, end) {
	var num = vCount(start, end);
	var len = vCount(1, 1);
	var list = sumList('C_M', start, end);
	var slist = list.sort(function (a, b) {
			return a - b;
		});

	Status.crimeN.total = calcTotal('C_M', start, end);
	Status.crimeN.ave = Status.crimeN.total / sCount('C_M', start, end);
	Status.crimeN.med = median(slist);
	Status.crimeN.eint = equalInt(slist);
	Status.crimeN.qint = quantInt(slist);

	list = sumList('VC_M', start, end);
	slist = list.sort(function (a, b) {
			return a - b;
		});

	Status.vCrimeN.total = calcTotal('VC_M', start, end);
	Status.vCrimeN.ave = Status.vCrimeN.total / sCount('VC_M', start, end);
	Status.vCrimeN.med = median(slist);
	Status.vCrimeN.eint = equalInt(slist);
	Status.vCrimeN.qint = quantInt(slist);

	list = sumList('R_M', start, end);
	slist = list.sort(function (a, b) {
			return a - b;
		});

	Status.rateN.total = calcTotal('R_M', start, end);
	Status.rateN.ave = Status.rateN.total / sCount('R_M', start, end);
	Status.rateN.med = median(slist);
	Status.rateN.eint = equalInt(slist);
	Status.rateN.qint = quantInt(slist);

	list = sumList('S_M', start, end);
	slist = list.sort(function (a, b) {
			return a - b;
		});

	Status.rateR.total = calcTotal('S_M', start, end);
	Status.rateR.ave = Status.rateR.total / sCount('S_M', start, end);
	Status.rateR.med = median(slist);
	Status.rateR.eint = equalInt(slist);
	Status.rateR.qint = quantInt(slist);

	list = totList('Population');
	slist = list.sort(function (a, b) {
			return a - b;
		});

	Status.pop.total = total('Population');
	Status.pop.ave = Status.pop.total / len;
	Status.pop.med = median(slist);
	Status.pop.eint = equalInt(slist);
	Status.pop.qint = quantInt(slist);

	list = totList('Income');
	slist = list.sort(function (a, b) {
			return a - b;
		});

	Status.income.total = total('Income');
	Status.income.ave = Status.income.total / len;
	Status.income.med = median(slist);
	Status.income.eint = equalInt(slist);
	Status.income.qint = quantInt(slist);
	
	getAveGrades(getAveList(start, end));
}

function updateGrade(start, end) {
	var num = vCount(start, end);
	var len = vCount(1, 1);
	var list = sumList('C_M', start, end);
	var slist = list.sort(function (a, b) {
			return a - b;
		});

	Status.crimeN.total = calcTotal('C_M', start, end);
	Status.crimeN.ave = Status.crimeN.total / sCount('C_M', start, end);
	Status.crimeN.med = median(slist);
	Status.crimeN.eint = equalInt(slist);
	Status.crimeN.qint = quantInt(slist);

	list = sumList('VC_M', start, end);
	slist = list.sort(function (a, b) {
			return a - b;
		});

	Status.vCrimeN.total = calcTotal('VC_M', start, end);
	Status.vCrimeN.ave = Status.vCrimeN.total / sCount('VC_M', start, end);
	Status.vCrimeN.med = median(slist);
	Status.vCrimeN.eint = equalInt(slist);
	Status.vCrimeN.qint = quantInt(slist);

	list = sumList('R_M', start, end);
	slist = list.sort(function (a, b) {
			return a - b;
		});

	Status.rateN.total = calcTotal('R_M', start, end);
	Status.rateN.ave = Status.rateN.total / sCount('R_M', start, end);
	Status.rateN.med = median(slist);
	Status.rateN.eint = equalInt(slist);
	Status.rateN.qint = quantInt(slist);

	list = sumList('S_M', start, end);
	slist = list.sort(function (a, b) {
			return a - b;
		});

	Status.rateR.total = calcTotal('S_M', start, end);
	Status.rateR.ave = Status.rateR.total / sCount('S_M', start, end);
	Status.rateR.med = median(slist);
	Status.rateR.eint = equalInt(slist);
	Status.rateR.qint = quantInt(slist);
	
	getAveGrades(getAveList(start, end));
}

function updateParaLines() {
    paraAvgLine.POP = Status.pop.ave;
    paraAvgLine.INC = Status.income.ave;
    paraAvgLine.CRM = Status.crimeN.ave;
    paraAvgLine.VCR = Status.vCrimeN.ave;
    paraAvgLine.REV = Status.rateN.ave;
    paraAvgLine.STR = Status.rateR.ave;
    
    paraMedLine.POP = Status.pop.ave;
    paraMedLine.INC = Status.income.ave;
    paraMedLine.CRM = Status.crimeN.ave;
    paraMedLine.VCR = Status.vCrimeN.ave;
    paraMedLine.REV = Status.rateN.ave;
    paraMedLine.STR = Status.rateR.ave;

    if (null != geoid) {
        paraGeoidLine.POP = getPop(parseInt(geoid));
        paraGeoidLine.INC = getIncome(parseInt(geoid));
        paraGeoidLine.CRM = getCrime(parseInt(geoid), start, end);
        paraGeoidLine.VCR = getVioCrime(parseInt(geoid), start, end);
        paraGeoidLine.REV = getReview(parseInt(geoid), start, end);
        paraGeoidLine.STR = getStar(parseInt(geoid), start, end);
    }
}

function setMapGrades(){
	mapGrades.crimeGrades.eint = Status.crimeN.eint;
	mapGrades.crimeGrades.qint = Status.crimeN.qint;
	mapGrades.rateGrades.eint = Status.rateN.eint;
	mapGrades.rateGrades.qint = Status.rateN.qint;
}
