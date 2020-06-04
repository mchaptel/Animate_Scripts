//Commande écrite par Mathieu Chaptel. Pour toute demande, m.chaptel@gmail.com

doc = fl.getDocumentDOM();
tl = doc.getTimeline();

fl.outputPanel.clear();

var mat = doc.viewMatrix;
mat.tx = 0;
mat.ty = 0;

var flipCenter = {x:doc.width/2, y:doc.height/2}

var symetryMat = fl.Math.concatMatrix(mat, {a:-1, b:0, c:0, d:1, tx:0, ty:0}) ;

flipAll();

function flipAll(){
	var sel = doc.selection
	doc.selectAll();
	//doc.selection.sort(function(a, b){return b.depth-a.depth;})
	doc.group();
	var tempSel = doc.selection;
	for (var i in tempSel){
		if (tempSel[i].elementType=="shape") {
			tempSel[i] = convertShapeIntoSymbol(tempSel[i]);
			applyTransform(tempSel[i], flipCenter, symetryMat);
			doc.breakApart();
		}else{
			applyTransform(tempSel[i], flipCenter, symetryMat);
		}
		//traceObj(symetryMat)
	}
	doc.selectAll();
	doc.breakApart();
	doc.selectNone();
	doc.library.deleteItem("junk")
}

function applyTransform (symbol, pivot, mat){
	//fl.trace ("flip")

	var tempPivot = transformPoint(pivot, fl.Math.invertMatrix(doc.viewMatrix));
	var point = symbol.getTransformationPoint();
	//var tempPivot = transformPoint(point, fl.Math.invertMatrix(doc.viewMatrix));

	var tempMat = identityMatrix();
	tempMat.tx = -tempPivot.x;
	tempMat.ty = -tempPivot.y;
	//traceObj(pivot)
	//traceObj(tempPivot)
	//traceObj(fl.Math.invertMatrix(tempMat))
	//doc.addNewLine(pivot, tempPivot)
	symbol.matrix = fl.Math.concatMatrix(symbol.matrix, tempMat);
	symbol.matrix = fl.Math.concatMatrix(symbol.matrix, mat)
	symbol.matrix = fl.Math.concatMatrix(symbol.matrix, fl.Math.invertMatrix(tempMat))
	symbol.setTransformationPoint(point);

}

function convertShapeIntoSymbol(shape){
	doc.selectNone();

	doc.selection = [shape];
	//shape.selected = true;

	var symbol = nextFreeName();
	doc.convertToSymbol("graphic",symbol,"center");
	doc.library.newFolder("junk");
	doc.library.moveToFolder("junk", symbol, true);
	return (doc.selection[0]);
}

function nextFreeName(){
	name = 0
	while(true){
		if (!doc.library.itemExists("junk/shape"+name)) break;
		name++;
	}
	return("shape"+name);
}


function transformPoint( pt,  mat ){
	var x = pt.x*mat.a + pt.y*mat.c + mat.tx;
	var y = pt.x*mat.b + pt.y*mat.d + mat.ty;

	return {"x":x, "y":y};
}


function traceObj(obj){
	for (var i in obj){
		if (typeof obj[i] == Object){
			traceObj(obj[i]);
		}else{
			fl.trace (i+": "+obj[i])
		}
	}
}

function identityMatrix (){
	var mat = new Object();
	mat.a = 1;
	mat.b = 0;
	mat.c = 0;
	mat.d = 1;
	mat.tx = 0;
	mat.ty = 0;
	return (mat);
}