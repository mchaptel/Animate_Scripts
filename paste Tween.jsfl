//Commande écrite par Mathieu Chaptel. Pour toute demande, m.chaptel@gmail.com

var doc = fl.getDocumentDOM();
var tl = doc.getTimeline();

var sel = tl.getSelectedFrames();
//var frame = tl.layers[tl.currentLayer].frames[tl.currentFrame];

if (sel.length>0){
	for (var i=0; i<sel.length; i+=3){
		var layer = sel[i];
		var frames = findKeyFrames(layer, sel[i+1], sel[i+2])
		//tl.currentLayer = layer;
		for (var f=frames.length-1; f>=0; f--){
			var frame = tl.layers[layer].frames[frames[f]];
			frame.tweenType = tween;
			frame.hasCustomEase = true;
			frame.setCustomEase("all", ease);
		}
		//if (sel[i+1]!=sel[i+2]-1) tl.setSelectedFrames(sel[i+1], sel[i+2]+frames.length-1, false)
	}

}

function findKeyFrames(layer, startFrame, endFrame){
	var frames = [startFrame];
	for (var i=startFrame+1; i<endFrame; i++){
		if (tl.layers[layer].frames[i].startFrame == i) frames.push(i);
	}
	return frames;
}