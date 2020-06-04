batchApplyScript();

function batchApplyScript(){
	fl.outputPanel.clear();
	fl.trace("--------------BatchApplyScripts---------------")
	
	alert("Choisir les fichiers sur lesquels appliquer le script")
	var documents = fl.browseForFileURL("open", "Choisir les fichiers sur lesquels appliquer le script", "FLA Document (*.fla)" , "fla","" , true) 

	//fl.trace(documents.length)
	if (documents.length == 0) {
		alert ("Selectionner au moins un Ficher FLA.")
		return;
	}
	
	alert("Choisir le script à appliquer")

	var script;
	while (true){
		script = fl.browseForFileURL("open", "Choisir le script à appliquer", "JSFL Document (*.jsfl)" , "jsfl", fl.configURI+"/Commands" , false)
		fl.trace("selected script :" + FLfile.uriToPlatformPath(script))
		if (script == null){
			if (confirm("Aucun script sélectionné, Abandon?")) {
				return;
			}
		}else{
			break;
		}
	}

	alert("Choisir la destination")
	
	var save = true;
	var folder;
	while (true){
		folder = fl.browseForFolderURL("open", "Choisir la destination")
		fl.trace("destination folder: "+FLfile.uriToPlatformPath(folder))
		if (folder == null){
			if (!confirm("Aucun dossier Destination sélectionné. Enregistrer les fichiers sans faire de copie? Cancel: ne pas faire de sauvegarde.")) {
				alert("Les fichiers ne seront pas sauvegardés.")
				save = false;
				break;
			}
		}else{
			break;
		}
	}
	
	var msg = "Le script : \n\n" + FLfile.uriToPlatformPath(script) + "\n\n va être appliqué sur les documents suivants: \n\n"
	for (var i=0; i<documents.length; i++){
		msg += FLfile.uriToPlatformPath(documents[i])+"\n"
	}
	msg += "\n\nConfirmer cette action?"

	if (! confirm(msg)) {
		alert("Exécution du script annulée.")
		return; 
	}
	
	for (var i=0; i<documents.length; i++){
		// apply script

		var doc = fl.openDocument(documents[i]);
		
		fl.trace("ouverture du fichier: "+FLfile.uriToPlatformPath(documents[i])+"  -  "+((FLfile.platformPathToURI(fl.getDocumentDOM().path) == documents[i])?"success":"failed"))
		
		fl.trace("exécution du script : "+FLfile.uriToPlatformPath(script))
		fl.runScript(script)
		
		if (save){
			if (folder != null){
				var success = fl.saveDocument(doc, folder + "/" + doc.name)
				fl.trace("sauvegarde à l'emplacement: "+FLfile.uriToPlatformPath(folder + "/" + doc.name)+"  -  "+((success)?"success":"failed"))
			}else{
				var success = fl.saveDocument(doc)
				fl.trace("sauvegarde à l'emplacement: "+FLfile.uriToPlatformPath(doc.path)+"  -  "+((success)?"success":"failed"))
			}
		}
		fl.closeDocument(doc, false)
	}
	
	alert ("Application du script terminée, consulter la fenêtre Sortie pour plus d'infos")
}