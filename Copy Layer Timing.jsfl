//Commande écrite par Mathieu Chaptel. Pour toute demande, m.chaptel@gmail.com

var doc = fl.getDocumentDOM();
var tl = doc.getTimeline();

fl.outputPanel.clear();

var sel = tl.getSelectedLayers();

for (var l in sel){
	sel[l] = tl.layers[sel[l]];
}

var frames  = findKeyframes(sel);

var layer = tl.addNewLayer("timing copy");

tl.setSelectedLayers(layer, true);

for (var f=1; f<frames.length; f++){
	tl.insertKeyframe(frames[f])
}


function findKeyframes (layerArray){
	var framecount = 0;

	for (var l=0; l<layerArray.length; l++){
		if (framecount<layerArray[l].frameCount) framecount = layerArray[l].frameCount;
	}

	var FramesArray = [];

	for (var i=0; i<framecount; i++){
		for (var j=0; j<layerArray.length; j++){
			if (i == layerArray[j].frames[i].startFrame && FramesArray.indexOf(i)== -1) FramesArray.push(i);
		}
	}
	//fl.trace("FramesArray: "+FramesArray);
	return (FramesArray);
}