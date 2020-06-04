//--------------------------------------------------------------------
// Symbolz est un script qui permet de convertir plusieurs
// éléments répartis sur plusieurs images de plusieurs calques
// en un même symbole dont le placement suit les éléments convertis.
// Le nouveau symbole est alors placé sur un nouveau calque.
// version 1.11
//--------------------------------------------------------------------


var doc = fl.getDocumentDOM();
var rtl = doc.getTimeline();

function traceSelection() {
  if (doc.selection.length == 0) fl.trace("selection is empty");
  for (i in doc.selection) {
    fl.trace("---Item nb:" + i);
    fl.trace(doc.selection[i]);
    fl.trace(doc.selection[i].elementType);
    fl.trace("depth = " + doc.selection[i].depth);
    if (doc.selection[i].elementType == "instance") fl.trace(doc.selection[i].libraryItem.name);
    fl.trace("---");
  }
}

function sortSelection(bottomtoTop) {
  selectionArray = new Array();
  selectionArray = doc.selection;
  for (i = 0; i < selectionArray.length; i++) {
    for (j = i; j < selectionArray.length; j++) {
      if (bottomtoTop && selectionArray[i].depth > selectionArray[j].depth && selectionArray[i].layer) {
        temp = selectionArray[i];
        selectionArray[i] = selectionArray[j];
        selectionArray[j] = temp;
      } else if (selectionArray[i].depth < selectionArray[j].depth) {
        temp = selectionArray[i];
        selectionArray[i] = selectionArray[j];
        selectionArray[j] = temp;
      }
    }
  }
  return selectionArray;
}

function nextFreeName() {
  name = 0
  while (true) {
    if (!doc.library.itemExists("junk/shape" + name)) break;
    name++;
  }
  return ("shape" + name);
}

function selectLayerByName(name) {
  tl.setSelectedLayers(findLayerIndexByName(name), true);
}

function findLayerByName(name) {
  l = findLayerIndexByName(name);
  if (l == null) return null;
  return (tl.layers[l]);
}

function findLayerIndexByName(name) {
  for (k = 0; k < tl.layers.length; k++) {
    if (name == tl.layers[k].name) {
      return (k);
    }
  }
  return (null);
}

function isKeyframe(layer, frame) {
  if (tl.layers[layer].frames[frame].startFrame == frame) return true;
  return false;
}

function findKeyframes(layerArray) {
  var FramesArray = new Array();
  for (i = 0; i < layerArray[0].frameCount; i++) {
    for (j = 0; j < layerArray.length; j++) {
      var k = 0;
      while (true) {
        if (FramesArray[k] == i) break;
        if (k > FramesArray.length) {
          if (i == layerArray[j].frames[i].startFrame) FramesArray.push(i);
          break;
        }
        k++;
      }
    }
  }
  //fl.trace("FramesArray: "+FramesArray);
  return (FramesArray);
}

function findLayers(elementsArray) {
  var layersArray = new Array();
  for (i in elementsArray) {
    var j = 0;
    while (true) {
      if (layersArray[j] == elementsArray[i].layer) break;
      if (j > layersArray.length) {
        layersArray.push(elementsArray[i].layer);
        break;
      }
      j++;
    }
  }
  return (layersArray);
}

function findSelectionCenter() {
  if (doc.selection.length == 0) return ({ "x": 0, "y": 0, "success": false });
  var selectionRect = doc.getSelectionRect();
  var xpos = (selectionRect.right - selectionRect.left) / 2 + selectionRect.left
  var ypos = (selectionRect.bottom - selectionRect.top) / 2 + selectionRect.top
  return ({ "x": xpos, "y": ypos, "success": true });
}

function convertShapeIntoSymbol(shape) {
  doc.selectNone();
  doc.selection = [shape];
  shape.selected = true;
  var symbol = nextFreeName();
  doc.convertToSymbol("graphic", symbol, "center");
  doc.library.newFolder("junk");
  doc.library.moveToFolder("junk", symbol, true);
  return (doc.selection[0]);
}

function duplicateLayerTiming(newLayerName) {
  var keyframes = findKeyframes(findLayers(doc.selection));
  //fl.trace(keyframes);
  tl.addNewLayer(newLayerName);
  for (i in keyframes) {
    if (i != 0) tl.insertBlankKeyframe(keyframes[i]);
  }
  tl.currentLayer += 1;//return to original layer
}

function moveSelectionToLayer(selectionArray, curLayer, destLayer) {

  var keyframes = findKeyframes([tl.layers[destLayer]]);

  for (i = 0; i < keyframes.length; i++) {

    tl.currentFrame = keyframes[i];
    tl.currentLayer = curLayer;

    var frameElements = new Array();
    var elementsToMove = new Array();
    var elementsToBreak = new Array();
    for (l in tl.layers) {
      var layer = tl.layers[l]

      if (layer.layerType != "folder" && layer.visible && !layer.locked) {
        frameElements = frameElements.concat(layer.frames[keyframes[i]].elements);
      }
      //fl.trace(frameElements)
    }

    for (j = 0; j < selectionArray.length; j++) {
      for (k = 0; k < frameElements.length; k++) {
        if (selectionArray[j] == frameElements[k]) {
          if (selectionArray[j].elementType == "shape") {
            //fl.trace("converting to symbol")
            selectionArray[j] = convertShapeIntoSymbol(selectionArray[j]);
            elementsToBreak.push(selectionArray[j]);
          }
          elementsToMove.push(selectionArray[j]);
        }
      }
    }

    doc.selectNone();
    //fl.trace (elementsToMove);
    doc.selection = elementsToMove;
    //traceSelection();
    if (doc.selection.length != 0) {

      doc.clipCut();
      tl.currentLayer = destLayer;
      doc.clipPaste(true);
      for (s in doc.selection) {
        for (j in elementsToBreak) {
          //fl.trace(doc.selection[s]==elementsToBreak[j]);
          if (doc.selection[s].libraryItem == elementsToBreak[j].libraryItem) elementsToBreak[j] = doc.selection[s];
        }
      }
      doc.selectNone();
      doc.selection = elementsToBreak;
      //fl.trace ("selection to break: "+doc.selection);
      if (doc.selection.length != 0) doc.breakApart();
      if (doc.selection.length != 0) doc.breakApart();
    }
    tl.currentLayer = curLayer;
  }

}

