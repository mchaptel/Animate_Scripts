//Commande écrite par Mathieu Chaptel. Pour toute demande, m.chaptel@gmail.com

doc = fl.getDocumentDOM();
tl = doc.getTimeline();
sel = doc.selection;
newSel = new Array();

//newSel.concat(doc.selection);
for (i in sel){
	//doc.selection = sel[i];
	var rect =  doc.getSelectionRect();
	var mat = fl.getDocumentDOM().viewMatrix;
	rect.top = rect.top+mat.ty-1
	rect.left = rect.left+mat.tx-1
	rect.bottom = rect.bottom+mat.ty+1
	rect.right = rect.right+mat.tx+1
	//doc.selectNone()*/
	doc.setSelectionRect(rect, true, false);

	//newSel.concat(doc.selection);
}
//doc.selection = newSel;