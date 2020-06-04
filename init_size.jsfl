//Commande écrite par Mathieu Chaptel. Pour toute demande, m.chaptel@gmail.com


//This script initializes the flash file with a safety frame and a calibration frame


//get flash file

var doc = fl.getDocumentDOM();


// detect safe frame and calibration frame;

function FindByName(name){
	fl.getDocumentDOM().selectAll();
	var selectionArray = fl.getDocumentDOM().selection;
	var results = [];
	for (var i=0;i<selectionArray.length;i++){
		if (selectionArray[i].libraryItem.name == name){
			results.push(selectionArray[i]);
		}
	}
	return results;
}

var nameToSearchFor = "ActionSafe";
var results = FindByName(nameToSearchFor);
if (results.length == 0){
	alert("No safe frame, please run init_safeframes command first");
} else{
	var safeFrame = results[0];
}


var nameToSearchFor = "Calibration";
var results = FindByName(nameToSearchFor);
if (results.length == 0){
	alert("No calibration frame, please run init_safeframes command first");
} else{
	var calibrationFrame = results[0];
}

//change file size

//var docWidth = 1920
//var docHeight = 1080

function setFileSize(safe, calibration){

	var xratio = calibration.width/safe.width;
	var yratio = calibration.height/safe.height;
	var newWidth = xratio*docWidth;
	var newHeight = yratio*docHeight;

	// set everything at the right size

	scalex = docWidth/safe.width;
	scaley = docHeight/safe.height;

	doc.selectAll();
	fl.getDocumentDOM().transformSelection(scalex, 0.0, 0.0, scaley);

	doc.width = Math.round(newWidth);
	doc.height = Math.round(newHeight);
}

function moveToOrigin(calibration){

	doc.selectAll();
	doc.moveSelectionBy({x:Math.round(-calibration.x), y:Math.round(-calibration.y)});

}


if (safeFrame!=null && calibrationFrame!=null){
	setFileSize(safeFrame, calibrationFrame);
	moveToOrigin(calibrationFrame);
};