function matchSymbolToFrames(layer, symbolName) {

  var l = findLayerIndexByName(layer.name);
  var destL = findLayerIndexByName(symbolName);
  var keyframes = findKeyframes([layer]);

  //place rectangle over each object

  for (i = 0; i < keyframes.length; i++) {
    var f = keyframes[i];
    tl.setSelectedLayers(l);
    tl.setSelectedFrames(f, f, true);
    var position = findSelectionCenter();
    tl.setSelectedLayers(destL);
    tl.setSelectedFrames(f, f, true);
    if (!isKeyframe(destL, f)) tl.insertBlankKeyframe(f);
    if (position.success) {
      doc.library.addItemToDocument(position, symbolName);
      tl.setSelectedFrames(f, f, true);
    }

  }

  //paste images in symbol
  tl.setSelectedLayers(l);
  tl.cutFrames(0, layer.frameCount);
  tl.deleteLayer();
  tl.setSelectedLayers(destL);
  //fl.trace(f+" "+tl.currentFrame);
  //tl.currentFrame = f;
  for (i in keyframes) {
    tl.setSelectedFrames(keyframes[i], keyframes[i], true);
    if (doc.selection.length > 0) {
      doc.enterEditMode('inPlace');
      doc.getTimeline().pasteFrames();
      break;
    }
  }

  //and center them
  tl2 = doc.getTimeline();
  //keyframes = findKeyframes(tl2.layers[tl2.currentLayer]);
  for (i in keyframes) {
    tl2.setSelectedFrames(keyframes[i], keyframes[i], true);
    position = findSelectionCenter();
    for (j in doc.selection) {
      doc.selection[j].x -= position.x;
      doc.selection[j].y -= position.y;
    }
  }
  doc.exitEditMode()

  for (i = 0; i < keyframes.length; i++) {
    f = keyframes[i];
    tl.setSelectedFrames(f, f, true);
    if (doc.selection.length != 0) {
      doc.selection[0].loop = "play once";
      doc.selection[0].firstFrame = f;
    }

  }

}

function convertLayerToGraphic(layer, symbolName) {

  var keyframes = findKeyframes([layer]);
  selectLayerByName(layer.name);

  for (i in keyframes) {
    doc.selectNone();
    tl.setSelectedFrames(keyframes[i], keyframes[i], true);
    if (doc.selection.length > 0) break;
  }
  var symbol = createDummySymbol(symbolName);
  doc.deleteSelection();
  matchSymbolToFrames(layer, symbolName);
}

function createDummySymbol(symbolName) {
  //fl.trace(doc.selection.length)
  var rect = doc.getSelectionRect();
  tl.addNewLayer(symbolName);
  if (!isKeyframe(findLayerIndexByName(symbolName), tl.currentFrame)) tl.insertKeyframe(tl.currentFrame);
  doc.addNewRectangle(rect, 0);
  tl.setSelectedFrames(tl.currentFrame, tl.currentFrame, true);
  doc.convertToSymbol("graphic", symbolName, "center");
  var symbol = doc.selection[0];
  return (symbol);
}

function FreeshapesToUnion() {
  var tempSel = doc.selection
  for (var i = 0; i < tempSel.length; i++) {
    if (tempSel[i].elementType != "shape" || tempSel[i].isDrawingObject || tempSel[i].isGroup) {
      tempSel[i].selected = false;
    }
  }
  if (doc.selection.length != 0) {
    doc.union()
    doc.arrange("back")
  }
  var newUnion = doc.selection[0]
  doc.selection = tempSel;
  return (newUnion);
}

function groupAllShapes() {
  var tempSel = doc.selection
  if (doc.selection.length != 0) {
    doc.group();
    doc.arrange("back")
  }
  var newSel = doc.selection;
  doc.selection = tempSel;
  return (newSel);
}

function breakAllGroups() {
  keyframes = findKeyframes([tl.currentLayer]);
  for (i in keyframes) {
    tl.setSelectedFrames(keyframes[i], keyframes[i], true);
    doc.breakApart();
  }

}

function main() {

  groupAllShapes();
  var sel = sortSelection(true);
  if (doc.selection.length == 0) {
    alert("Selectionnez d'abord les éléments à convertir");
    return;
  }
  while (true) {
    var symbolName = prompt("Nom du symbole à créer");
    if (doc.library.itemExists(symbolName)) {
      alert("ce nom de symbole existe déja");
    } else if (findLayerByName(symbolName) != null) {
      alert("utiliser un nom différent des calques actuels");
    } else if (symbolName == "") {
      alert("entrer un nom valide");
    } else {
      break;
    }
  }
  if (symbolName == null) return;
  duplicateLayerTiming(symbolName + "_temp");
  moveSelectionToLayer(sel, tl.currentLayer, findLayerIndexByName(symbolName + "_temp"));

  convertLayerToGraphic(findLayerByName(symbolName + "_temp"), symbolName);
  doc.library.deleteItem("junk");
}


fl.outputPanel.clear();

main();

