//Commande écrite par Mathieu Chaptel. Pour toute demande, m.chaptel@gmail.com

var doc = fl.getDocumentDOM();
var tl = doc.getTimeline();
var curLayer = tl.currentLayer;
var curFrame = tl.currentFrame;

prevKeyFrame = function (){
	var next = tl.currentFrame;
	if (tl.currentFrame != 0){
		for (i=tl.currentFrame-1; i>=0; i--){
			if (tl.layers[tl.currentLayer].frames[i].startFrame == i){
				next = tl.currentFrame-i;
				break;
			}		
		}
	}else {
		for (i=tl.frameCount-1; i>=0; i--){
			if (tl.layers[tl.currentLayer].frames[i].startFrame == i){
				next = tl.frameCount-i;
				break;
			}		
		}
	}
	return next;
}

nextFrame = prevKeyFrame();
symbol = tl.name;
doc.exitEditMode();

var frame = doc.getTimeline().currentFrame;

if (!EnterSymbolOnFrame(symbol, frame-nextFrame)) EnterSymbolOnFrame(symbol, frame)


function EnterSymbolOnFrame(symbolName, frame){
	var tl2 = doc.getTimeline()
	if (frame<0) return false
	tl2.setSelectedFrames(frame,frame,true);
	if (tl2.layers[tl2.currentLayer].frames[frame].tweenType == "motion" && tl2.layers[tl2.currentLayer].frames[frame].startFrame != frame) tl2.insertKeyframe();

	tl2.setSelectedFrames(frame,frame, true);
	sel = doc.selection;
	for (i in sel){
		if (sel[i].elementType == "instance" && sel[i].libraryItem.name == symbolName){
			item = sel[i];
			doc.selectNone();
			item.selected = true;
			break;
		}
		
	}
	if (doc.selection.length != 0){
		EnterInPlace(doc.selection[0], getFrame(doc.selection[0]));
		return (true)
	}else{
		return (false);
	}

}


// variables symbole sélectioné


function getFrame(symbol){
	
	var mcurrentFrame = doc.getTimeline().currentFrame;

	var mcurrentLayer = doc.getTimeline().currentLayer;

	var GraphDuration = symbol.libraryItem.timeline.frameCount-1;

	var GraphFirstFrame = symbol.firstFrame;

	var GraphStartFrame = doc.getTimeline().layers[mcurrentLayer].frames[mcurrentFrame].startFrame;



	//Calcule la position de la tête de lecture en fonction du type de lecture :

	var newFrame;

	switch (symbol.loop){

		case "single frame" : 

			newFrame = GraphFirstFrame;
			break;

		case "play once" :

			newFrame = GraphFirstFrame + (mcurrentFrame - GraphStartFrame) ;

			if (newFrame > GraphDuration) {
				newFrame = GraphDuration;
			};

			break;

		case "loop" : 

			newFrame = (GraphFirstFrame + (mcurrentFrame - GraphStartFrame)) % GraphDuration;

			break;
	};
	return newFrame;
}

// positionne la tête de lecture :


function EnterInPlace (symbol, frame){
		
	doc.enterEditMode('inPlace');
	
	if (symbol.symbolType == "graphic"){
		doc.getTimeline().currentFrame = frame;
	}

};