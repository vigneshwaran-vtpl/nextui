// src/dom.ts
function isElement(el) {
  return el != null && typeof el == "object" && "nodeType" in el && el.nodeType === Node.ELEMENT_NODE;
}
function isHTMLElement(el) {
  var _a;
  if (!isElement(el)) {
    return false;
  }
  const win = (_a = el.ownerDocument.defaultView) != null ? _a : window;
  return el instanceof win.HTMLElement;
}
function getOwnerDocument(node) {
  var _a;
  return isElement(node) ? (_a = node.ownerDocument) != null ? _a : document : document;
}
function getActiveElement(node) {
  const doc = getOwnerDocument(node);
  return doc == null ? void 0 : doc.activeElement;
}

export {
  isElement,
  isHTMLElement,
  getOwnerDocument,
  getActiveElement
};
