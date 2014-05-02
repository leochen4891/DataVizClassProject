function newline(text) {
	var content = document.createElement('br');
	text.appendChild(content);
}

function addstring(text, s) {
	var content = document.createTextNode(s);
	text.appendChild(content);
}
var geoid;
var start;
var end;

var mosaicIndex = -1;
var busiid;

var paraLines = new Array();
var paraAvgLine = new Object();
paraAvgLine.NAM = "avg";
paraAvgLine.COL = "#FF0000";
var paraMedLine = new Object();
paraMedLine.NAM = "med";
paraMedLine.COL = "#00A226";
var paraGeoidLine = new Object();
paraGeoidLine.NAM = "cur";
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
		var t = 0;
		for (var j = start; j <= end; j++) {
			t = t + item[flag + j];
		}
		sum = sum + t;
	}
	return sum;
}

function calcREVtotal(start, end){
	var REVIEW_OFFSET = 51;
	var sum = 0;
	for(var j = 0; j < GEOIDs.length; j++){
		var sss = 0;
        for (var i=start;i <= end; i++) {
            sss += GEOIDTable[GEOIDs[j]][i + REVIEW_OFFSET];
        }
		sum += sss;
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
			//console.log(item[flag+j]);
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
		var sum = 0;
		for (var j = start; j <= end; j++) {
			sum = sum + c[i].properties[flag + j];
		}
		list.push(sum);
	}
	return list;
}

function aveSumList(flag, start, end){
	var c = tractData.features;
	var list = [];
	for (var i = 0; i < c.length; i++) {
		var sum = 0;
		for (var j = start; j <= end; j++) {
			sum = sum + c[i].properties[flag + j];// * Math.random();
		}
		list.push(sum);		
	}
	return list;
}	

function getAveList(begin, end){
	var list = [];
	for (var i = 0; i < GEOIDs.length; i++ ){
		var geo = GEOIDs[i];
		var star = getStar(geo, begin, end);
		var review = getReview(geo, begin, end);
		if (review == 0){
			list.push(0);
		}
		else{
			list.push(star / review);
		}
	}
	return list;
}

function getAveGrades(aveList){
	//alert(aveList);
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
	//Status.RAT.total = sum;
	//console.log("sum = " + sum + ", len = " + vCount(1, 1));
	Status.RAT.ave = sum / alist.length;//sCount('R_M', start, end);//vCount(start, end);
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

function updateOne(index, flag, start, end, count){
	var list = sumList(flag, start, end);
	var slist = list.sort(function (a, b) {
			return a - b;
		});

	Status[index].total = calcTotal(flag, start, end);
	/*if (flag == 'VC_M'){
		console.log( 'total = ' + calcTotal('VC_M', start, end));
		Status[index].total = calcTotal('VC_M', start, end);
	}*/
	Status[index].ave = Status[index].total / count;//sCount('C_M', start, end);
	
	/*if (flag == 'VC_M'){
		console.log( 'count = ' + count);
		console.log( 'ave = ' + Status[index].ave);
	}*/
	Status[index].med = median(slist);
	Status[index].eint = equalInt(slist);
	Status[index].qint = quantInt(slist);
}

function updatePopInc(index, flag, start, end, count){
	var list = totList(flag);
	var slist = list.sort(function (a, b) {
			return a - b;
		});

	Status[index].total = total(flag);
	Status[index].ave = Status[index].total / count;
	Status[index].med = median(slist);
	Status[index].eint = equalInt(slist);
	Status[index].qint = quantInt(slist);

}
function getGrade(start, end) {
	var num = vCount(start, end);
	var len = vCount(1, 1);
	updateOne('CRM', 'C_M', start, end, sCount('C_M', start, end));

	updateOne('VCR', 'VC_M', start, end, sCount('VC_M', start, end));

	updateOne('REV', 'R_M', start, end, sCount('R_M', start, end));

	updatePopInc('POP', 'Population', start, end, len);
	updatePopInc('INC', 'Income', start, end, len);
	
	getAveInfo(start, end);
}

function updateGrade(start, end) {
	var num = vCount(start, end);
	var len = vCount(1, 1);
	updateOne('CRM', 'C_M', start, end, sCount('C_M', start, end));

	updateOne('VCR', 'VC_M', start, end, sCount('VC_M', start, end));

	updateOne('REV', 'R_M', start, end, sCount('R_M', start, end));
	
	getAveInfo(start, end);
}

function updateParaLines(start, end) {
    paraAvgLine.POP = Status.POP.ave;
    paraAvgLine.INC = Status.INC.ave;
    paraAvgLine.CRM = Status.CRM.ave;
    paraAvgLine.VCR = Status.VCR.ave;
    paraAvgLine.REV = Status.REV.ave;
    paraAvgLine.RAT = Status.RAT.ave;
    
    paraMedLine.POP = Status.POP.med;
    paraMedLine.INC = Status.INC.med;
    paraMedLine.CRM = Status.CRM.med;
    paraMedLine.VCR = Status.VCR.med;
    paraMedLine.REV = Status.REV.med;
    paraMedLine.RAT = Status.RAT.med;

    if (null != geoid) {
        paraGeoidLine.POP = getPop(Number(geoid));
        paraGeoidLine.INC = getIncome(Number(geoid));
        paraGeoidLine.CRM = getCrime(Number(geoid), start, end);
   paraGeoidLine.VCR = getVioCrime(Number(geoid), start, end);
        paraGeoidLine.REV = getReview(Number(geoid), start, end);
        paraGeoidLine.RAT = getStar(Number(geoid), start, end);

       
        paraGeoidLine.VCR = getVioCrime(Number(geoid), start, end);
        paraGeoidLine.REV = getReview(Number(geoid), start, end);
        paraGeoidLine.RAT = getAveRating(Number(geoid), start, end);
        /* TEST 
        var tempStr = 'average rating = ' + paraGeoidLine.RAT;
        $(function(){
        	$('#test').html(tempStr);
        });
        /* END */
    }
}

function setMapGrades(){
	mapGrades.crimeGrades.eint = Status.CRM.eint;
	mapGrades.crimeGrades.qint = Status.CRM.qint;
	mapGrades.rateGrades.eint = Status.REV.eint;
	mapGrades.rateGrades.qint = Status.REV.qint;
}
