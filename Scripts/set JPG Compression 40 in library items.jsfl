//Commande écrite par Mathieu Chaptel. Pour toute demande, m.chaptel@gmail.com

doc = fl.getDocumentDOM();
lib = doc.library;

fl.outputPanel.clear();

sel = lib.getSelectedItems();

//fl.trace(sel)

for (i=0; i<sel.length; i++){

	if (sel[i].itemType=="bitmap"){
		sel[i].allowSmoothing = true;
		sel[i].compressionType = "photo";
		sel[i].quality = 40;

	}
};