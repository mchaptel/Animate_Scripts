//Commande écrite par Mathieu Chaptel. Pour toute demande, m.chaptel@gmail.com

var doc = fl.getDocumentDOM();
var tl = doc.getTimeline();
var frameSel = tl.getSelectedFrames();
if (frameSel != ""){
	var layerIndex = tl.getSelectedFrames()[0];	
}else{
	layerIndex = tl.currentLayer;
}
var layer = tl.layers[layerIndex];
var parents = getParents(layer);

for (var i=0; i<parents.length; i++){
	if (parents[i].layerType == "folder"){
		tl.expandFolder(true, false, tl.layers.indexOf(parents[i]));
	}
}

tl.currentLayer = layerIndex;

function getParents(layer){
	var parents = [];
	if (layer.parentLayer !== null){
		parents.push(layer.parentLayer)
		parents = parents.concat(getParents(layer.parentLayer));
	}
	return parents;
}