//Commande écrite par Mathieu Chaptel. Pour toute demande, m.chaptel@gmail.com

var doc = fl.getDocumentDOM();
var tl = doc.getTimeline();
var layers = tl.getSelectedLayers();
var sel = tl.getSelectedFrames();

if (sel.length != 0){
	for (var i=0; i<sel.length; i+=3){
		if (layers.indexOf(sel[i]) == -1)layers.push(sel[i]);
	}
}

layers = layers.map(function(x){return tl.layers[x]})

for (var i=0; i<layers.length; i++){
	layers[i].visible = !layers[i].visible;
}