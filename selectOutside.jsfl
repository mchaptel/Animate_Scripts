//Commande écrite par Mathieu Chaptel. Pour toute demande, m.chaptel@gmail.com

doc = fl.getDocumentDOM();
tl = doc.getTimeline();
var sel = doc.selection;
var newSel = new Array();

newSel = doc.selection;
//fl.trace(newSel);
for (i=0; i<sel.length; i++){
	doc.selectNone()
	doc.selection = [sel[i]];
	var rect =  doc.getSelectionRect();
	var mat = doc.viewMatrix;
	rect.top = rect.top+mat.ty
	rect.left = rect.left+mat.tx
	rect.bottom = rect.bottom+mat.ty
	rect.right = rect.right+mat.tx
	//doc.selectNone()*/
	doc.setSelectionRect(rect, false, true);
	newSel = newSel.concat(doc.selection);

}
doc.selectNone();
doc.selection = newSel;