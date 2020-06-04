//Commande écrite par Mathieu Chaptel. Pour toute demande, m.chaptel@gmail.com

var doc = fl.getDocumentDOM();
var tl = doc.getTimeline();

var sel = tl.getSelectedFrames();

var curFrame = tl.currentFrame;

fl.outputPanel.clear();

/*for (var i in sel){
	fl.trace(i+": "+sel[i]);
}*/

var cycles = askcycles();
if (cycles != null) cycleFrames(cycles[0],cycles[1],cycles[2],cycles[3]);

function cycleFrames(method, ammount, labels, shift){

	layers = [];

	for (var i=0; i<sel.length; i+=3){
		layers.push(sel[i]);
	}

	selLength = sel[2]-sel[1];
	
	if (method == "Nombre de cycle (0: jusqu\'a la fin de la scène) : "){
		if (ammount != 0){
			length = sel[2]+ammount*selLength;
		}else{
			length = tl.frameCount;
		}
	}else if (method == "Cycler jusqu\'a l\'image (non incluse) : "){
			length = parseInt(ammount)-1;
	}
	
	// look if the end frame is a key frame
	
	var keys = [];
	for (var l in layers){
		tl.currentLayer = layers[l];
		if (tl.layers[tl.currentLayer].layerType != "folder" && length<tl.layers[tl.currentLayer].frameCount && tl.layers[tl.currentLayer].frames[length].startFrame == length) keys.push(layers[l]);
	}
	//fl.trace(keys);
	
	tl.copyFrames();

	var cycleCount = 0;

	//cycle selected frames until the end of the layer
	for (var i= sel[2]; i<=length; i+= selLength){
		var replace = true
		for (var l in layers){
			tl.currentLayer = layers[l];
			tl.setSelectedFrames(i, i, replace);
			replace = false;
		}
		
		tl.insertFrames();
		tl.pasteFrames();
		cycleCount += 1;
		
		
		if (labels == true){
			//add label
			for (var l in layers){
				if (tl.layers[layers[l]].layerType !="folder"){
					tl.currentLayer = layers[l];
					tl.layers[layers[l]].frames[i].labelType = "comment";
					tl.layers[layers[l]].frames[i].name = cycleCount;
					replace = false;
				}
			}
		}
		
	}

	cycleCount = cycleCount*selLength;
	
	if (shift==false){
		//cut extra frames
		var replace = true
		for (var l in layers){
			tl.currentLayer = layers[l];
			tl.setSelectedFrames(length, length+cycleCount, replace);
			replace = false;
		}
	}else{
		var replace = true
		for (var l in layers){
			tl.currentLayer = layers[l];
			tl.setSelectedFrames(length, sel[2]+cycleCount, replace);
			replace = false;
		}
	}
	
	tl.removeFrames();
	
	/*
	//remove End Keyframe
	
		for (var l in layers){
			tl.currentLayer = layers[l];
			tl.setSelectedFrames(length, length, true);
			if (keys.indexOf(layers[l]) == -1) tl.clearKeyframes();
		}*/


	
	//select Range
	var replace = true
	for (var l in layers){
		tl.currentLayer = layers[l];
		tl.setSelectedFrames(sel[2], length, replace);
		replace = false;
	}
	
}


function showXMLPanel(xmlString)
{
  var tempUrl = fl.configURI + "Commands/temp-dialog-" + parseInt(777 * 777) + ".xml"
  FLfile.write(tempUrl, xmlString);
  var xmlPanelOutput = fl.getDocumentDOM().xmlPanel(tempUrl);
  FLfile.remove(tempUrl);
  return xmlPanelOutput;
}

function askcycles(){
	var dialogXML = "";

	dialogXML += '<dialog title="Cycler les images" buttons="accept, cancel">';
	dialogXML +=       '<radiogroup id="radiogroup">'
	dialogXML +=         '<radio id="1" label="Nombre de cycle (0: jusqu\'a la fin de la scène) : "/>'
	dialogXML +=         '<radio id="2" label="Cycler jusqu\'a l\'image (non incluse) : "/>'
	dialogXML +=       '</radiogroup>'
	dialogXML +=       '<popupslider id="slider" minvalue="0" maxvalue="100" width="300"/> ';
	dialogXML +=       '<checkbox label="Ajouter étiquettes d\'images" id="labels" checked="true" /> ';
	dialogXML +=       '<checkbox label="Décaler les images suivantes" id="shift" checked="false"/> ';
	dialogXML += '</dialog>';

	var xmlPanelOutput = showXMLPanel(dialogXML);

	if (xmlPanelOutput.dismiss == "accept") // user confirms dialog
	{
		
		return ([xmlPanelOutput.radiogroup, xmlPanelOutput.slider, eval(xmlPanelOutput.labels), eval(xmlPanelOutput.shift)]);

	}else{
		return (null);
	}
}

