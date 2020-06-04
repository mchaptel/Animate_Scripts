



var doc = fl.getDocumentDOM();

var docTimeline = doc.getTimeline();


var layerNum;

var layerSelection = docTimeline.getSelectedLayers();

var layers = new Array();

var count = 0

; 




// sort selection by layer index

function askForValue(){

//prompt new value

	while (true){
		var newIndex = prompt("Commencer la numérotation à:");
		if (newIndex == null){
			// cancel pressed/no value
			break;
		}
		newIndex = parseInt(newIndex);
		if (newIndex!=NaN && newIndex>=0){
			// acceptable value
			break;
		}
		
		// incorrect value input
		alert("entrer un entier positif");
	}
	return (newIndex);
}


var count = askForValue();

if (count != NaN && count != null){

for ( var i=0;i<layerSelection.length;i++ )

{
 
	for ( var j=0;j<layerSelection.length;j++ ) 
	{
 
		if (layerSelection[i] < layerSelection[j])
 
		{

			var temp = layerSelection[i];

			layerSelection[i] = layerSelection[j];

			layerSelection[j] = temp;
		}

	}

}




for ( var i=0;i<layerSelection.length;i++ ) 


{
	


	var l = docTimeline.layers[layerSelection[i]];
	var layerName = l.name;
	
	if (count<10) {
		l.name = "0"+count+"_"+layerName;
	} else {
		l.name = count+"_"+layerName;
	}

	
count += 1;
}

}