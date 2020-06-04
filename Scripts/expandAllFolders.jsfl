//Commande écrite par Mathieu Chaptel. Pour toute demande, m.chaptel@gmail.com

var doc = fl.getDocumentDOM();
var tl = doc.getTimeline();
var sel = tl.getSelectedLayers().sort(function(a, b){return a-b});

for (var i=sel.length-1; i>=0; i--){
	if (tl.layers[sel[i]].layerType == "folder"){
		tl.expandFolder(true, true, sel[i]);
	}
}

tl.currentLayer = tl.getSelectedFrames()[0]