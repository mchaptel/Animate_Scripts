//Commande écrite par Mathieu Chaptel. Pour toute demande, m.chaptel@gmail.com

doc = fl.getDocumentDOM();

fl.outputPanel.clear();

//var place = save_edit_place();

var itemsDone = [];

for (var t=0; t<doc.timelines.length; t++){
	BreakAllObjects();
}
/*for (var t=0; t<doc.library.items.length; t++){
	doc.library.editItem(doc.library.items[t].name);
	fl.trace(doc.getTimeline().name)
	BreakAllObjects();
}*/

//restore_edit_place(place);

function BreakAllObjects(){
	//fl.trace ("breaking stuff")
	var tl = doc.getTimeline();
	
	if (itemsDone.indexOf(tl.libraryItem) != -1) return;
	
	var lockedLayers = [];

	for (var l=0; l<tl.layers.length; l++){
		lockedLayers.push(tl.layers[l].locked);
	}
		
	for (var l=0; l<tl.layers.length; l++){
		
		var ly = tl.layers[l]
		tl.setSelectedLayers(l, true);
		
		tl.setLayerProperty("locked", true, "all")
		tl.setLayerProperty("locked", false, "selected")
		
		for (var f=0; f<ly.frames.length; f++){
			
			var fr = ly.frames[f]
			
			if (fr.startFrame == f){
				
				tl.setSelectedFrames(f, f, true);
				elements = fr.elements
				
				breakAllElements(elements);
				//fl.trace (doc.selection.length)
				//if (doc.selection.length>0)doc.breakApart();
			}			
		}
	}
	
	for (var l=0; l<tl.layers.length; l++){
		tl.layers[l].locked = lockedLayers[l];
	}
	
	itemsDone.push(tl.libraryItem);
}

function breakAllElements(elements){
	for (var e=0; e<elements.length; e++){
		doc.selectNone();
		
		el = elements[e]
		
		//fl.trace (el)
		doc.selection = [el]
		if (doc.selection.length>0){
			if (el.isDrawingObject) {
				//fl.trace ("object")
				doc.breakApart();
				doc.selectNone();
			}else if (el.isGroup){
				//fl.trace ("group")
				doc.enterEditMode("inPlace")
				doc.selectAll();
				if (doc.selection.length>0) breakAllElements(doc.selection)
				doc.exitEditMode();
			}else if (el.elementType == "instance" && el.libraryItem.itemType=="graphic" && itemsDone.indexOf(el.libraryItem) == -1){
				//fl.trace ("symbol")
				doc.enterEditMode("inPlace")
				BreakAllObjects();
				doc.exitEditMode();
			}
		}
	}
}

function save_edit_place()
{
	var edit_stack = new Array();
	var edit_stack_entry;
	
	//fl.trace("saving edit place");

	edit_stack_entry = new Object();
	edit_stack_entry.frame = doc.getTimeline().currentFrame;
	edit_stack_entry.selection = doc.selection;
	edit_stack.push(edit_stack_entry);
	//fl.trace("initial frame: " + edit_stack_entry.frame);
	
	//fl.trace("initial timeline's name: " + doc.getTimeline().name);
	//fl.trace("initial core timeline's name: " + doc.timelines[doc.currentTimeline].name);
	while(doc.getTimeline().name != doc.timelines[doc.currentTimeline].name)
	{
		doc.exitEditMode();
		edit_stack_entry = new Object();
		edit_stack_entry.object = doc.selection[0];
		edit_stack_entry.frame = doc.getTimeline().currentFrame;
		edit_stack.push(edit_stack_entry);

		//fl.trace("added " + edit_stack_entry.object.libraryItem.name + " to the edit stack");
		
		//fl.trace("exited back to " + doc.getTimeline().name + ", now stack length is " + edit_stack.length);
	}
	
	edit_stack.push(doc.currentTimeline);
	
	//fl.trace("edit stack length: " + edit_stack.length);
	return edit_stack;
}

/////////////////////////////////////////////////////////////////////////
// restore_edit_place(edit_Stack)
//
// Remembers where the user is currently editing-in-place
/////////////////////////////////////////////////////////////////////////

function restore_edit_place(edit_stack)
{
	var edit_stack_entry;
	
	//fl.trace("restoring edit place");
	
	doc.currentTimeline = edit_stack.pop();
	
	while(doc.getTimeline().name != doc.timelines[doc.currentTimeline].name)
	{
		doc.exitEditMode();
	}
	
	while(edit_stack.length > 1)
	{
		edit_stack_entry = edit_stack.pop();
		doc.getTimeline().currentFrame = edit_stack_entry.frame;
		//fl.trace("about to set selection in " + doc.getTimeline().name);
		//fl.trace("about to select " + edit_stack_entry.object.libraryItem.name + " on frame " + edit_stack_entry.frame);
		doc.selection = [edit_stack_entry.object];
		//fl.trace("re-editing " + doc.selection[0].libraryItem.name + " on frame " + edit_stack_entry.frame);
		doc.enterEditMode("inPlace");
	}
	
	edit_stack_entry = edit_stack.pop();
	doc.getTimeline().currentFrame = edit_stack_entry.frame;
	//fl.trace("final frame: " + edit_stack_entry.frame);
	doc.selection = [];
	
}