//Commande écrite par Mathieu Chaptel. Pour toute demande, m.chaptel@gmail.com

doc = fl.getDocumentDOM();
tl = doc.getTimeline();

sel = tl.getSelectedFrames();

curFrame = tl.currentFrame;

/*for (var i in sel){
	fl.trace(i+": "+sel[i]);
}*/

var cycles = askcycles();
if (cycles != null) cycleFrames(cycles)

function cycleFrames(ammount){

	layers = [];

	for (var i=0; i<sel.length; i+=3){
		layers.push(sel[i]);
	}

	selLength = sel[2]-sel[1];

	if (ammount != 0){
	length = sel[1]+ammount*selLength;
	}else{
	length = tl.frameCount;
	}

	tl.copyFrames();

	//cycle selected frames until the end of the layer
	for (var i= sel[1]; i<=length; i+= selLength){
		var replace = true
		for (var l in layers){
			tl.currentLayer = layers[l];
			tl.setSelectedFrames(i, i+selLength, replace);
			replace = false;
		}
		tl.pasteFrames();
	}

	//cut extra frames
	var replace = true
	for (var l in layers){
		tl.currentLayer = layers[l];
		tl.setSelectedFrames(length, tl.frameCount, replace);
		replace = false;
	}

	tl.removeFrames();

	tl.setSelectedFrames(curFrame, curFrame, true)

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
	dialogXML += '<dialog title="Create Cycle" buttons="accept, cancel">';
	dialogXML +=   '<hbox>';
	dialogXML +=     '<label value="nombre de cycle (0: jusq\'a la fin) : "/>';
	dialogXML +=     '<popupslider id="slider" minvalue="0" maxvalue="9999" width="100"/> ';
	dialogXML +=   '</hbox>';
	dialogXML += '</dialog>';

	var xmlPanelOutput = showXMLPanel(dialogXML);

	if (xmlPanelOutput.dismiss == "accept") // user confirms dialog
	{

		return (xmlPanelOutput.slider);

	}else{
		return (null);
	}
}

