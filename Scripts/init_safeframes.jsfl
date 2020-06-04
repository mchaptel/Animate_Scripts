//Commande écrite par Mathieu Chaptel. Pour toute demande, m.chaptel@gmail.com


// This script initializes the flash file with a safety frame and a calibration frame
// Run this file then setup the rectangles as you want, then run init__sizes to modify
// the size and content of the scene.



//get flash file

var doc = fl.getDocumentDOM();

var myStroke = fl.getDocumentDOM().getCustomStroke("toolbar");

// create safety frame graphic

doc.getTimeline().setSelectedLayers(0);

var safeLayer = doc.getTimeline().addNewLayer("Safe", "normal", true);

doc.setCustomStroke({color:"#0033CC", thickness:1, style:"hairline"});

//var docWidth = 1920
//var docHeight = 1080

var docWidth = doc.width
var docHeight = doc.height

doc.addNewRectangle({left:0, top:0, right:docWidth, bottom:docHeight}, 0, true, false);
doc.addNewRectangle({left:(docWidth/20), top:(docHeight/20), right:(docWidth-docWidth/20), bottom:(docHeight-docHeight/20)}, 0, true, false);
doc.getTimeline().setSelectedLayers(safeLayer);
doc.getTimeline().setSelectedFrames(0,0);

var safe = doc.convertToSymbol("graphic", "ActionSafe", "top left");

doc.getTimeline().layers[safeLayer].frames[0].elements[0].name = "ActionSafe";
doc.getTimeline().layers[safeLayer].frames[0].elements[0].setTransformationPoint({x:0, y:0});

// create calibration rectangle


var calibrationLayer = doc.getTimeline().addNewLayer("Calibration", "normal", true);

doc.setCustomStroke({color:"#FF0000", thickness:1, style:"hairline"});
doc.addNewRectangle({left:0, top:0, right:docWidth, bottom:docHeight}, 0, true, false);

doc.getTimeline().setSelectedLayers(calibrationLayer) ;
doc.getTimeline().setSelectedFrames(0,0) ;

var safe = doc.convertToSymbol("graphic", "Calibration", "top left");

doc.getTimeline().layers[calibrationLayer].frames[0].elements[0].name = "Calibration";
doc.getTimeline().layers[calibrationLayer].frames[0].elements[0].setTransformationPoint({x:0, y:0});

doc.setCustomStroke( myStroke );

// Send message


alert ( "Please move the Safe frame to the smallest frame in the BG and resize the Calibration frame to englobe all of the BG.")