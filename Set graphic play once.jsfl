//Commande écrite par Mathieu Chaptel. Pour toute demande, m.chaptel@gmail.com

sel = fl.getDocumentDOM().selection;

for (i in sel){

	if (sel[i].symbolType=="graphic"){
		sel[i].loop = "play once";
	}
}