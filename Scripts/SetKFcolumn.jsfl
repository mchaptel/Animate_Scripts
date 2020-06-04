//Commande écrite par Mathieu Chaptel. Pour toute demande, m.chaptel@gmail.com

var rdoc = fl.getDocumentDOM();
var tl = doc.getTimeline();
var frame = tl.currentFrame;


for (var i=0; i<tl.layers.length; i++){

	tl.currentLayer = i;

	if (!tl.layers[i].locked && tl.layers[i].layerType != "folder") {
		if (tl.layers[i].frames[frame].startFrame != frame) tl.insertKeyframe();
	};

};