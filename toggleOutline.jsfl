//Commande écrite par Mathieu Chaptel. Pour toute demande, m.chaptel@gmail.com

var doc = fl.getDocumentDOM();
var tl = doc.getTimeline();


var layers = new Array();

var selectedLayers = tl.getSelectedLayers();

for (l = 0; l<selectedLayers.length; l++){
	layers.push(tl.layers[selectedLayers[l]]);
}


if (doc.selection.length>0){
	for (i in doc.selection){
		var l = 0
		while(true){
			if (doc.selection[i].layer == layers[l])break;
			if (l>layers.length){
				layers.push(doc.selection[i].layer);
				break;
			}
			l++;
		}
	}
}

for (i in layers){
	layers[i].outline = !layers[i].outline;
}





