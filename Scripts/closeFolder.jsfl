//Commande écrite par Mathieu Chaptel. Pour toute demande, m.chaptel@gmail.com

var doc = fl.getDocumentDOM();
var tl = doc.getTimeline();
var sel = tl.getSelectedLayers().sort(function(a, b){return a-b});

if (sel.length<=1){
	var parents = [tl.layers[tl.currentLayer]]
	parents = parents.concat(getParents(tl.layers[tl.currentLayer]));
	
	var folderIndex;

	for (var i = 0; i<parents.length; i++){
		if (parents[i].layerType == "folder") {
			folderIndex = tl.layers.indexOf(parents[i]);
			break;
		}
	}
	tl.expandFolder(false, true, folderIndex);
	
}else{
	for (var i=sel.length-1; i>=0; i--){
		if (tl.layers[sel[i]].layerType == "folder"){
			tl.expandFolder(false, true, sel[i]);
		}
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