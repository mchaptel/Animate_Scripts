//Commande écrite par Mathieu Chaptel. Pour toute demande, m.chaptel@gmail.com

var doc = fl.getDocumentDOM();
var tl = doc.getTimeline();
var layer = tl.layers[tl.currentLayer]

if (layer.layerType != "folder"){
	var curFrame = layer.frames[tl.currentFrame]
	var nextFrame = curFrame.startFrame+curFrame.duration

	if (nextFrame < layer.frameCount) tl.currentFrame = nextFrame;
}