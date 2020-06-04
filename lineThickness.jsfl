//Commande écrite par Mathieu Chaptel. Pour toute demande, m.chaptel@gmail.com

var sel = fl.getDocumentDOM().selection;

var thickness = parseInt(prompt("choose thickness"),10);

for (var i in sel){
	changeThickness(sel[i], thickness)
}

function changeThickness (element, value){
	if (element.elementType == "shape"){
		var edges = element.edges
		for (var edge in edges) {
			var ed = edges[edge]
			if (ed.stroke.style !=  "noStroke") {
				var fill = ed.stroke
				fill.thickness = value
				ed.stroke = fill;
			}
		}
	}
}