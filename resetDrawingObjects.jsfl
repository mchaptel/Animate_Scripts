//Commande écrite par Mathieu Chaptel. Pour toute demande, m.chaptel@gmail.com

doc = fl.getDocumentDOM();
tl = doc.getTimeline();
sel = doc.selection;
newSel = [];

sel.sort(function(a, b){return b.depth-a.depth;})

for (var i in sel){
	if (sel[i].isDrawingObject){
		doc.selectNone();
		doc.selection = [sel[i]];
		doc.breakApart();
		doc.union();
		newSel.push(doc.selection[0])
	}
}

doc.selection = newSel;