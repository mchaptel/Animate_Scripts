//Commande écrite par Mathieu Chaptel. Pour toute demande, m.chaptel@gmail.com

var doc = fl.getDocumentDOM();
var tl = doc.getTimeline();
var sel = tl.getSelectedFrames();

var label = prompt("Nouvelle Etiquette d'image");

for (var i=0; i<sel.length; i+=3){
	var layer = sel[i];
	var startFrame = sel[i+1];
	var endFrame = sel[i+2];

	if (tl.layers[layer].layerType !="folder"){
		for( var j=startFrame; j<endFrame; j++){
			var frame = tl.layers[layer].frames[j];
			if (frame.startFrame == j) {
				if (label){
					frame.labelType = 'comment';
					frame.name = label;
				}else{
					frame.labelType = "none"
				}
			}
		}
	}

}