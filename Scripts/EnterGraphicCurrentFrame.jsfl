//Commande écrite par Mathieu Chaptel. Pour toute demande, m.chaptel@gmail.com


// variables génériques :


var doc = fl.getDocumentDOM();

var mcurrentFrame = doc.getTimeline().currentFrame;

var mcurrentLayer = doc.getTimeline().currentLayer;




if (doc.selection.length == 1)  {
	INSTANCEFrameEntered = 0;
	EnterInPlace (doc.selection[0])
}else{
	alert("Can't enter graphic. Please make sure only one graphic is selected.")
}

// variables symbole sélectioné


function getFrame(symbol){
	

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


function EnterInPlace (symbol){
		
	var frame = 0;
	
	if (symbol.elementType == "instance")	frame = getFrame(symbol);
	
	doc.enterEditMode('inPlace');
	
	if (symbol.symbolType == "graphic") doc.getTimeline().currentFrame = StoreEnteredFrame(frame);

};

function StoreEnteredFrame(frame){
	INSTANCEFrameEntered = frame
	return frame
}