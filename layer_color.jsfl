//Commande écrite par Mathieu Chaptel. Pour toute demande, m.chaptel@gmail.com

doc = fl.getDocumentDOM();
tl = doc.getTimeline();

if (tl.layers[tl.currentLayer].layerType != "folder"){
	layerColor = hexToPercent(tl.layers[tl.currentLayer].color);

	//xmlpanel = fl.getDocumentDOM().xmlPanel(fl.configURI+'Commands/layer_grey.xml');

	 // create an XUL with JSFL
	var dialogXML = "";
	dialogXML += '<dialog title="Change Layer Grey Shade" buttons="accept, cancel">';
	dialogXML +=   '<hbox>';
	dialogXML +=     '<label value="new value ? (current: '+layerColor+') : "/>';
	dialogXML +=     '<popupslider id="slider" minvalue="0" maxvalue="100" width="100"/> ';
	dialogXML +=     '<script> ';
	dialogXML +=     '        fl.xmlui.set("slider", "0" );   ';
	dialogXML +=     '</script> ';
	dialogXML +=   '</hbox>';
	dialogXML += '</dialog>';

	var xmlPanelOutput = showXMLPanel(dialogXML);

	if (xmlPanelOutput.dismiss == "accept") // user confirms dialog
	{
		var color = percentToHex(xmlPanelOutput.slider)
		var newColorCode = "#"+color+color+color
		var layers = tl.getSelectedLayers();
		for (var l=0; l<layers.length; l++){
			var layer = tl.layers[layers[l]];
			if (layer.layerType != "folder") layer.color = newColorCode;
		}
		//for (var prop in xmlpanel) {
			//fl.trace(prop + " = " + xmlPanelOutput[prop]);
		//}
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

function percentToHex (percent){
	return (255-Math.round((percent/100)*255)).toString(16)
}

function hexToPercent (hex){
	return 100-Math.round((parseInt((hex).slice(5,7), 16)/255)*100)
}
