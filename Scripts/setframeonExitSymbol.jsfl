//Commande écrite par Mathieu Chaptel. Pour toute demande, m.chaptel@gmail.com

var doc = fl.getDocumentDOM();
var tl = doc.getTimeline();
var frame = tl.currentFrame;

doc.exitEditMode();
doc.selection[0].firstFrame = frame;

