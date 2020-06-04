//Commande écrite par Mathieu Chaptel. Pour toute demande, m.chaptel@gmail.com

var doc = fl.getDocumentDOM();
var tl = doc.getTimeline();

var parents = [tl.layers[tl.currentLayer]];
parents = parents.concat(getParents(tl.layers[tl.currentLayer]));

var folderIndex;

for (var i = 0; i<parents.length; i++){
	if (parents[i].layerType == "folder") {
		folderIndex = tl.layers.indexOf(parents[i]);
		break;
	}
}

var replaceSel = true; 

for (var i=folderIndex+1; i<tl.layers.length; i++){
	var layerParents = getParents(tl.layers[i]);
	if (layerParents.indexOf(tl.layers[folderIndex])!= -1){
		tl.currentLayer = i;
		tl.setSelectedFrames(tl.currentFrame, tl.currentFrame, replaceSel);
		replaceSel = false;
	}
}

function getParents(layer){
	var parents = [];
	if (layer.parentLayer !== null){
		parents.push(layer.parentLayer)
		parents = parents.concat(getParents(layer.parentLayer));
	}
	return parents;
}