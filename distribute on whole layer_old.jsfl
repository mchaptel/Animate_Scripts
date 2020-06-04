//Commande écrite par Mathieu Chaptel. Pour toute demande, m.chaptel@gmail.com

doc = fl.getDocumentDOM();
tl = doc.getTimeline();

var curLayerName = tl.layers[tl.currentLayer].name;
var curFrame = tl.currentFrame;
var frameArray = tl.layers[tl.currentLayer].frames;
var n = frameArray.length;

selectLayerByName = function (name){
	tl.setSelectedLayers(findLayerByName(name), true);
}

findLayerByName = function(name){

	layersNames = new Array();

	for (l in tl.layers){
		layersNames.push(tl.layers[l].name);
	}

	for (k=0; k<=layersNames.length; k++){
		if (name == layersNames[k]){
			return(k);
		}
	}
	return ("null");
}


main = function (){


	//tl.setSelectedFrames(tl.currentFrame,tl.currentFrame,true);
	Items = doc.selection;

	for (j in Items){

		myClip = new Array();
		myClip.push(Items[j]);

		if (myClip[0].elementType =="instance"){

			doc.selectNone();
			doc.selection = myClip;
			doc.clipCut();

			name = myClip[0].libraryItem.name;

			if (findLayerByName(name) == "null") tl.addNewLayer(name);

			selectLayerByName(name);

			if (tl.layers[tl.currentLayer].frames[tl.currentFrame] != tl.layers[tl.currentLayer].frames[tl.currentFrame].startFrame){
				tl.insertBlankKeyframe();
			}

		doc.clipPaste(true);

		}
	}
}



for (i=0; i<n; i++){

	if (tl.layers[tl.currentLayer].frames[i].startFrame ==i){
		tl.setSelectedFrames(i, i, true);
		main();
		selectLayerByName(curLayerName);
	}
}