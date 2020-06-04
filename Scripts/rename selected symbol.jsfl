//Commande écrite par Mathieu Chaptel. Pour toute demande, m.chaptel@gmail.com

doc = fl.getDocumentDOM();
tl = doc.getTimeline();
sel = doc.selection;

for (var i=sel.length-1; i>=0; i--){
	if (sel[i].elementType != "instance") sel.splice(i, 1)
}

if (sel.length>0){
	sel = sel[0]
	if (sel.elementType == "instance"){		
		name = sel.libraryItem.name.split("/");
		name = name[name.length-1];
		newName = prompt("Symbol Name:", name)
		if (newName!=undefined){
			sel.libraryItem.name = newName;
		}
	}
} else{
	sel = tl.layers[tl.getSelectedLayers()[0]];
	name = sel.name;
	newName = prompt("Layer Name:", name)
	if (newName!=undefined){
		sel.name = newName;
	}
}