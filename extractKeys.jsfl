//Commande écrite par Mathieu Chaptel. Pour toute demande, m.chaptel@gmail.com

var doc = fl.getDocumentDOM();
var tl = doc.getTimeline();

fl.outputPanel.clear();

var symbol = doc.selection[0];

if (doc.selection.length>0 && symbol.elementType == "instance" && symbol.symbolType == "graphic"){
	extractKeys(symbol);
}

function extractKeys(symbol){

	var startFrame = tl.layers[tl.currentLayer].frames[tl.currentFrame].startFrame;
	var endFrame = startFrame+ tl.layers[tl.currentLayer].frames[tl.currentFrame].duration;

	var keys = [];
	for (var i = startFrame; i<endFrame; i++){

		var symbolFrame = getSymbolFrameAtFrame(symbol, tl.currentLayer, i)

		//fl.trace(symbol+" "+symbolFrame+" "+hasKeyAtFrame(symbol, symbolFrame))

		if (hasKeyAtFrame(symbol, symbolFrame)){
			keys.push(i);
		}
	}

	for (var i=0; i<keys.length; i++){
		var frame = keys[i]
		if (tl.layers[tl.currentLayer].frames[frame].startFrame != frame) tl.insertKeyframe(frame);
	}
}

function hasKeyAtFrame(symbol, frame){
	var timeline = symbol.libraryItem.timeline;

	for (var i=0; i<timeline.layerCount; i++){
		if (timeline.layers[i].layerType != "folder" && timeline.layers[i].frames[frame].startFrame == frame) return true;
	}

	return false;

}

function getSymbolFrameAtFrame(symbol, layer, frame){

	var GraphDuration = symbol.libraryItem.timeline.frameCount-1;

	var GraphFirstFrame = symbol.firstFrame;

	var GraphStartFrame = tl.layers[layer].frames[frame].startFrame;

	//Calcule la position de la tête de lecture en fonction du type de lecture :

	var newFrame;

	switch (symbol.loop){

		case "single frame" :

			newFrame = GraphFirstFrame;
			break;

		case "play once" :

			newFrame = GraphFirstFrame + (frame - GraphStartFrame) ;

			if (newFrame > GraphDuration) {
				newFrame = GraphDuration;
			};

			break;

		case "loop" :

			newFrame = (GraphFirstFrame + (frame - GraphStartFrame)) % GraphDuration;

			break;
	};
	return newFrame;

}