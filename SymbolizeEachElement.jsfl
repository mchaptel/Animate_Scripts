//Commande écrite par Mathieu Chaptel. Pour toute demande, m.chaptel@gmail.com

var doc = fl.getDocumentDOM();
var tl = doc.getTimeline();

function sortSelection(bottomtoTop){
	selectionArray = new Array();
	selectionArray = doc.selection;
	for (i=0; i<selectionArray.length; i++){
		for (j=i; j<selectionArray.length; j++){
			if (bottomtoTop && selectionArray[i].depth > selectionArray[j].depth){
				temp = selectionArray[i];
				selectionArray[i] = selectionArray[j];
				selectionArray[j] = temp;
			}else if (selectionArray[i].depth < selectionArray[j].depth){
				temp = selectionArray[i];
				selectionArray[i] = selectionArray[j];
				selectionArray[j] = temp;
			}
		}
	}
	return selectionArray;
}

function nextFreeName(folder){
	name = 0
	while(true){
		if (!doc.library.itemExists(folder+"/"+folder+"_"+name)) break;
		name++;
	}
	return(folder+"_"+name);
}

function convertShapeIntoSymbol(shape){
	doc.selectNone();
	//fl.trace(shape)
	doc.selection = [shape];
	//fl.trace("sel: "+doc.selection);
	folder = shape.layer.name;

	symbol = nextFreeName(folder);

	doc.convertToSymbol("graphic",symbol,"center");
	doc.library.newFolder(folder);
	doc.library.moveToFolder(folder, symbol, true);
	return (doc.selection[0]);
}
function convertShapes(selectionArray, curLayer){

		var frameElements = new Array();

		for (l=0;l<tl.layers.length; l++){
			if (tl.layers[l].layerType!="folder"&&!tl.layers[l].locked){
				for  (e in tl.layers[l].frames[tl.currentFrame].elements){
					frameElements.push(tl.layers[l].frames[tl.currentFrame].elements[e]);
				}
			}
		}


		for (j=0; j<selectionArray.length; j++){
			for (k=0; k<frameElements.length; k++){
				if (selectionArray[j] == frameElements[k]){
					if (selectionArray[j].elementType=="shape"){
						selectionArray[j] = convertShapeIntoSymbol(selectionArray[j]);
						selectionArray[j].loop = 'single frame';
				}
				}
			}
		}

}

function FreeshapesToUnion(){
	var tempSel = doc.selection
	for (var i = 0; i < tempSel.length; i++) {
		if (tempSel[i].elementType != "shape"||tempSel[i].isDrawingObject||tempSel[i].isGroup){
			tempSel[i].selected = false;
		}
	}
	if (doc.selection.length!=0){
		doc.union()
		doc.arrange("back")
	}
	var newUnion = doc.selection[0]
	doc.selection = tempSel;
	return (newUnion);
}

function main(){

	doc.selection.push (FreeshapesToUnion())

	sel = sortSelection(true);

	if (doc.selection.length==0){
		alert ("Selectionnez d'abord les éléments à convertir");
		return;
	}
	convertShapes(sel, tl.currentLayer);
}

main();
