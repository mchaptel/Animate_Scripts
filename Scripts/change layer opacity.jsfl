//Commande écrite par Mathieu Chaptel. Pour toute demande, m.chaptel@gmail.com


// Extension to change a layer's opacity

//declare variables

var doc = fl.getDocumentDOM();
fl.outputPanel.clear()

var timeline = doc.getTimeline();
var curLayer = timeline.currentLayer;
var frameArray = findKeyframes(curLayer);
var n = frameArray.length;
var curFrame = timeline.currentFrame;
var alpha = null;
var locked = timeline.layers[curLayer].locked;
timeline.layers[curLayer].locked = false;

// save user color

var color = doc.getCustomFill("toolbar");

//read current alpha (skip to first image with content)

for (var readframe=0; readframe<n; readframe++){

	timeline.setSelectedFrames(frameArray[readframe], frameArray[readframe] , true);

	//exclude instances
	sel = doc.selection;
	//vfl.trace (n+" "+sel.length)
	if (sel.length>0){
		for (var i=0; i<sel.length; i++){
			//fl.trace (sel[i].elementType+" "+sel[i].isGroup+" "+sel[i].isDrawingObject)
			alpha = findAlpha(sel[i]);
			//fl.trace (alpha)
			if (alpha != null) break;
		}

	}
	if (alpha != null) break;
}

function findAlpha(item){
	var alpha;
	if (item.elementType == "instance"){
		alpha = item.colorAlphaPercent;
	}else if(item.elementType == "shape"){
		if (item.isGroup){
			for (var m in item.members){
				alpha = findAlpha(item.members[m]);
				if (alpha != null) break;
			}
		}else{
			var fill;
			var stroke;
			for (f in item.contours){
				if (item.contours[f].interior && item.contours[f].fill.color != undefined){
					fill = item.contours[f].fill;
					alpha = fill.color.substring(7,9);
					if (alpha=="")	alpha = "FF";
					break;
				}
			}

			if (alpha === undefined){
				for (e in item.edges){
					if (item.edges[e].stroke.color != undefined){
						stroke = item.edges[e].stroke;
						alpha = stroke.color.substring(7,9);
						if (alpha=="")	alpha = "FF";
						break;
					}
				}
			}

			//var fill = doc.getCustomFill("selection")
			//var stroke = doc.getCustomStroke("selection")
			if (typeof fill != "undefined"){
				alpha = fill.color.substring(7,9);
				if (alpha=="")	alpha = "FF";

			} else if (typeof stroke != "undefined"){
				alpha = stroke.color.substring(7,9);
				if (alpha=="")	alpha = "FF";
			}
		}
	}
	return alpha;
}

function findKeyframes (layer){
	FramesArray = new Array();
	for (i=0; i<timeline.layers[layer].frameCount; i++){
		if (i == timeline.layers[layer].frames[i].startFrame) FramesArray.push(i)
	}
	return (FramesArray);
}

function askForValue(alpha){

//prompt new value

	var dialogXML = "";
	dialogXML += '<dialog title="Apply Layer Opacity (current: '+hexToPercent(alpha)+'%)" buttons="accept, cancel">';
	dialogXML +=   '<hbox>';
	dialogXML +=     '<label value="New value : "/>';
	dialogXML +=     '<popupslider id="slider" minvalue="1" maxvalue="100" width="100"/> ';
	dialogXML +=     '<script> ';
	dialogXML +=     '        fl.xmlui.set("slider", "'+hexToPercent(alpha)+'" );   ';
	dialogXML +=     '</script> ';
	dialogXML +=   '</hbox>';
	dialogXML +=     '<checkbox label="Include lines (slower)" id="lines" checked="false" /> ';
	dialogXML += '</dialog>';

	var xmlPanelOutput = showXMLPanel(dialogXML);

	if (xmlPanelOutput.dismiss == "accept") // user confirms dialog
	{
		newalpha = percentToHex(xmlPanelOutput.slider);

	}else{
		newalpha = null;
	}
	return ([newalpha, xmlPanelOutput.lines]);
}


// apply

timeline.currentFrame = curFrame;

if (typeof alpha !== "undefined"){
	var dialog = askForValue(alpha);
	var newalpha = dialog[0]
	var lines = eval(dialog[1]);
	//fl.trace(lines)
}else{
	alert ("le calque est vide");
}

if (newalpha == null){
	// cancelled, do nothing
} else {
	for (var j=0; j<n; j++) {
		doc.selectNone();
		timeline.setSelectedFrames(frameArray[j], frameArray[j] , true);

		//exclude instances
		var sel = doc.selection;
		for (var i=0; i<sel.length; i++){
			changeColorAlpha(sel[i], lines, newalpha)
		}

	}
}

// reset user color

doc.selectNone();
doc.setCustomFill(color);
timeline.currentFrame = curFrame;
timeline.layers[curLayer].locked = locked;


function showXMLPanel(xmlString)
{
  var tempUrl = fl.configURI + "Commands/temp-dialog-" + parseInt(777 * 777) + ".xml"
  FLfile.write(tempUrl, xmlString);
  var xmlPanelOutput = fl.getDocumentDOM().xmlPanel(tempUrl);
  FLfile.remove(tempUrl);
  return xmlPanelOutput;
}

function changeColorAlpha(element, lines, alpha){
	if (element.elementType == "instance" && element.instanceType=="symbol"){
		//fl.trace (element.instanceType)
		element.colorAlphaPercent = hexToPercent(newalpha)
	}else if (element.elementType == "shape"){
		if (element.isGroup){
			//fl.trace("group members"+element.members[0].contours.length);
			for (var e in element.members){
				changeColorAlpha(element.members[e], alpha);
			}
		}
		for (var k = 0; k < element.contours.length; k++) {
			var c = element.contours[k];
			if (c.interior && c.fill && c.fill.style == 'solid') {
				var fill = c.fill;
				fill.color = c.fill.color.substring(0,7)+alpha;
				c.fill = fill;
			}
		}
		if (lines){
			for (var e= 0; e<element.edges.length; e++){
				var c = element.edges[e];
				if (typeof c.stroke.color !== "undefined"){
					var stroke = c.stroke;
					stroke.color = c.stroke.color.substring(0,7)+alpha;
					c.stroke = stroke;
				}
			}
		}
	}
}

function percentToHex (percent){
	var result = (Math.round((percent/100)*255)).toString(16)
	if (result.length==1) result = 0+result;
	return result
}

function hexToPercent (hex){
	return Math.round((parseInt(hex, 16)/255)*100)
}