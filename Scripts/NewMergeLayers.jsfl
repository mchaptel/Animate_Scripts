//Commande écrite par Mathieu Chaptel. Pour toute demande, m.chaptel@gmail.com

fl.outputPanel.clear();
var doc = fl.getDocumentDOM();
var tl = doc.getTimeline();
var layers = tl.getSelectedLayers().sort(function (a, b) {return a - b;});
var layName = tl.layers[layers[0]].name;

//remove folders from selection
for (var l=layers.length-1; l>=0; l--){
	if (tl.layers[layers[l]].layerType == "folder") layers.splice(l,1);
}

//remember locked layers
var states = saveLayerStates();

//lock all layers except selected

var allLayers = []
for (var l=0;l<tl.layers.length;l++){
	allLayers.push(l)
}
setLayersProperties("locked", true , allLayers)
setLayersProperties("locked", false, layers)

// get all frames for new result layer
var frames = findKeyFrames(layers)
tl.currentLayer = tl.layers.length-1;
var mergedLayer = tl.addNewLayer(layName, "normal", false)

//insert Keyframes on all concerned layers
createKeyFrames(mergedLayer, frames);
for (var l=0;l<layers.length;l++){
	createKeyFrames(layers[l], frames);
}

//merge
for (var f=0;f<frames.length; f++){
	mergeFrame(frames[f],layers, mergedLayer);
}

restoreLayerStates(states);

//remove layers
var layIndex = layers[0];
for (var l=layers.length-1; l>=0; l--){
	tl.deleteLayer(layers[l]);
}

tl.reorderLayer(tl.layers.length-1, layIndex, true);


function mergeFrame(frame, layers, destLayer){
	tl.currentFrame = frame;
	tl.currentLayer = layers[0];
	setLayersProperties("locked", false , layers)
	setLayersProperties("locked", true, destLayer)
	doc.selectAll();
	if (doc.selection.length>0){
		doc.clipCopy();
		setLayersProperties("locked", true , layers)
		setLayersProperties("locked", false, destLayer)
		tl.currentLayer = destLayer;
		doc.clipPaste(true);
	}
}

function setLayersProperties(property, value, layers){
	for (var l=0;l<layers.length;l++){
		tl.layers[layers[l]][property] = value;
	}
}

function createKeyFrames(layer, frames){
	tl.currentLayer = layer
	for (var f=0;f<frames.length;f++){
		if (tl.layers[layer].frames[frames[f]].startFrame != frames[f]) tl.insertKeyframe(frames[f])
	}
}

function saveLayerStates(){
	var states = [];
	for (var l=0;l<tl.layers.length;l++){
		states.push([tl.layers[l].locked,tl.layers[l].locked]);	//locked, visible
	}
	return (states)
}

function restoreLayerStates(states){
	for (var l=0; l<tl.layers; l++){
		tl.layers[l].locked = states[l][0];
		tl.layers[l].visible = states[l][1];
	}
}

function findKeyFrames(layers){
	var keyframes = [];
	for (var l=0;l<layers.length;l++){
		layer = tl.layers[layers[l]];
		for (var i=0; i<layer.frames.length; i++){
			if (layer.frames[i].startFrame == i && keyframes.indexOf(i)== -1){
				keyframes.push(i);
			}
		}
	}
	keyframes.sort(function (a, b) {return a - b;});
	return keyframes;
}

