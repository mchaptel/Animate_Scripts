doc = fl.getDocumentDOM();

sel = doc.selection;

if (sel.length==1 && sel[0].elementType == "instance"){
	elt = sel[0];
	doc.enterEditMode("inPlace");
	tl = doc.getTimeline();
	//tl.currentFrame = tl.frameCount+5;
	tl.insertFrames(5 , true , tl.frameCount)
	tl.insertBlankKeyframe();
	fl.runScript(fl.configURI+"Commands/reallyinplace_paste.jsfl");
	var frame = tl.currentFrame;
	doc.exitEditMode();
	elt.firstFrame = frame;
}