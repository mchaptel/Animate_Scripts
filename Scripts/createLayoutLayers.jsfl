//Commande écrite par Mathieu Chaptel. Pour toute demande, m.chaptel@gmail.com

var doc = fl.getDocumentDOM();
var tl = doc.getTimeline();

var layers = ["body_OL", "hair", "nose", "face_details", "eyebrows", "eyes_lines", "eyes_white", "eyes_pupils", "eyes_white", "face", "body", "hair_UL", "head_UL", "body_UL"];

var parent = getParents(tl.layers[tl.currentLayer]);
parent = (parent.length != 0)? parent[0]:tl.layers[tl.currentLayer];

var character = parent.name;

if (character.indexOf("CH") != -1){
	parentIndex = tl.layers.indexOf(parent);
	var folder = tl.addNewLayer(character.replace("CH", "PO"), "folder", true);
	folder = tl.layers[folder]
	
	for (var i=0; i<layers.length; i++){
		var newL = tl.addNewLayer("PO_"+layers[i], "normal", false);
		tl.layers[newL].parentLayer = folder;
		
		if (layers[i] == "eyes_pupils"){
			tl.layers[newL-1].layerType = "mask"
			tl.layers[newL].parentLayer = tl.layers[newL-1]
			tl.layers[newL].layerType = "masked"
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