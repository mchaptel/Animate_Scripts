//Commande écrite par Mathieu Chaptel. Pour toute demande, m.chaptel@gmail.com

var doc = fl.getDocumentDOM();
var tl = doc.getTimeline();

ease = [];
var frame = tl.layers[tl.currentLayer].frames[tl.currentFrame];
tween = frame.tweenType;

if (frame.hasCustomEase) ease = frame.getCustomEase();