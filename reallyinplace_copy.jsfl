//Commande écrite par Mathieu Chaptel. Pour toute demande, m.chaptel@gmail.com


doc = fl.getDocumentDOM();
tl = doc.getTimeline();

fl.outputPanel.clear()

if (doc.selection.length!=0){
	
	StoredMatrix = new Object();
	StoredView = new Object();
	TransformPoints = new Object();
	
	sel = doc.selection;

	if (doc.library.itemExists("clipboard_junk")) doc.library.deleteItem("clipboard_junk");	

	doc.clipCopy();
	doc.clipPaste(true);
	doc.convertToSymbol("graphic","clipboard_junk","center");
	
	TransformPoint = doc.selection[0].getTransformationPoint();
	StoredView = doc.viewMatrix
	StoredMatrix = doc.selection[0].matrix;

	doc.selection[0].libraryItem.addData("matrix", "string", StoredMatrix.a+","+StoredMatrix.b+","+StoredMatrix.c+","+StoredMatrix.d+","+StoredMatrix.tx+","+StoredMatrix.ty)
	doc.selection[0].libraryItem.addData("view", "string", StoredView.a+","+StoredView.b+","+StoredView.c+","+StoredView.d+","+StoredView.tx+","+StoredView.ty)
	doc.selection[0].libraryItem.addData("point", "string", TransformPoint.x+","+TransformPoint.y)

/*
	doc.selection[0].libraryItem.addData("matrix", "doubleArray", [StoredMatrix.a, StoredMatrix.b, StoredMatrix.c, StoredMatrix.d, StoredMatrix.tx, StoredMatrix.ty])
	doc.selection[0].libraryItem.addData("view", "doubleArray", [StoredView.a, StoredView.b, StoredView.c, StoredView.d, StoredView.tx, StoredView.ty])
	doc.selection[0].libraryItem.addData("point", "doubleArray", [TransformPoint.x, TransformPoint.y])
*/

	doc.clipCut();
	
	doc.selection = sel;
	
	doc.library.deleteItem("clipboard_junk");
}