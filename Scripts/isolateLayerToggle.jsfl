//Commande écrite par Mathieu Chaptel. Pour toute demande, m.chaptel@gmail.com

doc = fl.getDocumentDOM();
tl = doc.getTimeline();

fl.outputPanel.clear();

var toggle = eval(doc.getDataFromDocument(tl.name+"_toggle"));

if (typeof toggle !== 'boolean'){
	toggle = true;// true = store values and activate solo mode, false = restore stored values
}

if (toggle){
	var visibleLayers = StoreVisibility(tl.name);
	var curVisibleLayer = tl.currentLayer;
	doc.addDataToDocument(tl.name+"_curVisibleLayer", "integer", tl.currentLayer);
	
	toggle = !toggle;
	doc.addDataToDocument(tl.name+"_toggle", "string", toggle);
	ToggleVisible(visibleLayers, toggle);
	
} else{
	var visibleLayers = getArray(tl.name+"_visibility");
	var curVisibleLayer = doc.getDataFromDocument(tl.name+"_curVisibleLayer");
	if (curVisibleLayer == tl.currentLayer){
		toggle = !toggle;
		doc.addDataToDocument(tl.name+"_toggle", "string", toggle);
		ToggleVisible(visibleLayers, toggle);
	}else{
		doc.addDataToDocument(tl.name+"_curVisibleLayer", "integer", tl.currentLayer);
		layers = Array(tl.layerCount)
		for (var i=0; i<layers.length; i++){
			layers[i] = i
		}
		ToggleVisible(visibleLayers, false);
	}
}


function StoreVisibility(prefix){ 
	var layers = [];
	for (var l=0; l<tl.layers.length; l++){
		if (tl.layers[l].visible == true) layers.push(l);
	}
	saveArray(layers, prefix+"_visibility")
	return (layers);
}

function ToggleVisible(layers, visible){
	for (var l=0; l<layers.length; l++){
		if (tl.layers[layers[l]].layerType != "folder") tl.layers[layers[l]].visible = visible;
	}
	tl.layers[tl.currentLayer].visible = true;
}

function saveArray(array, name){
	doc.addDataToDocument(name, "string", array.join("|"))
}
	
function getArray(name){
	var array = doc.getDataFromDocument(name)
	if(typeof array != "string") return null;
	return (array.split("|"))
}