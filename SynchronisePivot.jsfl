//Commande écrite par Mathieu Chaptel. Pour toute demande, m.chaptel@gmail.com

var doc = fl.getDocumentDOM();
var tl = doc.getTimeline();

var framesSel = tl.getSelectedFrames();

for (var i=0; i<framesSel.length/3; i+=3){
	var layer = tl.layers[framesSel[i]];
	if (layer.layerType == "folder") continue;
	var selStart = framesSel[i+1];
	var selEnd = framesSel[i+2];
	var keys = layer.frames
		.filter(function (x, index){return index >= selStart && index < selEnd && x.startFrame == index}) //get keys only
		.sort(function(a, b){return a.startFrame - b.startFrame}); // sort by frame number

	var pivots = {};
	for (var j in keys){
		var key = keys[j];
		//fl.trace(key.startFrame)
		for (var k in key.elements){
			var element = key.elements[k];
			if (element.elementType != "instance" && element.instanceType != "symbol") continue;
			var libItem = element.libraryItem;

			// store points or apply them if already stored
			if (pivots.hasOwnProperty(libItem.name)){
				//fl.trace("applying pivot: "+pivots[libItem.name].x+" "+pivots[libItem.name].y+" to element :"+libItem.name);
				element.setTransformationPoint(pivots[libItem.name]);
			}else{
				var pivot = element.getTransformationPoint();
				//fl.trace("storing pivot: "+pivot.x+" "+pivot.y+" from element :"+libItem.name);
				pivots[libItem.name] =	pivot;
			}
		}
	}
}
