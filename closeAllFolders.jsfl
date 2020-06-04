//Commande écrite par Mathieu Chaptel. Pour toute demande, m.chaptel@gmail.com

var doc = fl.getDocumentDOM();
var tl = doc.getTimeline();
var parents = getParents(tl.layers[tl.currentLayer]);

for (var i=0; i<tl.layerCount; i++){
	if (tl.layers[i].layerType == "folder"){
		tl.expandFolder(false, true, i);
	}
}
var curLay = tl.currentLayer
tl.currentLayer = tl.layers.indexOf(parents[parents.length-1])

function getParents(layer){
	var parents =[];
	if (layer.parentLayer !== null){
		parents.push(layer.parentLayer)
		parents = parents.concat(getParents(layer.parentLayer));
	}
	return parents;
}