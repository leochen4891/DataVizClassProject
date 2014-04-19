function newline(text) {
	var content = document.createElement('br');
	text.appendChild(content);
}

function addstring(text, s) {
	var content = document.createTextNode(s);
	text.appendChild(content);
}
var geoid = 4013615000;
var start;
var end;

var mosaicIndex = 0;
var busiid;

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
	POP : {
		"total" : 0,
		"ave" : 0,
		"med" : 0,
		"eint" : [],
		"qint" : []
	},
	INC : {
		"total" : 0,
		"ave" : 0,
		"med" : 0,
		"eint" : [],
		"qint" : []
	},
	CRM : {
		"total" : 0,
		"ave" : 0,
		"med" : 0,
		"eint" : [],
		"qint" : []
	},
	VCR : {
		"total" : 0,
		"ave" : 0,
		"med" : 0,
		"eint" : [],
		"qint" : []
	},
	REV : {
		"total" : 0,
		"ave" : 0,
		"med" : 0,
		"eint" : [],
		"qint" : []
	},
	RAT : {
		"total" : 0,
		"ave" : 0,
		"med" : 0,
		"eint" : [],
		"qint" : []
	},
	/*STR: {
		"total" : 0,
		"ave" : 0,
		"med" : 0,
		"eint" : [],
		"qint" : []
	}*/
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

function aveSumList(flag, start, end){
	var c = tractData.features;
	var list = [];
	for (var i = 0; i < c.length; i++) {
		var sum = 0;
		for (var j = start; j <= end; j++) {
			sum = sum + c[i].properties[flag + j] * Math.random();
		}
		list.push(sum);		
	}
	return list;
}	

function getAveList(start, end){
	var nList = sumList('R_M', start, end);
	//alert(nList);
	var rList = aveSumList('S_M', start, end);
	//alert(rList);
	var aveList = [];
	for (var i = 0; i < nList.length; i++){
		if(nList[i] != 0){
			aveList.push(rList[i]/nList[i]);
		}
		else{
			aveList.push(0);
		}
	}
	//alert(aveList);
	return aveList;
}


function getAveGrades(aveList){
	var list = aveList.sort(function(a, b){ 
		return a-b;
	});
	Status.RAT.eint = equalInt(list);
	Status.RAT.qint = quantInt(list);
	
	Status.RAT.med = list[Math.floor(list.length/2)];
}

function getAveInfo(start, end){
	var alist = getAveList(start, end);
	var sum = 0;
	for(var i = 0; i < alist.length; i++){
		sum += alist[i];
	}
	Status.RAT.total = sum;
	Status.RAT.ave = sum / sCount('R_M', start, end);//vCount(start, end);
	getAveGrades(alist);
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

	Status.CRM.total = calcTotal('C_M', start, end);
	Status.CRM.ave = Status.CRM.total / len;//sCount('C_M', start, end);
	Status.CRM.med = median(slist);
	Status.CRM.eint = equalInt(slist);
	Status.CRM.qint = quantInt(slist);

	list = sumList('VC_M', start, end);
	slist = list.sort(function (a, b) {
			return a - b;
		});

	Status.VCR.total = calcTotal('VC_M', start, end);
	Status.VCR.ave = Status.VCR.total / len;//sCount('VC_M', start, end);
	Status.VCR.med = median(slist);
	Status.VCR.eint = equalInt(slist);
	Status.VCR.qint = quantInt(slist);

	list = sumList('R_M', start, end);
	slist = list.sort(function (a, b) {
			return a - b;
		});

	Status.REV.total = calcTotal('R_M', start, end);
	Status.REV.ave = Status.REV.total / len;//sCount('R_M', start, end);
	Status.REV.med = median(slist);
	Status.REV.eint = equalInt(slist);
	Status.REV.qint = quantInt(slist);

	/*list = sumList('S_M', start, end);
	slist = list.sort(function (a, b) {
			return a - b;
		});

	Status.STR.total = calcTotal('S_M', start, end);
	Status.STR.ave = Status.STR.total / len;//sCount('S_M', start, end);
	Status.STR.med = median(slist);
	Status.STR.eint = equalInt(slist);
	Status.STR.qint = quantInt(slist);

	list = totList('Population');
	slist = list.sort(function (a, b) {
			return a - b;
		});*/

	Status.POP.total = total('Population');
	Status.POP.ave = Status.POP.total / len;
	Status.POP.med = median(slist);
	Status.POP.eint = equalInt(slist);
	Status.POP.qint = quantInt(slist);

	list = totList('Income');
	slist = list.sort(function (a, b) {
			return a - b;
		});

	Status.INC.total = total('Income');
	Status.INC.ave = Status.INC.total / len;
	Status.INC.med = median(slist);
	Status.INC.eint = equalInt(slist);
	Status.INC.qint = quantInt(slist);
	
	getAveInfo(start, end);
}

