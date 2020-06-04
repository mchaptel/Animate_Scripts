//Commande écrite par Mathieu Chaptel. Pour toute demande, m.chaptel@gmail.com


doc = fl.getDocumentDOM();
tl = doc.getTimeline();


if (doc.library.itemExists("clipboard_junk")) doc.library.deleteItem("clipboard_junk");

doc.clipPaste(true);
element = doc.selection[0];

if (element.elementType =="instance") {
	if (element.libraryItem.name == "clipboard_junk"){
		if (element.libraryItem.hasData("matrix")){
			var StoredView = getMatrix(element.libraryItem, "view")
			var StoredMatrix = getMatrix(element.libraryItem, "matrix")
			var TransformPoint = getPoint(element.libraryItem, "point")
			//fl.trace(element.libraryItem.getData("matrix"))
		}else{
			alert ("error retreiving copied position");
		}
		
		if (!compareMatrices (StoredView,doc.viewMatrix)){
			var mat = fl.Math.concatMatrix(StoredView, fl.Math.invertMatrix(doc.viewMatrix))
			var mat2 =  fl.Math.concatMatrix(StoredMatrix, mat)
				
			element.matrix = mat2;
			element.setTransformationPoint(TransformPoint);
			//element.x = mat2.tx;
			//element.y = mat2.ty;
		}

		doc.breakApart();
		doc.library.deleteItem("clipboard_junk");
	}
}


function getMatrix(item, name){
		var matArray = item.getData(name)
		matArray = matArray.split(",")
		var mat = {
			a: parseFloat(matArray[0]),
			b: parseFloat(matArray[1]),
			c: parseFloat(matArray[2]),
			d: parseFloat(matArray[3]),
			tx: parseFloat(matArray[4]),
			ty: parseFloat(matArray[5])}
		return (mat)
}

function getPoint(item, name){
	var pointArray = item.getData(name)
	pointArray = pointArray.split(",");
	var point = {x:parseFloat(pointArray[0]), y:parseFloat(pointArray[1])}
	return (point);
}

function compareMatrices(mat1, mat2){
	for (var i in mat1){
		if (mat1[i]!= mat2[i]) return (false);
	}
	return (true)
}