//Commande écrite par Mathieu Chaptel. Pour toute demande, m.chaptel@gmail.com

sel = fl.getDocumentDOM().selection;

for (e in sel){
	if (sel[e].elementType == "instance") resetSymbolRotation (sel[e])
}

function resetSymbolRotation(symbol){
	symbol.skewY = 0;
	symbol.skewX = 0;
	symbol.rotation = 0;
}