function updateGrade(start, end) {
	var num = vCount(start, end);
	var len = vCount(1, 1);
	var list = sumList('C_M', start, end);
	var slist = list.sort(function (a, b) {
			return a - b;
		});

	Status.CRM.total = calcTotal('C_M', start, end);
	Status.CRM.ave = Status.CRM.total / len;//sCount('C_M', start, end);
	Status.CRM.med = median(slist);
	Status.CRM.eint = equalInt(slist);
	Status.CRM.qint = quantInt(slist);

	list = sumList('VC_M', start, end);
	slist = list.sort(function (a, b) {
			return a - b;
		});

	Status.VCR.total = calcTotal('VC_M', start, end);
	Status.VCR.ave = Status.VCR.total / len;//sCount('VC_M', start, end);
	Status.VCR.med = median(slist);
	Status.VCR.eint = equalInt(slist);
	Status.VCR.qint = quantInt(slist);

	list = sumList('R_M', start, end);
	slist = list.sort(function (a, b) {
			return a - b;
		});

	Status.REV.total = calcTotal('R_M', start, end);
	Status.REV.ave = Status.REV.total / len;//sCount('R_M', start, end);
	Status.REV.med = median(slist);
	Status.REV.eint = equalInt(slist);
	Status.REV.qint = quantInt(slist);

	/*list = sumList('S_M', start, end);
	slist = list.sort(function (a, b) {
			return a - b;
		});

	Status.STR.total = calcTotal('S_M', start, end);
	Status.STR.ave = Status.STR.total / len;//sCount('S_M', start, end);
	Status.STR.med = median(slist);
	Status.STR.eint = equalInt(slist);
	Status.STR.qint = quantInt(slist);*/
	
	getAveInfo(start, end);
}

function updateParaLines() {
    paraAvgLine.POP = Status.POP.ave;
    paraAvgLine.INC = Status.INC.ave;
    paraAvgLine.CRM = Status.CRM.ave;
    paraAvgLine.VCR = Status.VCR.ave;
    paraAvgLine.REV = Status.REV.ave;
    paraAvgLine.RAT = Status.RAT.ave;
    
    paraMedLine.POP = Status.POP.ave;
    paraMedLine.INC = Status.INC.ave;
    paraMedLine.CRM = Status.CRM.ave;
    paraMedLine.VCR = Status.VCR.ave;
    paraMedLine.REV = Status.REV.ave;
    paraMedLine.RAT = Status.RAT.ave;

    if (null != geoid) {
        paraGeoidLine.POP = getPop(parseInt(geoid));
        paraGeoidLine.INC = getIncome(parseInt(geoid));
        paraGeoidLine.CRM = getCrime(parseInt(geoid), start, end);
        paraGeoidLine.VCR = getVioCrime(parseInt(geoid), start, end);
        paraGeoidLine.REV = getReview(parseInt(geoid), start, end);
        paraGeoidLine.RAT = getStar(parseInt(geoid), start, end);
    }
}

function setMapGrades(){
	mapGrades.crimeGrades.eint = Status.CRM.eint;
	mapGrades.crimeGrades.qint = Status.CRM.qint;
	mapGrades.rateGrades.eint = Status.REV.eint;
	mapGrades.rateGrades.qint = Status.REV.qint;
}
