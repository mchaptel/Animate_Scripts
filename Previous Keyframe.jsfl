//Commande écrite par Mathieu Chaptel. Pour toute demande, m.chaptel@gmail.com

var doc = fl.getDocumentDOM();
var tl = doc.getTimeline();
var layer = tl.layers[tl.currentLayer]

if (layer.layerType != "folder"){
	var curFrame = tl.currentFrame;
	var frames = layer.frames;

	if (curFrame>0) tl.currentFrame = frames[curFrame-1].startFrame; 
}