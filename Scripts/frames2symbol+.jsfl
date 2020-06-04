//Commande écrite par Mathieu Chaptel. Pour toute demande, m.chaptel@gmail.com

fl.outputPanel.clear();

var doc = fl.getDocumentDOM();
var tl = doc.getTimeline();
var lib = doc.library
var sel = tl.getSelectedFrames();
var selLayers = getLayers();

var symbolName = getName();

if (symbolName != null){
	equaliseLayersLength(selLayers)
	copyFramesIntoSymbol(symbolName);
	cleanupLayers();
}

function getName(){
	while(true){
		symbolName = prompt("Symbol Name?",getNextFreeName());
		if (!lib.itemExists(symbolName)){
			return(symbolName)
		}else{
			alert("This name is already used.")
		}
	}
}

function getLayers(){
	var layers = [];
	for (var i=0; i<sel.length; i+=3){
		if (layers.indexOf(sel[i]) == -1) layers.push(sel[i]);
	}
	return (layers.sort(function (a, b){return (a-b)}));
}


function getNextFreeName(){
	var counter = 1;
	while(true){
		var name = "Symbole "+counter
		if (!lib.itemExists(name)) return name;
		counter++;
	}
}

function copyFramesIntoSymbol(symbolName){
	
	tl.cutFrames();
	
	lib.addNewItem("graphic", symbolName);
	var symbolTl = lib.getSelectedItems()[0].timeline;
	
	/*
	var destSymbol = replaceFramesBySymbol(sel, symbolName);
	
	//var tlIndex = doc.currentTimeline;
	//lib.editItem(symbolName);
	
	doc.selection = [destSymbol]
	doc.enterEditMode("inPlace");
	var symbolTl = doc.getTimeline();
	symbolTl.setSelectedFrames(0,0)
	*/
	symbolTl.pasteFrames(0,0);
	
	for (var l=0; l<selLayers.length; l++){
		symbolTl.layers[l].locked = tl.layers[selLayers[l]].locked
		symbolTl.layers[l].outline = tl.layers[selLayers[l]].outline
		symbolTl.layers[l].color = tl.layers[selLayers[l]].color
		//symbolTl.layers[l].name = tl.layers[selLayers[l]].name
		//symbolTl.layers[l].layerType = tl.layers[selLayers[l]].layerType
		symbolTl.layers[l].visible = tl.layers[selLayers[l]].visible
	}
	
	//doc.exitEditMode()
	replaceFramesBySymbol(sel, symbolName)
}

function replaceFramesBySymbol(sel, symbolName){
	tl.currentLayer = tl.layerCount-1;
	var destLayer = tl.addNewLayer(symbolName, "normal", false)
	tl.layers[destLayer].parentLayer = null;

	tl.currentLayer = destLayer;
	var min = sel[1]
	var max = sel[sel.length-1]

	if (tl.layers[destLayer].frames[min].startFrame != min) tl.insertKeyframe(min)
	if (tl.layers[destLayer].frameCount > max && tl.layers[destLayer].frames[max].startFrame != max) tl.insertKeyframe(max)

	tl.currentFrame = min;
	
	lib.addItemToDocument({x:0, y:0} , symbolName)
	
	var symbol = tl.layers[destLayer].frames[min].elements[0];
	
	if (!lib.itemExists(tl.name)){
		var position = transformPoint({x:doc.width/2, y:doc.height/2}, fl.Math.invertMatrix(doc.viewMatrix));
		symbol.x = position.x;
		symbol.y = position.y;
	}else{
		symbol.x = 0;
		symbol.y = 0;
	}
	
	//tl.reorderLayer(destLayer, selLayers[0], true)
	return (tl.layers[destLayer].frames[min].elements[0])
}

function transformPoint( pt,  mat ){
	var x = pt.x*mat.a + pt.y*mat.c + mat.tx;
	var y = pt.x*mat.b + pt.y*mat.d + mat.ty;
	
	return {"x":x, "y":y};
}

function equaliseLayersLength(layers){
	
	//fix for a bug where copying frames doesn't work if they have different lengths
	
	//fl.trace (layers)
	var length = 0;
	shortLayers = []
	for (var i=0; i<sel.length; i+=3){
		if (tl.layers[sel[i]].frameCount > length) length = sel[i+2];
	}
	for (var i=0; i<sel.length; i+=3){
		if (tl.layers[sel[i]].frameCount < length){
			shortLayers.push(sel[i]);
			sel[i+2] = length;
		}
	}
	if(shortLayers.length>0){
		for (var l=0; l<shortLayers.length; l++){
			if (tl.layers[shortLayers[l]].layerType !="folder" && tl.layers[shortLayers[l]].frameCount < length) {
				tl.currentLayer = shortLayers[l];
				tl.insertBlankKeyframe(tl.layers[shortLayers[l]].frameCount);
				tl.insertFrames(length-tl.layers[shortLayers[l]].frameCount, false, tl.layers[shortLayers[l]].frameCount-1);
			}
		}
		doc.selectNone();
		for (var i=0; i<sel.length; i+=3){
			tl.setSelectedFrames([sel[i], sel[i+1], length], false)
		}
	}
}


function cleanupLayers(){
	
	var layersToDelete = [];
	var index = selLayers[0];
	for (var l=selLayers.length-1; l>=0; l--){
		
		//add all non folders with no frames left
		
		if (tl.layers[selLayers[l]].layerType != "folder" && sel[1] == 0 && sel[sel.length-1] >= tl.layers[selLayers[l]].frameCount) layersToDelete.push(selLayers[l])
		
		if (tl.layers[selLayers[l]].layerType == "folder"){
			
			// create a list of child layers per folder present in selection
			
			var children = [];
			for (var i = selLayers[l]; i<tl.layerCount; i++){
				//fl.trace("layer: "+i+";parent: "+tl.layers[i].parentLayer+"; folder:"+tl.layers[selLayers[l]])
				//fl.trace(tl.layers[selLayers[l]] == tl.layers[i].parentLayer)
				if(tl.layers[selLayers[l]] == tl.layers[i].parentLayer) children.push(i);
			}
				//check child layers for non deleted layers
			for (var i = children.length-1; i>=0 ; i--){
				if (layersToDelete.indexOf(children[i]) != -1) children.splice(i,1);
			}
			//fl.trace("layers to delete:"+layersToDelete+" layer being examined:"+selLayers[l]+" children:"+children)
			if (children.length == 0) layersToDelete.push(selLayers[l])
		}
	}
	for (var l=0;l<layersToDelete.length; l++){
		tl.deleteLayer(layersToDelete[l]);
	}
	tl.reorderLayer(tl.layerCount-1, index, true)
	tl.currentLayer = index;
}