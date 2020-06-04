//Commande écrite par Mathieu Chaptel. Pour toute demande, m.chaptel@gmail.com
// this script groups all selected layers under a folder

var doc = fl.getDocumentDOM();
var tl = doc.getTimeline();
var sel = tl.getSelectedLayers();
fl.outputPanel.clear()

sel.sort(function(a, b){return a-b})
var parents = sel.map(function (x) {return tl.layers[x].parentLayer!=null?tl.layers[x].parentLayer:"null"});

tl.currentLayer = sel[0];
var folderIndex = tl.addNewLayer(tl.layers[sel[0]].name+"_group", "folder", true);

for (i=0; i<sel.length; i++){
	var layerIndex = sel[i]+1
	var folder = tl.layers[folderIndex]

	if (parents[i] == "null" || parents[i] == folder.parentLayer){
		tl.layers[layerIndex].parentLayer = folder;
	} else{
		tl.layers[layerIndex].parentLayer = parents[i];
	}
}