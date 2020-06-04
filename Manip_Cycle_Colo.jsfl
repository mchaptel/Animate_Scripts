//Commande écrite par Mathieu Chaptel. Pour toute demande, m.chaptel@gmail.com

var doc = fl.getDocumentDOM();
var tl = doc.getTimeline();
var sel = tl.getSelectedFrames();

fl.outputPanel.clear();
fl.showIdleMessage(false);


var symbol = doc.selection[0];

for(var e in doc.selection){
	if (doc.selection[e].elementType == "instance"){
		 symbol = doc.selection[e];
	}
}
if (doc.selection.length>0 && symbol.elementType == "instance" && sel.length == 3){
	breakSymbolIntoLayers(symbol);
} else {
	alert("Sélection incorrecte: Sélectionner une ou plusieurs images consécutives contenant un seul même symbole.")
}

fl.showIdleMessage(true);

function breakSymbolIntoLayers(symbol){

	var name = symbol.libraryItem.name
	var symbTl = symbol.libraryItem.timeline;
	var layers = symbTl.layers;
	var curLayer = tl.currentLayer;
	var curFrame = tl.currentFrame;

	var startFrame = sel[1];
	var endFrame = sel[2];

	if (tl.layers[tl.currentLayer].frames[startFrame].startFrame != startFrame) tl.convertToKeyframes(startFrame, startFrame)

	if (endFrame<tl.layers[tl.currentLayer].frameCount && tl.layers[tl.currentLayer].frames[endFrame].startFrame != endFrame) tl.convertToKeyframes(endFrame, endFrame)

	//var frameLength = tl.layers[curLayer].frames[curFrame].duration+tl.layers[curLayer].frames[endFrame-1].duration;
	var keyframes = findKeyframes(tl.layers[curLayer], startFrame, endFrame);

	// create a symbol by layer that isn't a folder

	var copies = [];


	for (var i=0; i<layers.length; i++){

		if (layers[i].layerType == "folder"){

			copies.push("folder");

		}else{


			// fast way but broken
			/*
			symbTl.copyLayers(i,i);

			// var tempName = newFreeName();
			var tempName = newFreeName(name+"_"+symbTl.layers[i].name);
			doc.library.addNewItem("graphic", tempName);
			var copy = doc.library.getSelectedItems()[0];
			//var copy = doc.library.items[doc.library.findItemIndex(tempName)]
			copy.timeline.pasteLayers(0);
			copy.timeline.deleteLayer(1);
			*/
			//slow way but might bug with big files

			doc.library.selectNone();
			doc.library.duplicateItem(name)
			var copy = doc.library.getSelectedItems()[0];

			var tempName = newFreeName(name+"_"+symbTl.layers[i].name)
			var symbPath = tempName.split("/");
			copy.name = symbPath[symbPath.length-1];

			for (var l=copy.timeline.layerCount-1; l>=0; l--){
				if (l==i) copy.timeline.layers[i].parentLayer = null;
				if (l!=i) copy.timeline.deleteLayer(l);
			}


			copies.push(copy);

		}

	}

	// place copies on stage and recreate layers, then break all symbols

	tl.currentLayer = curLayer;

	for (var l=0; l<layers.length; l++){

		//copy single layer symbol onto as many layers as are in the symbol

		tl.addNewLayer(layers[l].name, layers[l].layerType, false)

		if ( tl.layers[tl.currentLayer].layerType != "folder"){

			if (startFrame != 0) tl.convertToKeyframes(startFrame, startFrame);
			if (endFrame < tl.layers[tl.currentLayer].frameCount) tl.convertToKeyframes(endFrame, endFrame);

			tl.currentFrame = curFrame;

			//doc.clipPaste(true);

			doc.addItem({x:0,y:0},copies[l]);

			// recreate frames like selection

			for (var k=0; k<keyframes.length; k++){
				if (k>0) tl.insertKeyframe(keyframes[k].startFrame)//convertToKeyframes(keyframes[k].startFrame, keyframes[k].startFrame)
			//}
				// set newly pasted Symbol like the original

				var newSymbol = tl.layers[tl.currentLayer].frames[tl.currentFrame].elements[0];
				var symbolTemp = findSymbol(tl.layers[curLayer].frames[keyframes[k].startFrame], symbol.libraryItem);

				if (symbolTemp != null && newSymbol != null){
					newSymbol.symbolType = 'graphic'
					newSymbol.loop = symbolTemp.loop
					newSymbol.firstFrame = symbolTemp.firstFrame
					newSymbol.matrix = symbolTemp.matrix
					newSymbol.setTransformationPoint(symbolTemp.getTransformationPoint());

				}
			}

			for (var k=0; k<keyframes.length; k++){
				//copy frame properties into new frame;
				setFrameProperties (tl.layers[tl.currentLayer].frames[keyframes[k].startFrame], keyframes[k])

				if (keyframes[k].hasCustomEase) {
					//tl.layers[tl.currentLayer].frames[keyframes[k].startFrame].hasCustomEase = true;
					var curve = tl.layers[curLayer].frames[keyframes[k].startFrame].getCustomEase()
					//fl.trace(curve)
					tl.layers[tl.currentLayer].frames[keyframes[k].startFrame].setCustomEase("all", curve);
				}

			}

			// removing symbols from frames where it didn't exist on original layer

			tl.currentFrame = curFrame;

			for (var k=0; k<keyframes.length; k++){

				tl.currentFrame = keyframes[k].startFrame;

				var symbolTemp = findSymbol(tl.layers[curLayer].frames[keyframes[k].startFrame], symbol.libraryItem)

				if (symbolTemp == null){
					doc.selectNone();
					doc.selection = [tl.layers[tl.currentLayer].frames[keyframes[k].startFrame].elements[0]];
					doc.deleteSelection();
				}
			}
		}

	}

	// restore layer visibility/locked/etc

	for (var l=0; l<layers.length; l++){
			tl.currentLayer = curLayer+l+1;

			tl.layers[tl.currentLayer].locked = layers[l].locked
			tl.layers[tl.currentLayer].visible = layers[l].visible
			tl.layers[tl.currentLayer].outline = layers[l].outline
			tl.layers[tl.currentLayer].color = layers[l].color

		// if original layer is in a folder, put new one in the corresponding folder

		if (layers[l].parentLayer != null){
			//fl.trace (l+": "+layers[l].parentLayer.layerType)
			for (var i = 1; i<=l; i++){
				if (layers[l-i] == layers[l].parentLayer) {
					var parent = tl.layers[tl.currentLayer-i];
					//fl.trace("parent: "+i)
					break;
				}
			}
			tl.layers[tl.currentLayer].parentLayer = parent;
		}else{
			tl.layers[tl.currentLayer].parentLayer = null
		}

	}

	//move layers into a group

	tl.currentLayer = curLayer;

	// cleanup

	for (var f = 0; f<keyframes.length; f++){
		tl.currentFrame = keyframes[f].startFrame;
		//fl.trace(findSymbol(tl.layers[tl.currentLayer].frames[tl.currentFrame], symbol.libraryItem))
		doc.selectNone();
		doc.selection = [findSymbol(tl.layers[tl.currentLayer].frames[tl.currentFrame], symbol.libraryItem)]
		doc.deleteSelection();
	}

	tl.currentLayer = curLayer;
	tl.currentFrame = startFrame;
	//doc.selectNone();
	//symbol.selected = true;
	//doc.deleteSelection();

}

function setFrameProperties (frame, object){
	for (var p in frame){
		if (p != "i" && p!="tweenInstanceName") frame[p] = object[p];
	}
}

function libItemNameFree(name){
	for (var i in doc.library.items){
		if (name.toUpperCase() == doc.library.items[i].name.toUpperCase()) return (false);
	}
	return (true);
}

function newFreeName(name){
	if (libItemNameFree(name)){
		return name;
	}
	var num = 1;
	while(!libItemNameFree(name+num)){
		num++
	}
	return (name+num);
}

function findSymbol(frame, libraryItem){
	for (var e in frame.elements){
		if (frame.elements[e].libraryItem == libraryItem){
			return (frame.elements[e]);
		}
	}
	return null;
}

function findKeyframes(layer, startFrame, endFrame){
	var framesArray = [];
	for (var i=startFrame; i<endFrame; i++){
		if (layer.frames[i].startFrame == i) {
			framesArray.push(layer.frames[i]);
		}
	}
	return (framesArray);
}