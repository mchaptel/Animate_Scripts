//Commande écrite par Mathieu Chaptel. Pour toute demande, m.chaptel@gmail.com

doc = fl.getDocumentDOM();
tl = doc.getTimeline();

fl.outputPanel.clear();
fl.showIdleMessage(false);

symbol = doc.selection[0];

if (symbol.elementType == "instance"){
	breakSymbolIntoLayers(symbol);
}

fl.showIdleMessage(true);

function breakSymbolIntoLayers(symbol){
	
	var name = symbol.libraryItem.name
	var symbTl = symbol.libraryItem.timeline;
	var layers = symbTl.layers;
	var curLayer = tl.currentLayer;
	var curFrame = tl.currentFrame;
	var startFrame = tl.layers[curLayer].frames[curFrame].startFrame;
	var frameLength = tl.layers[curLayer].frames[curFrame].duration;
	var mat = symbol.matrix;
	var loop = symbol.loop;
	var firstframe = symbol.firstFrame;


	
	//doc.clipCopy();
	
	// create a symbol by layer that isn't a folder
	
	var copies = [];
	

	
	for (var i=0; i<layers.length; i++){
		
		if (layers[i].layerType == "folder"){
			
			copies.push("folder");
			
		}else{
			
			/*
			// fast way but broken
			
			symbTl.copyLayers(i, i);
			var tempName = newFreeName();
			doc.library.addNewItem("graphic", tempName);	
			var copy = doc.library.items[doc.library.findItemIndex(tempName)]
			copy.timeline.pasteLayers();
			*/
			
			//slow way but might bug with big files
			
			doc.library.selectNone();
			doc.library.duplicateItem(name)
			var copy = doc.library.getSelectedItems()[0];

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
			if (startFrame+frameLength < tl.layers[tl.currentLayer].frameCount) tl.convertToKeyframes(startFrame+frameLength, startFrame+frameLength);
			
			tl.currentFrame = curFrame;

			//doc.clipPaste(true);
			
			doc.addItem({x:0,y:0},copies[l]);
			
			doc.selection[0].matrix = mat;
			doc.selection[0].loop = loop;
			doc.selection[0].firstFrame = firstframe;
			
			// recreate frames from layers inside symbol
			
			if (doc.selection[0].loop != "single frame"){
				
				//find frames properties on the layer inside the symbol
				
				var keyframes = findKeyframes(copies[l].timeline.layers[0], doc.selection[0].firstFrame);
				var firstframe = doc.selection[0].firstFrame;
				
				// create a keyframe for each keyframe in the symbol on the layer;
				
				for (var k=0; k<keyframes.length; k++){
					if (keyframes[k].startFrame>=startFrame+frameLength) break;
					var newkeyframe = keyframes[k].startFrame+startFrame-firstframe;
					if (newkeyframe != startFrame) tl.convertToKeyframes(newkeyframe, newkeyframe);
					
					//copy frame properties into new frame;
					setFrameProperties (tl.layers[tl.currentLayer].frames[tl.currentFrame], keyframes[k])
					
					if (keyframes[k].hasCustomEase) {
						//fl.trace(keyframes[k].getCustomEase())
						tl.layers[tl.currentLayer].frames[tl.currentFrame].hasCustomEase = true;
						tl.layers[tl.currentLayer].frames[tl.currentFrame].setCustomEase("all", keyframes[k].getCustomEase());
					}
					
				}
				
			}

		}
		
	}
	
	// break symbols

	for (var l=0; l<layers.length; l++){
		tl.currentLayer = curLayer+l+1;
		
		if (tl.layers[tl.currentLayer].layerType != "folder"){
			for (var f=0; f<frameLength; f++){
				if (tl.layers[tl.currentLayer].frames[startFrame+f].startFrame == startFrame+f) {
					doc.selectNone();
					tl.setSelectedFrames(startFrame+f, startFrame+f);
					doc.breakApart();
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
	/*tl.addNewLayer(name+"_layers", "folder", false)
	
	for (var l=0; l<=layers.length; l++){
		tl.layers [curLayer+l+1].parentLayer = tl.layers [curLayer+1];
	}*/
	
	// cleanup

	tl.currentLayer = curLayer;
	tl.currentFrame = startFrame;
	doc.selectNone();
	symbol.selected = true;
	doc.deleteSelection();
	
	for (var j=0; j<copies.length; j++){
		//fl.trace(copies[j].name)
		doc.library.deleteItem(copies[j].name);
	}
	
	
}

function setFrameProperties (frame, object){
	for (var p in frame){
		if (p != "i" && p!="tweenInstanceName") frame[p] = object[p];
	}
}

function newFreeName(){
	var num = 1
	while(doc.library.itemExists("tempSymbole "+num)){
		num++  
	}
	return ("tempSymbole "+num)
}

function findKeyframes(layer, startframe){
	var framesArray = [];
	for (var i=startframe; i<layer.frameCount; i++){
		if (layer.frames[i].startFrame == i) {
			/*var frame = new Object();
			frame.i = i;
			for (var p in layer.frames[i]){
				if (p != "elements") frame[p] = layer.frames[i][p];
			}*/
			
			framesArray.push(layer.frames[i]);
			//framesArray.push(frame);
			//if (frame.hasCustomEase) ease = frame.getCustomEase();
		}
	}
	return (framesArray);
}