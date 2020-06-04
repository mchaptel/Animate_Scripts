//Commande écrite par Mathieu Chaptel. Pour toute demande, m.chaptel@gmail.com

var doc = fl.getDocumentDOM();
var tl = doc.getTimeline();
var sel = tl.getSelectedFrames();

fl.outputPanel.clear();

var dialogXML = "";
dialogXML += '<dialog title="Generate Trajectory" buttons="accept, cancel">';
dialogXML +=   '<hbox>';
dialogXML +=     '<label value="enter curviness: "/>';
dialogXML +=     '<popupslider id="slider" minvalue="0" maxvalue="100" width="100"/> ';
dialogXML +=   '</hbox>';
dialogXML += '</dialog>';

var xmlPanelOutput = showXMLPanel(dialogXML);

if (xmlPanelOutput.dismiss == "accept") // user confirms dialog
{
		createTrajectory(xmlPanelOutput.slider/100)
}


function showXMLPanel(xmlString)
{
  var tempUrl = fl.configURI + "Commands/temp-dialog-" + parseInt(777 * 777) + ".xml"
  FLfile.write(tempUrl, xmlString);
  var xmlPanelOutput = fl.getDocumentDOM().xmlPanel(tempUrl);
  FLfile.remove(tempUrl);
  return xmlPanelOutput;
}


function createTrajectory(curviness){

	var points = [];

	for (var i=sel[1]; i<sel[2]; i++){
		if (getFrame(i).startFrame == i){
			var el = getFrame(i).elements[0];
			points.push({"frame":i, "x":el.transformX, "y":el.transformY});
		}
	}

	var segments = [];

	for (var i=0; i<points.length; i++){

		if (i==0){
			segments.push(points[i]);
		}else if (i == points.length-1){
			segments.push(points[i]);
		}else {
			var tangentPoints = getCurvePoints(points[i-1], points[i], points[i+1], curviness);
			//doc.addNewLine(tangentPoints[0], tangentPoints[1]);
			segments.push([tangentPoints[0], points[i], tangentPoints[1]]);
		}
	}

	if (tl.currentLayer==0 || tl.layers[tl.currentLayer-1].name != "trajectory"){
		tl.addNewLayer("trajectory");
	} else {
		tl.currentLayer -=1
	}

	for (i in segments){
		fl.trace(segments[i]);
	}
	drawCurve(segments);
	tl.layers[tl.currentLayer].layerType = "guide";
	tl.layers[tl.currentLayer+1].layerType = "guided";
}



function drawCurve (curveArray){
	var myPath = fl.drawingLayer.newPath();

	// first curve isn't cubic
	myPath.addCurve(curveArray[0].x, curveArray[0].y, curveArray[1][0].x, curveArray[1][0].y, curveArray[1][1].x, curveArray[1][1].y)
	for (var i=1; i<curveArray.length-2; i++){
		//iterate over all points one by one and create the curve that is after them)
		myPath.addCubicCurve(curveArray[i][1].x, curveArray[i][1].y, curveArray[i][2].x, curveArray[i][2].y, curveArray[i+1][0].x, curveArray[i+1][0].y, curveArray[i+1][1].x, curveArray[i+1][1].y)
		myPath.makeShape(false, true);
	}

	var i = curveArray.length-2;
	myPath.addCurve(curveArray[i][1].x, curveArray[i][1].y, curveArray[i][2].x, curveArray[i][2].y, curveArray[i+1].x, curveArray[i+1].y)

	myPath.makeShape(true, false);
}


function getFrame (frame){
	return (tl.layers[tl.currentLayer].frames[frame]);
}

function getDistance(vector){
	return Math.sqrt (Math.pow(vector.x, 2) + Math.pow(vector.y,2));
}


function getAngle (A, B, C){

	var BA = {"x":A.x-B.x, "y":A.y-B.y};
	var BC = {"x":C.x-B.x, "y":C.y-B.y};

 	var Teta = (Math.atan2(BC.y, BC.x) - Math.atan2(BA.y, BA.x));
	if (Teta < 0) Teta += 2* Math.PI;

	return (Teta);
}

