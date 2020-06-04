//Commande écrite par Mathieu Chaptel. Pour toute demande, m.chaptel@gmail.com

var doc = fl.getDocumentDOM();
var tl = doc.getTimeline();

if (typeof RoughToggle == 'undefined'){
	RoughToggle = false; 
}else{
	RoughToggle = !RoughToggle
}

for (var i=0; i<tl.layerCount; i++){
	if (tl.layers[i].name.toLowerCase().indexOf("rough") != -1){
		tl.layers[i].visible = RoughToggle; 
	}
	
}