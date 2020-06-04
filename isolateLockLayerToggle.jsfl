//Commande écrite par Mathieu Chaptel. Pour toute demande, m.chaptel@gmail.com

doc = fl.getDocumentDOM();
tl = doc.getTimeline();

fl.outputPanel.clear();

var Ltoggle = eval(doc.getDataFromDocument(tl.name+"_Ltoggle"));

if (typeof Ltoggle !== 'boolean'){
	Ltoggle = true; // true = store values and activate solo mode, false = restore stored values
}

if (Ltoggle){
	// storing value
	var lockedLayers = StoreLocked(tl.name);
	doc.addDataToDocument(tl.name+"_curLockedLayer", "integer", tl.currentLayer);
	
	Ltoggle = !Ltoggle;
	doc.addDataToDocument(tl.name+"_Ltoggle", "string", Ltoggle);
	ToggleLocked(lockedLayers, Ltoggle);
	

} else{
	// restoring
	var curLockedLayer = doc.getDataFromDocument(tl.name+"_curLockedLayer");
	if (tl.currentLayer == curLockedLayer){
		// if on original layer, restore
		var lockedLayers = getArray(tl.name+"_locked");
		Ltoggle = !Ltoggle;
		doc.addDataToDocument(tl.name+"_Ltoggle", "string", Ltoggle);
		ToggleLocked(lockedLayers, Ltoggle);

	} else {
		doc.addDataToDocument(tl.name+"_curLockedLayer", "integer", tl.currentLayer);
		// if layer changed, only unlock current one
		layers = Array(tl.layerCount)
		for (var i=0; i<layers.length; i++){
			layers[i] = i
		}
		ToggleLocked(layers, false)
	}
}


//fl.trace("turn layers "+lockedLayers+" visibility: "+toggle)


function StoreLocked(prefix){ 
	var layers = [];
	for (var l=0; l<tl.layers.length; l++){
		if (tl.layers[l].locked == false) layers.push(l);
	}
	saveArray(layers, prefix+"_locked")
	return (layers);
}

function ToggleLocked(layers, locked){
	for (var l=0; l<layers.length; l++){
		if (tl.layers[layers[l]].layerType != "folder") tl.layers[layers[l]].locked = !locked;
	}
	tl.layers[tl.currentLayer].locked = false;
}

function saveArray(array, name){
	doc.addDataToDocument(name, "string", array.join("|"))
}
	
function getArray(name){
	var array = doc.getDataFromDocument(name)
	if(typeof array != "string") return null;
	return (array.split("|"))
}