//Commande écrite par Mathieu Chaptel. Pour toute demande, m.chaptel@gmail.com

var doc = fl.getDocumentDOM();
var tl = doc.getTimeline();
var curLayer = tl.currentLayer;
var curFrame = tl.currentFrame;
var sel = tl.getSelectedFrames();

//tl.setSelectedFrames(tl.currentFrame,tl.currentFrame,true)

if (sel.length>0){
	for (var i=0; i<sel.length; i+=3){
		var layer = sel[i];
		var frames = findKeyFrames(layer, sel[i+1], sel[i+2])
		tl.currentLayer = layer;
		for (var f=frames.length-1; f>=0; f--){
			tl.removeFrames(frames[f]);
		}
		sel[i+2] -= frames.length
		//if (sel[i+1]!=sel[i+2]-1) tl.setSelectedFrames(sel[i+1], sel[i+2]-frames.length+1, false)
	}
	
tl.setSelectedFrames(sel, true)

}else{
	for (var l=0 ;l<tl.layerCount; tl++){
		//tl.currentLayer = l
		tl.removeFrames();
	}
}


tl.currentLayer = curLayer;
tl.currentFrame = curFrame;

function findKeyFrames(layer, startFrame, endFrame){
	var frames = [startFrame];
	for (var i=startFrame+1; i<endFrame; i++){
		if (tl.layers[layer].frames[i].startFrame == i) frames.push(i);
	}
	return frames;
}