//Commande écrite par Mathieu Chaptel. Pour toute demande, m.chaptel@gmail.com

var myStroke = fl.getDocumentDOM().getCustomStroke("toolbar");

var fill = fl.getDocumentDOM().getCustomFill("toolbar");

var color = myStroke.shapeFill.color;
myStroke.shapeFill.color = fill.color;
fill.color = color;


fl.getDocumentDOM().setCustomFill( fill);

fl.getDocumentDOM().setCustomStroke( myStroke );