function getTangentAngle (A, B, C){

	var BA = {"x":A.x-B.x, "y":A.y-B.y};

	BAangle = Math.atan2(BA.y ,BA.x)

	var Teta = (BAangle + (getAngle(A,B,C)/2) -Math.PI/2);

	return (Teta);
}

function getTangentVector (A, B, C, unit){
	var angle = getTangentAngle(A, B, C);
	return {"x":Math.cos(angle)*unit, "y":Math.sin(angle)*unit};
}

function drawAngleAtPoint(angle, point){
	var p = {"x":Math.cos(angle)*100+point.x, "y":(Math.sin(angle)*100)+point.y}
	doc.addNewLine(point, p);
}

function getCurvePoints (A, B, C, curviness){

	var InfPoints = getInflexionPoints(A, B, C);

	var BI = {"x":InfPoints[0].x-B.x, "y":InfPoints[0].y-B.y};
	var BJ = {"x":InfPoints[1].x-B.x, "y":InfPoints[1].x-B.x};

	BI = getTangentVector(A, B, C, getDistance(BI));
	BJ = getTangentVector(A, B, C, getDistance(BJ));

	var pointI = {"x":B.x+BI.x*curviness, "y":B.y+BI.y*curviness};
	var pointJ = {"x":B.x-BJ.x*curviness, "y":B.y-BJ.y*curviness};
	return [pointI, pointJ];
}

function getInflexionPoints(A, B, C){

		var vector = getTangentVector (A, B, C, 100);

		var BA = {"x":B.x-A.x, "y":B.y-A.y}
		var BI = getOrthProjection(BA, vector)
		var pointI = {"x":B.x+BI.x, "y":B.y+BI.y}

		var BC = {"x":B.x-C.x, "y":B.y-C.y}
		var BJ = getOrthProjection(BC, vector)
		var pointJ = {"x":B.x+BJ.x, "y":B.y+BJ.y}


		return [pointI, pointJ]
}

function getOrthProjection (vector1, vector2){
	return {"x":(DotProduct(vector1, vector2)/DotProduct(vector2, vector2))*vector2.x, "y":(DotProduct(vector1, vector2)/DotProduct(vector2, vector2))*vector2.y}
}


function DotProduct (vector1, vector2){
	return vector1.x*vector2.x+vector1.y+vector2.y;
}
/*
function getTangentVector(A, B, C){
	var BA = {"x": A.x-B.x,"y":A.y-B.y}
	var BC = {"x": C.x-B.x ,"y":C.y-B.y}
	var CA = {"x": BA.x-BC.x, "y": BA.y-BC.y}
	return CA;
}
function drawTangentAtPoint(tangent, point){
	doc.addNewLine(point, {"x":point.x+(tangent.x*0.25), "y":point.y+tangent.y*0.25});
	doc.addNewLine(point, {"x":point.x-tangent.x*0.25, "y":point.y-tangent.y*0.25});
}




function sign(x) { return x > 0 ? 1 : x < 0 ? -1 : 0; }

function getInflexionPoints(A, B, C){
	var angle = getTangentAngle (A, B, C);

	//one side
	var BA = getDistance ({"x":A.x-B.x, "y":A.y-B.y});

	if (angle > 0){
		var ABiAngle = angle -
	}else {
		var ABiAngle = -Math.PI/2 - angle
 	}
	fl.trace (ABiAngle)

	var Bi = BA/Math.cos(ABiAngle);

	var pointI = {"x":Math.cos(angle + Math.PI)*Bi+B.x, "y":Math.sin(angle + Math.PI)*Bi+B.y}

	//other side

	var BC = getDistance ({"x":C.x-B.x, "y":C.y-B.y});

	if (angle > 0){
		var CBjAngle = -Math.PI/2 - angle
	}else {
		var CBjAngle = Math.PI/2 - angle
 	}
	fl.trace (CBjAngle)

	var Bj = BC/Math.cos(CBjAngle);

	var pointJ = {"x":Math.cos(angle)*Bj+B.x, "y":Math.sin(angle)*Bj+B.y}

	return [pointI, pointJ]
}*/
