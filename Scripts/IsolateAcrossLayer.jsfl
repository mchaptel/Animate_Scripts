//Commande écrite par Mathieu Chaptel. Pour toute demande, m.chaptel@gmail.com

doc = fl.getDocumentDOM();
tl = doc.getTimeline();

sel = doc.selection;
ly = tl.currentLayer;
fr = tl.currentFrame;

fl.outputPanel.clear();

var items = [];

for (var e=0; e<sel.length; e++){
	if (sel[e].elementType == "instance"){
		items.push(sel[e].libraryItem);
		var layerName = sel[e].libraryItem.name.split("/").pop()+"_symbolLayer"
		if (findLayerByName (layerName) == false) tl.addNewLayer(layerName, "normal", false);
	}
}

tl.currentLayer = ly;
var frames = tl.layers[ly].frames;

for (var f=0; f<frames.length; f+=frames[f].duration){
	
	tl.currentFrame = f;
	var elements = frames[f].elements.map(function(x){return (x.elementType == "instance")? x.libraryItem : null})
	
	for (var i=0; i<items.length; i++){
		var layerName = items[i].name.split("/").pop()+"_symbolLayer"

		var element = elements.indexOf(items[i])		
		if (element != -1){
			moveToLayer(tl.layers[ly].frames[f].elements[element], findLayerByName(layerName));
		}else{
			tl.currentLayer = findLayerByName(layerName)
			if (tl.layers[tl.currentLayer].frames[f].startFrame != f) tl.insertBlankKeyframe(f);
		}

	}
}

function moveToLayer(element, layer){
	doc.selectNone();
	
	tl.setSelectedLayers(ly, true);
	
	doc.selection = [element]
	
	if (doc.selection.length>0){
		
		doc.clipCut();
		
		tl.setSelectedLayers(layer)
		
		//fl.trace("keyframe?"+tl.layers[layer].frames[tl.currentFrame].startFrame == tl.currentFrame)
		
		if (tl.layers[tl.currentLayer].frames[tl.currentFrame].startFrame != tl.currentFrame) tl.insertBlankKeyframe();		
		doc.clipPaste(true);
		tl.currentLayer = ly;
		
		return (true)
		
	}else{
		if (tl.layers[tl.currentLayer].frames[tl.currentFrame].startFrame != tl.currentFrame) tl.insertBlankKeyframe();
	}
	
	return(false)
	
}

function findLayerByName(name){
	for (var l=0; l<tl.layers.length; l++){
		if (tl.layers[l].name == name)return (l)
	}
	return (false);
}