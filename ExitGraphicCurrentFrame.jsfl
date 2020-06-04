//Commande écrite par Mathieu Chaptel. Pour toute demande, m.chaptel@gmail.com

var doc = fl.getDocumentDOM();
var exitFrame = doc.getTimeline().currentFrame-INSTANCEFrameEntered;

fl.getDocumentDOM().exitEditMode();

if (doc.selection[0].loop != "single frame") doc.getTimeline().currentFrame += exitFrame;