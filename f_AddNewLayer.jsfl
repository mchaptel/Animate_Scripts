
fl.getDocumentDOM().getTimeline().addNewLayer();

var curFrame=fl.getDocumentDOM().getTimeline().currentFrame

if (curFrame!=0) {
	fl.getDocumentDOM().getTimeline().insertKeyframe(curFrame);
}
