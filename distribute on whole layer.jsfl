//Commande écrite par Mathieu Chaptel. Pour toute demande, m.chaptel@gmail.com


doc = fl.getDocumentDOM();
tl = doc.getTimeline();
fl.outputPanel.clear();


var curLayerName = tl.layers[tl.currentLayer].name;
var curLayer = tl.currentLayer;
var curFrame = tl.currentFrame;
var frameArray = tl.layers[tl.currentLayer].frames;
var n = frameArray.length;


getActualSelectedFrames = function(){
	var frames = tl.getSelectedFrames();
	var actualFrames = new Array();
	for (i = 0; i<frames.length/3; i++){
		var startFrame = frames[i+1];
		var endFrame = frames[i+2];
		for (j = startFrame; j<endFrame; j++){
			actualFrames.push(j);
		}
	}
	return actualFrames;
}

selectLayerByName = function (name){
	tl.setSelectedLayers(findLayerByName(name), true);
}

findLayerByName = function(name){

	for (k=0; k<tl.layers.length; k++){
		if (name == tl.layers[k].name){
			return(k);
		}
	}
	return (null);
}


main = function (){

	//tl.setSelectedFrames(tl.currentFrame,tl.currentFrame,true);
	var Items = doc.selection;
	var layerNames = [];
	
	for (j in Items){

		var myClip = Items[j];

		if (myClip.elementType =="instance"){

			doc.selectNone();
			doc.selection = [myClip];
			doc.clipCut();

			var name = curLayerName+"/"+myClip.libraryItem.name;
			
			//fl.trace(name+": "+findLayerByName(name));
	
			if (findLayerByName(name) == null) tl.addNewLayer(name, "normal", true);

			selectLayerByName(name);
			
			if (tl.layers[tl.currentLayer].locked) tl.layers[tl.currentLayer].locked = false;
			if (tl.layers[tl.currentLayer].frames[tl.currentFrame] != tl.layers[tl.currentLayer].frames[tl.currentFrame].startFrame){
				tl.insertBlankKeyframe();
			}

		doc.clipPaste(true);
		layerNames.push(name);
		}
	}
	
	return (layerNames);
}

var sel = getActualSelectedFrames();
var destLayers = [];


//execute distribution

if (tl.layers[tl.currentLayer].frames[sel[0]].startFrame!=sel[0]) tl.insertKeyframe(sel[0]);
if (tl.frameCount < sel[sel.length-1]){
	if (tl.layers[tl.currentLayer].frames[sel[sel.length-1]+1].startFrame!=sel[sel.length-1]+1) tl.insertKeyframe(sel[sel.length-1]+1);
}

for (var i in sel){

	if (tl.layers[tl.currentLayer].locked==true)tl.layers[tl.currentLayer].locked = false;
	
	if (tl.layers[tl.currentLayer].frames[sel[i]].startFrame ==sel[i]){
		tl.setSelectedFrames(sel[i], sel[i], true);
		
		var newLayers = main();
		for (var j in newLayers){
			if (destLayers.indexOf(newLayers[j]) == -1) destLayers.push(newLayers[j]);
		}
		selectLayerByName(curLayerName);
	}
}

//end with a blank keyframe
if (tl.frameCount < sel[sel.length-1]){
	for (var i in destLayers){
		//fl.trace (i+": "+destLayers[i]);
		selectLayerByName(destLayers[i]);
		tl.currentFrame = sel[sel.length-1]+1;
		tl.insertBlankKeyframe();  
	}	
	}

//create folder if not existing
if (findLayerByName(curLayerName+"_elements")==null) {
	tl.addNewLayer(curLayerName+"_elements", "folder", true);
	tl.reorderLayer(findLayerByName(curLayerName+"_elements"),findLayerByName(destLayers[0]), true);
}
	
for (var i in destLayers){
	
	//selectLayerByName(destLayers[i]);
	
	//group all new layers
	fol = findLayerByName(curLayerName+"_elements");
	tl.layers[findLayerByName(destLayers[i])].parentLayer = tl.layers[fol];
		
}


