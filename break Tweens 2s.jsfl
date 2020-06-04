//Commande écrite par Mathieu Chaptel. Pour toute demande, m.chaptel@gmail.com

var doc = fl.getDocumentDOM();
var tl = doc.getTimeline();

var sel = tl.getSelectedFrames();

for (var i=0; i<sel.length; i+=3){

	var layer = sel[i];
	var startFrame = sel[i+1];
	var endFrame = sel[i+2];
	
	//fl.trace ("layer:"+sel[i]+" start:"+sel[i+1]+" end:"+sel[i+2])
	
	tl.setSelectedLayers(layer);
	
	// create a record of all frames to act on
	var keys = [];
	
	// add the first even if it's not a keyframe)
	if (tl.layers[layer].frames[startFrame].tweenType != "none") keys.push(startFrame)
		
	//add every subsequent keyframe with a tween on it
	for (var j=startFrame+1; j<endFrame; j++){
		var frame = tl.layers[layer].frames[j];
		if (frame.startFrame == j && frame.tweenType != "none") keys.push(j);
	}
	
	//fl.trace (keys);
	for (var k in keys){
		
		var frame = tl.layers[tl.currentLayer].frames[keys[k]];
		
		// stop at end of selection if all frames aren't selected
		var end = keys[k]+frame.duration
		
		if (keys[k]+frame.duration > endFrame) end = endFrame;

		for (var f=keys[k]+2; f<end; f+=2){
			tl.insertKeyframe(f);
			tl.layers[layer].frames[f-2].tweenType = "none";
		}
		
		if (tl.layers[layer].frames[end-1].duration<=2) tl.layers[layer].frames[end-1].tweenType = "none";
		
	}
	
	
} 