fl.outputPanel.clear();

alert ("Sélectionner les extensions à installer");
path = fl.scriptURI.slice(0, fl.scriptURI.lastIndexOf("/"))
//fl.trace(parseInt(fl.version.slice(4,6), 10))

if (parseInt(fl.version.slice(4,6), 10) > 12){
	files = fl.browseForFileURL("select", "Select Extensions To Install", "All Files (*.jsfl, *.swf)", "jsfl;swf;include", path, true)
}else{
	var files =  [fl.browseForFileURL("select", "Select Extensions To Install")]
}
if (files.length>0){
for (f in files){
	
	var file = files[f]
	//fl.trace (f+": "+files[f])
	var directory = file.split("/")
	directory.pop();
	directory = directory.join("/")
	var ext = file.split(".").pop();
	var name = file.split("/").pop().split("."+ext).join("");
	
	//fl.trace ("directory: "+directory)
	//fl.trace ("name: "+name)
	//fl.trace ("ext: "+ext)
	
	var success = false;
	var type = ""
	
	if (ext == "jsfl" || ext == "include"){
		
		// determin if it is a tool or a script
		if (fl.fileExists(directory+"/"+name+".png")){
			
			type = 'L\'outil "'
			//fl.trace (directory+"/"+name+".png"+" is tool")
			if (!fl.fileExists(fl.configURI+"Tools/"+name+"."+ext)||!checkForMoreRecent(file, fl.configURI+"Tools/"+name+"."+ext)||askForReplace(name, fl.configURI+"Tools/", ext)){
				success = FLfile.copy (file, fl.configURI+"Tools/"+name+"."+ext)
				if (fl.fileExists(directory+"/"+name+".xml")) FLfile.copy (directory+"/"+name+".xml", fl.configURI+"Tools/"+name+".xml")
				if (fl.fileExists(directory+"/"+name+".png")) FLfile.copy (directory+"/"+name+".png", fl.configURI+"Tools/"+name+".png")
				if (fl.fileExists(directory+"/"+"x2_"+name+".png")) FLfile.copy (directory+"/"+"x2_"+name+".png", fl.configURI+"Tools/"+"x2_"+name+".png")
				fl.reloadTools();
			}
			
		}else {
			
			type = 'Le script "'
			if (!fl.fileExists(fl.configURI+"Commands/"+name+"."+ext)||!checkForMoreRecent(file, fl.configURI+"Commands/"+name+"."+ext)||askForReplace(name, fl.configURI+"Commands/", ext)){
				success = FLfile.copy (file, fl.configURI+"Commands/"+name+"."+ext)
				if (fl.fileExists(directory+"/"+name+".xml")) FLfile.copy (directory+"/"+name+".xml", fl.configURI+"Commands/"+name+".xml")
				if (fl.fileExists(directory+"/"+name+".include")) FLfile.copy (directory+"/"+name+".xml", fl.configURI+"Commands/"+name+".include")
			}
			
		}
		
	}else if (ext == "swf"){
		type = 'Le panneau "'
		if (!fl.fileExists(fl.configURI+"WindowSWF/"+name+"."+ext)||!checkForMoreRecent(file, fl.configURI+"WindowSWF/"+name+"."+ext)||askForReplace(name, fl.configURI+"WindowSWF/", ext)){
			success = FLfile.copy (file, fl.configURI+"WindowSWF/"+name+"."+ext)
		}
	}
	
	if (success){
		fl.trace (type+name.split("%20").join(" ")+'" a été correctement installé');
	}else{
		fl.trace (type+name.split("%20").join(" ")+'" n\'a pas été installé');
	}

}
}

function checkForMoreRecent(newOne, oldOne){
	if (FLfile.getSize(newOne)>FLfile.getSize(oldOne)){
		//fl.trace ("new file is bigger")
		return true;
	}else if (FLfile.getModificationDate(newOne)>FLfile.getModificationDate(oldOne)){
		//fl.trace ("new file is more recent")
		return true;
	}else{
		//fl.trace ("old file is more recent")
		return false;
	}
}

function askForReplace(name, destination, ext){
	if (confirm("Ancienne version de "+name.split("%20").join(" ")+" trouvé. Voulez vous remplacer la version actuelle?")){
		if (fl.fileExists(destination+name+"."+ext)) FLfile.remove (destination+name+"."+ext)		
		if (fl.fileExists(destination+name+".xml")) FLfile.remove (destination+name+".xml")
		if (fl.fileExists(destination+name+".png")) FLfile.remove (destination+name+".png")
		if (fl.fileExists(destination+"x2_"+name+".png")) FLfile.remove (destination+"x2_"+name+".png")
		return (true)
	}else{
		return (false)
	}
	
	
}