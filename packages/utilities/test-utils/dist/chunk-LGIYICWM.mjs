import {
  computeAccessibleDescription,
  computeAccessibleName,
  require_build,
  require_lib,
  require_lz_string
} from "./chunk-XC7LBIMP.mjs";
import {
  __toESM
} from "./chunk-PJDFGZWC.mjs";

// ../../../node_modules/.pnpm/@testing-library+dom@8.20.1/node_modules/@testing-library/dom/dist/@testing-library/dom.esm.js
var prettyFormat = __toESM(require_build());
var import_aria_query = __toESM(require_lib());
var import_lz_string = __toESM(require_lz_string());
function escapeHTML(str) {
  return str.replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
var printProps = (keys, props, config2, indentation, depth, refs, printer) => {
  const indentationNext = indentation + config2.indent;
  const colors = config2.colors;
  return keys.map((key) => {
    const value = props[key];
    let printed = printer(value, config2, indentationNext, depth, refs);
    if (typeof value !== "string") {
      if (printed.indexOf("\n") !== -1) {
        printed = config2.spacingOuter + indentationNext + printed + config2.spacingOuter + indentation;
      }
      printed = "{" + printed + "}";
    }
    return config2.spacingInner + indentation + colors.prop.open + key + colors.prop.close + "=" + colors.value.open + printed + colors.value.close;
  }).join("");
};
var NodeTypeTextNode = 3;
var printChildren = (children, config2, indentation, depth, refs, printer) => children.map((child) => {
  const printedChild = typeof child === "string" ? printText(child, config2) : printer(child, config2, indentation, depth, refs);
  if (printedChild === "" && typeof child === "object" && child !== null && child.nodeType !== NodeTypeTextNode) {
    return "";
  }
  return config2.spacingOuter + indentation + printedChild;
}).join("");
var printText = (text, config2) => {
  const contentColor = config2.colors.content;
  return contentColor.open + escapeHTML(text) + contentColor.close;
};
var printComment = (comment, config2) => {
  const commentColor = config2.colors.comment;
  return commentColor.open + "<!--" + escapeHTML(comment) + "-->" + commentColor.close;
};
var printElement = (type, printedProps, printedChildren, config2, indentation) => {
  const tagColor = config2.colors.tag;
  return tagColor.open + "<" + type + (printedProps && tagColor.close + printedProps + config2.spacingOuter + indentation + tagColor.open) + (printedChildren ? ">" + tagColor.close + printedChildren + config2.spacingOuter + indentation + tagColor.open + "</" + type : (printedProps && !config2.min ? "" : " ") + "/") + ">" + tagColor.close;
};
var printElementAsLeaf = (type, config2) => {
  const tagColor = config2.colors.tag;
  return tagColor.open + "<" + type + tagColor.close + " \u2026" + tagColor.open + " />" + tagColor.close;
};
var ELEMENT_NODE$1 = 1;
var TEXT_NODE$1 = 3;
var COMMENT_NODE$1 = 8;
var FRAGMENT_NODE = 11;
var ELEMENT_REGEXP = /^((HTML|SVG)\w*)?Element$/;
var testNode = (val) => {
  const constructorName = val.constructor.name;
  const {
    nodeType,
    tagName
  } = val;
  const isCustomElement = typeof tagName === "string" && tagName.includes("-") || typeof val.hasAttribute === "function" && val.hasAttribute("is");
  return nodeType === ELEMENT_NODE$1 && (ELEMENT_REGEXP.test(constructorName) || isCustomElement) || nodeType === TEXT_NODE$1 && constructorName === "Text" || nodeType === COMMENT_NODE$1 && constructorName === "Comment" || nodeType === FRAGMENT_NODE && constructorName === "DocumentFragment";
};
function nodeIsText(node) {
  return node.nodeType === TEXT_NODE$1;
}
function nodeIsComment(node) {
  return node.nodeType === COMMENT_NODE$1;
}
function nodeIsFragment(node) {
  return node.nodeType === FRAGMENT_NODE;
}
function createDOMElementFilter(filterNode) {
  return {
    test: (val) => {
      var _val$constructor2;
      return (val == null ? void 0 : (_val$constructor2 = val.constructor) == null ? void 0 : _val$constructor2.name) && testNode(val);
    },
    serialize: (node, config2, indentation, depth, refs, printer) => {
      if (nodeIsText(node)) {
        return printText(node.data, config2);
      }
      if (nodeIsComment(node)) {
        return printComment(node.data, config2);
      }
      const type = nodeIsFragment(node) ? "DocumentFragment" : node.tagName.toLowerCase();
      if (++depth > config2.maxDepth) {
        return printElementAsLeaf(type, config2);
      }
      return printElement(type, printProps(nodeIsFragment(node) ? [] : Array.from(node.attributes).map((attr) => attr.name).sort(), nodeIsFragment(node) ? {} : Array.from(node.attributes).reduce((props, attribute) => {
        props[attribute.name] = attribute.value;
        return props;
      }, {}), config2, indentation + config2.indent, depth, refs, printer), printChildren(Array.prototype.slice.call(node.childNodes || node.children).filter(filterNode), config2, indentation + config2.indent, depth, refs, printer), config2, indentation);
    }
  };
}
var chalk = null;
var readFileSync = null;
var codeFrameColumns = null;
try {
  const nodeRequire = module && module.require;
  readFileSync = nodeRequire.call(module, "fs").readFileSync;
  codeFrameColumns = nodeRequire.call(module, "@babel/code-frame").codeFrameColumns;
  chalk = nodeRequire.call(module, "chalk");
} catch {
}
function getCodeFrame(frame) {
  const locationStart = frame.indexOf("(") + 1;
  const locationEnd = frame.indexOf(")");
  const frameLocation = frame.slice(locationStart, locationEnd);
  const frameLocationElements = frameLocation.split(":");
  const [filename, line, column] = [frameLocationElements[0], parseInt(frameLocationElements[1], 10), parseInt(frameLocationElements[2], 10)];
  let rawFileContents = "";
  try {
    rawFileContents = readFileSync(filename, "utf-8");
  } catch {
    return "";
  }
  const codeFrame = codeFrameColumns(rawFileContents, {
    start: {
      line,
      column
    }
  }, {
    highlightCode: true,
    linesBelow: 0
  });
  return chalk.dim(frameLocation) + "\n" + codeFrame + "\n";
}
function getUserCodeFrame() {
  if (!readFileSync || !codeFrameColumns) {
    return "";
  }
  const err = new Error();
  const firstClientCodeFrame = err.stack.split("\n").slice(1).find((frame) => !frame.includes("node_modules/"));
  return getCodeFrame(firstClientCodeFrame);
}
var TEXT_NODE = 3;
function jestFakeTimersAreEnabled() {
  if (typeof jest !== "undefined" && jest !== null) {
    return setTimeout._isMockFunction === true || Object.prototype.hasOwnProperty.call(setTimeout, "clock");
  }
  return false;
}
function getDocument() {
  if (typeof window === "undefined") {
    throw new Error("Could not find default container");
  }
  return window.document;
}
function getWindowFromNode(node) {
  if (node.defaultView) {
    return node.defaultView;
  } else if (node.ownerDocument && node.ownerDocument.defaultView) {
    return node.ownerDocument.defaultView;
  } else if (node.window) {
    return node.window;
  } else if (node.ownerDocument && node.ownerDocument.defaultView === null) {
    throw new Error("It looks like the window object is not available for the provided node.");
  } else if (node.then instanceof Function) {
    throw new Error("It looks like you passed a Promise object instead of a DOM node. Did you do something like `fireEvent.click(screen.findBy...` when you meant to use a `getBy` query `fireEvent.click(screen.getBy...`, or await the findBy query `fireEvent.click(await screen.findBy...`?");
  } else if (Array.isArray(node)) {
    throw new Error("It looks like you passed an Array instead of a DOM node. Did you do something like `fireEvent.click(screen.getAllBy...` when you meant to use a `getBy` query `fireEvent.click(screen.getBy...`?");
  } else if (typeof node.debug === "function" && typeof node.logTestingPlaygroundURL === "function") {
    throw new Error("It looks like you passed a `screen` object. Did you do something like `fireEvent.click(screen, ...` when you meant to use a query, e.g. `fireEvent.click(screen.getBy..., `?");
  } else {
    throw new Error("The given node is not an Element, the node type is: " + typeof node + ".");
  }
}
function checkContainerType(container) {
  if (!container || !(typeof container.querySelector === "function") || !(typeof container.querySelectorAll === "function")) {
    throw new TypeError("Expected container to be an Element, a Document or a DocumentFragment but got " + getTypeName(container) + ".");
  }
  function getTypeName(object) {
    if (typeof object === "object") {
      return object === null ? "null" : object.constructor.name;
    }
    return typeof object;
  }
}
var shouldHighlight = () => {
  let colors;
  try {
    var _process, _process$env;
    colors = JSON.parse((_process = process) == null ? void 0 : (_process$env = _process.env) == null ? void 0 : _process$env.COLORS);
  } catch (e) {
  }
  if (typeof colors === "boolean") {
    return colors;
  } else {
    return typeof process !== "undefined" && process.versions !== void 0 && process.versions.node !== void 0;
  }
};
var {
  DOMCollection
} = prettyFormat.plugins;
var ELEMENT_NODE = 1;
var COMMENT_NODE = 8;
function filterCommentsAndDefaultIgnoreTagsTags(value) {
  return value.nodeType !== COMMENT_NODE && (value.nodeType !== ELEMENT_NODE || !value.matches(getConfig().defaultIgnore));
}
function prettyDOM(dom, maxLength, options) {
  if (options === void 0) {
    options = {};
  }
  if (!dom) {
    dom = getDocument().body;
  }
  if (typeof maxLength !== "number") {
    maxLength = typeof process !== "undefined" && process.env.DEBUG_PRINT_LIMIT || 7e3;
  }
  if (maxLength === 0) {
    return "";
  }
  if (dom.documentElement) {
    dom = dom.documentElement;
  }
  let domTypeName = typeof dom;
  if (domTypeName === "object") {
    domTypeName = dom.constructor.name;
  } else {
    dom = {};
  }
  if (!("outerHTML" in dom)) {
    throw new TypeError("Expected an element or document but got " + domTypeName);
  }
  const {
    filterNode = filterCommentsAndDefaultIgnoreTagsTags,
    ...prettyFormatOptions
  } = options;
  const debugContent = prettyFormat.format(dom, {
    plugins: [createDOMElementFilter(filterNode), DOMCollection],
    printFunctionName: false,
    highlight: shouldHighlight(),
    ...prettyFormatOptions
  });
  return maxLength !== void 0 && dom.outerHTML.length > maxLength ? debugContent.slice(0, maxLength) + "..." : debugContent;
}
var logDOM = function() {
  const userCodeFrame = getUserCodeFrame();
  if (userCodeFrame) {
    console.log(prettyDOM(...arguments) + "\n\n" + userCodeFrame);
  } else {
    console.log(prettyDOM(...arguments));
  }
};
var config = {
  testIdAttribute: "data-testid",
  asyncUtilTimeout: 1e3,
  asyncWrapper: (cb) => cb(),
  unstable_advanceTimersWrapper: (cb) => cb(),
  eventWrapper: (cb) => cb(),
  defaultHidden: false,
  defaultIgnore: "script, style",
  showOriginalStackTrace: false,
  throwSuggestions: false,
  getElementError(message, container) {
    const prettifiedDOM = prettyDOM(container);
    const error = new Error([message, "Ignored nodes: comments, " + config.defaultIgnore + "\n" + prettifiedDOM].filter(Boolean).join("\n\n"));
    error.name = "TestingLibraryElementError";
    return error;
  },
  _disableExpensiveErrorDiagnostics: false,
  computedStyleSupportsPseudoElements: false
};
function runWithExpensiveErrorDiagnosticsDisabled(callback) {
  try {
    config._disableExpensiveErrorDiagnostics = true;
    return callback();
  } finally {
    config._disableExpensiveErrorDiagnostics = false;
  }
}
function getConfig() {
  return config;
}
var labelledNodeNames = ["button", "meter", "output", "progress", "select", "textarea", "input"];
function getTextContent(node) {
  if (labelledNodeNames.includes(node.nodeName.toLowerCase())) {
    return "";
  }
  if (node.nodeType === TEXT_NODE)
    return node.textContent;
  return Array.from(node.childNodes).map((childNode) => getTextContent(childNode)).join("");
}
function getLabelContent(element) {
  let textContent;
  if (element.tagName.toLowerCase() === "label") {
    textContent = getTextContent(element);
  } else {
    textContent = element.value || element.textContent;
  }
  return textContent;
}
function getRealLabels(element) {
  if (element.labels !== void 0) {
    var _labels;
    return (_labels = element.labels) != null ? _labels : [];
  }
  if (!isLabelable(element))
    return [];
  const labels = element.ownerDocument.querySelectorAll("label");
  return Array.from(labels).filter((label) => label.control === element);
}
function isLabelable(element) {
  return /BUTTON|METER|OUTPUT|PROGRESS|SELECT|TEXTAREA/.test(element.tagName) || element.tagName === "INPUT" && element.getAttribute("type") !== "hidden";
}
function getLabels(container, element, _temp) {
  let {
    selector = "*"
  } = _temp === void 0 ? {} : _temp;
  const ariaLabelledBy = element.getAttribute("aria-labelledby");
  const labelsId = ariaLabelledBy ? ariaLabelledBy.split(" ") : [];
  return labelsId.length ? labelsId.map((labelId) => {
    const labellingElement = container.querySelector('[id="' + labelId + '"]');
    return labellingElement ? {
      content: getLabelContent(labellingElement),
      formControl: null
    } : {
      content: "",
      formControl: null
    };
  }) : Array.from(getRealLabels(element)).map((label) => {
    const textToMatch = getLabelContent(label);
    const formControlSelector = "button, input, meter, output, progress, select, textarea";
    const labelledFormControl = Array.from(label.querySelectorAll(formControlSelector)).filter((formControlElement) => formControlElement.matches(selector))[0];
    return {
      content: textToMatch,
      formControl: labelledFormControl
    };
  });
}
function assertNotNullOrUndefined(matcher) {
  if (matcher === null || matcher === void 0) {
    throw new Error(
      "It looks like " + matcher + " was passed instead of a matcher. Did you do something like getByText(" + matcher + ")?"
    );
  }
}
function fuzzyMatches(textToMatch, node, matcher, normalizer) {
  if (typeof textToMatch !== "string") {
    return false;
  }
  assertNotNullOrUndefined(matcher);
  const normalizedText = normalizer(textToMatch);
  if (typeof matcher === "string" || typeof matcher === "number") {
    return normalizedText.toLowerCase().includes(matcher.toString().toLowerCase());
  } else if (typeof matcher === "function") {
    return matcher(normalizedText, node);
  } else {
    return matchRegExp(matcher, normalizedText);
  }
}
function matches(textToMatch, node, matcher, normalizer) {
  if (typeof textToMatch !== "string") {
    return false;
  }
  assertNotNullOrUndefined(matcher);
  const normalizedText = normalizer(textToMatch);
  if (matcher instanceof Function) {
    return matcher(normalizedText, node);
  } else if (matcher instanceof RegExp) {
    return matchRegExp(matcher, normalizedText);
  } else {
    return normalizedText === String(matcher);
  }
}
function getDefaultNormalizer(_temp) {
  let {
    trim = true,
    collapseWhitespace = true
  } = _temp === void 0 ? {} : _temp;
  return (text) => {
    let normalizedText = text;
    normalizedText = trim ? normalizedText.trim() : normalizedText;
    normalizedText = collapseWhitespace ? normalizedText.replace(/\s+/g, " ") : normalizedText;
    return normalizedText;
  };
}
function makeNormalizer(_ref) {
  let {
    trim,
    collapseWhitespace,
    normalizer
  } = _ref;
  if (!normalizer) {
    return getDefaultNormalizer({
      trim,
      collapseWhitespace
    });
  }
  if (typeof trim !== "undefined" || typeof collapseWhitespace !== "undefined") {
    throw new Error('trim and collapseWhitespace are not supported with a normalizer. If you want to use the default trim and collapseWhitespace logic in your normalizer, use "getDefaultNormalizer({trim, collapseWhitespace})" and compose that into your normalizer');
  }
  return normalizer;
}
function matchRegExp(matcher, text) {
  const match = matcher.test(text);
  if (matcher.global && matcher.lastIndex !== 0) {
    console.warn("To match all elements we had to reset the lastIndex of the RegExp because the global flag is enabled. We encourage to remove the global flag from the RegExp.");
    matcher.lastIndex = 0;
  }
  return match;
}
function getNodeText(node) {
  if (node.matches("input[type=submit], input[type=button], input[type=reset]")) {
    return node.value;
  }
  return Array.from(node.childNodes).filter((child) => child.nodeType === TEXT_NODE && Boolean(child.textContent)).map((c) => c.textContent).join("");
}
var elementRoleList = buildElementRoleList(import_aria_query.elementRoles);
function isSubtreeInaccessible(element) {
  if (element.hidden === true) {
    return true;
  }
  if (element.getAttribute("aria-hidden") === "true") {
    return true;
  }
  const window2 = element.ownerDocument.defaultView;
  if (window2.getComputedStyle(element).display === "none") {
    return true;
  }
  return false;
}
function isInaccessible(element, options) {
  if (options === void 0) {
    options = {};
  }
  const {
    isSubtreeInaccessible: isSubtreeInaccessibleImpl = isSubtreeInaccessible
  } = options;
  const window2 = element.ownerDocument.defaultView;
  if (window2.getComputedStyle(element).visibility === "hidden") {
    return true;
  }
  let currentElement = element;
  while (currentElement) {
    if (isSubtreeInaccessibleImpl(currentElement)) {
      return true;
    }
    currentElement = currentElement.parentElement;
  }
  return false;
}
function getImplicitAriaRoles(currentNode) {
  for (const {
    match,
    roles: roles2
  } of elementRoleList) {
    if (match(currentNode)) {
      return [...roles2];
    }
  }
  return [];
}
function buildElementRoleList(elementRolesMap) {
  function makeElementSelector(_ref) {
    let {
      name,
      attributes
    } = _ref;
    return "" + name + attributes.map((_ref2) => {
      let {
        name: attributeName,
        value,
        constraints = []
      } = _ref2;
      const shouldNotExist = constraints.indexOf("undefined") !== -1;
      if (shouldNotExist) {
        return ":not([" + attributeName + "])";
      } else if (value) {
        return "[" + attributeName + '="' + value + '"]';
      } else {
        return "[" + attributeName + "]";
      }
    }).join("");
  }
  function getSelectorSpecificity(_ref3) {
    let {
      attributes = []
    } = _ref3;
    return attributes.length;
  }
  function bySelectorSpecificity(_ref4, _ref5) {
    let {
      specificity: leftSpecificity
    } = _ref4;
    let {
      specificity: rightSpecificity
    } = _ref5;
    return rightSpecificity - leftSpecificity;
  }
  function match(element) {
    let {
      attributes = []
    } = element;
    const typeTextIndex = attributes.findIndex((attribute) => attribute.value && attribute.name === "type" && attribute.value === "text");
    if (typeTextIndex >= 0) {
      attributes = [...attributes.slice(0, typeTextIndex), ...attributes.slice(typeTextIndex + 1)];
    }
    const selector = makeElementSelector({
      ...element,
      attributes
    });
    return (node) => {
      if (typeTextIndex >= 0 && node.type !== "text") {
        return false;
      }
      return node.matches(selector);
    };
  }
  let result = [];
  for (const [element, roles2] of elementRolesMap.entries()) {
    result = [...result, {
      match: match(element),
      roles: Array.from(roles2),
      specificity: getSelectorSpecificity(element)
    }];
  }
  return result.sort(bySelectorSpecificity);
}
function getRoles(container, _temp) {
  let {
    hidden = false
  } = _temp === void 0 ? {} : _temp;
  function flattenDOM(node) {
    return [node, ...Array.from(node.children).reduce((acc, child) => [...acc, ...flattenDOM(child)], [])];
  }
  return flattenDOM(container).filter((element) => {
    return hidden === false ? isInaccessible(element) === false : true;
  }).reduce((acc, node) => {
    let roles2 = [];
    if (node.hasAttribute("role")) {
      roles2 = node.getAttribute("role").split(" ").slice(0, 1);
    } else {
      roles2 = getImplicitAriaRoles(node);
    }
    return roles2.reduce((rolesAcc, role) => Array.isArray(rolesAcc[role]) ? {
      ...rolesAcc,
      [role]: [...rolesAcc[role], node]
    } : {
      ...rolesAcc,
      [role]: [node]
    }, acc);
  }, {});
}
function prettyRoles(dom, _ref6) {
  let {
    hidden,
    includeDescription
  } = _ref6;
  const roles2 = getRoles(dom, {
    hidden
  });
  return Object.entries(roles2).filter((_ref7) => {
    let [role] = _ref7;
    return role !== "generic";
  }).map((_ref8) => {
    let [role, elements] = _ref8;
    const delimiterBar = "-".repeat(50);
    const elementsString = elements.map((el) => {
      const nameString = 'Name "' + computeAccessibleName(el, {
        computedStyleSupportsPseudoElements: getConfig().computedStyleSupportsPseudoElements
      }) + '":\n';
      const domString = prettyDOM(el.cloneNode(false));
      if (includeDescription) {
        const descriptionString = 'Description "' + computeAccessibleDescription(el, {
          computedStyleSupportsPseudoElements: getConfig().computedStyleSupportsPseudoElements
        }) + '":\n';
        return "" + nameString + descriptionString + domString;
      }
      return "" + nameString + domString;
    }).join("\n\n");
    return role + ":\n\n" + elementsString + "\n\n" + delimiterBar;
  }).join("\n");
}
function computeAriaSelected(element) {
  if (element.tagName === "OPTION") {
    return element.selected;
  }
  return checkBooleanAttribute(element, "aria-selected");
}
function computeAriaChecked(element) {
  if ("indeterminate" in element && element.indeterminate) {
    return void 0;
  }
  if ("checked" in element) {
    return element.checked;
  }
  return checkBooleanAttribute(element, "aria-checked");
}
function computeAriaPressed(element) {
  return checkBooleanAttribute(element, "aria-pressed");
}
function computeAriaCurrent(element) {
  var _ref9, _checkBooleanAttribut;
  return (_ref9 = (_checkBooleanAttribut = checkBooleanAttribute(element, "aria-current")) != null ? _checkBooleanAttribut : element.getAttribute("aria-current")) != null ? _ref9 : false;
}
function computeAriaExpanded(element) {
  return checkBooleanAttribute(element, "aria-expanded");
}
function checkBooleanAttribute(element, attribute) {
  const attributeValue = element.getAttribute(attribute);
  if (attributeValue === "true") {
    return true;
  }
  if (attributeValue === "false") {
    return false;
  }
  return void 0;
}
function computeHeadingLevel(element) {
  const implicitHeadingLevels = {
    H1: 1,
    H2: 2,
    H3: 3,
    H4: 4,
    H5: 5,
    H6: 6
  };
  const ariaLevelAttribute = element.getAttribute("aria-level") && Number(element.getAttribute("aria-level"));
  return ariaLevelAttribute || implicitHeadingLevels[element.tagName];
}
var normalize = getDefaultNormalizer();
function escapeRegExp(string) {
  return string.replace(/[.*+\-?^${}()|[\]\\]/g, "\\$&");
}
function getRegExpMatcher(string) {
  return new RegExp(escapeRegExp(string.toLowerCase()), "i");
}
function makeSuggestion(queryName, element, content, _ref) {
  let {
    variant,
    name
  } = _ref;
  let warning = "";
  const queryOptions = {};
  const queryArgs = [["Role", "TestId"].includes(queryName) ? content : getRegExpMatcher(content)];
  if (name) {
    queryOptions.name = getRegExpMatcher(name);
  }
  if (queryName === "Role" && isInaccessible(element)) {
    queryOptions.hidden = true;
    warning = "Element is inaccessible. This means that the element and all its children are invisible to screen readers.\n    If you are using the aria-hidden prop, make sure this is the right choice for your case.\n    ";
  }
  if (Object.keys(queryOptions).length > 0) {
    queryArgs.push(queryOptions);
  }
  const queryMethod = variant + "By" + queryName;
  return {
    queryName,
    queryMethod,
    queryArgs,
    variant,
    warning,
    toString() {
      if (warning) {
        console.warn(warning);
      }
      let [text, options] = queryArgs;
      text = typeof text === "string" ? "'" + text + "'" : text;
      options = options ? ", { " + Object.entries(options).map((_ref2) => {
        let [k, v] = _ref2;
        return k + ": " + v;
      }).join(", ") + " }" : "";
      return queryMethod + "(" + text + options + ")";
    }
  };
}
function canSuggest(currentMethod, requestedMethod, data) {
  return data && (!requestedMethod || requestedMethod.toLowerCase() === currentMethod.toLowerCase());
}
function getSuggestedQuery(element, variant, method) {
  var _element$getAttribute, _getImplicitAriaRoles;
  if (variant === void 0) {
    variant = "get";
  }
  if (element.matches(getConfig().defaultIgnore)) {
    return void 0;
  }
  const role = (_element$getAttribute = element.getAttribute("role")) != null ? _element$getAttribute : (_getImplicitAriaRoles = getImplicitAriaRoles(element)) == null ? void 0 : _getImplicitAriaRoles[0];
  if (role !== "generic" && canSuggest("Role", method, role)) {
    return makeSuggestion("Role", element, role, {
      variant,
      name: computeAccessibleName(element, {
        computedStyleSupportsPseudoElements: getConfig().computedStyleSupportsPseudoElements
      })
    });
  }
  const labelText = getLabels(document, element).map((label) => label.content).join(" ");
  if (canSuggest("LabelText", method, labelText)) {
    return makeSuggestion("LabelText", element, labelText, {
      variant
    });
  }
  const placeholderText = element.getAttribute("placeholder");
  if (canSuggest("PlaceholderText", method, placeholderText)) {
    return makeSuggestion("PlaceholderText", element, placeholderText, {
      variant
    });
  }
  const textContent = normalize(getNodeText(element));
  if (canSuggest("Text", method, textContent)) {
    return makeSuggestion("Text", element, textContent, {
      variant
    });
  }
  if (canSuggest("DisplayValue", method, element.value)) {
    return makeSuggestion("DisplayValue", element, normalize(element.value), {
      variant
    });
  }
  const alt = element.getAttribute("alt");
  if (canSuggest("AltText", method, alt)) {
    return makeSuggestion("AltText", element, alt, {
      variant
    });
  }
  const title = element.getAttribute("title");
  if (canSuggest("Title", method, title)) {
    return makeSuggestion("Title", element, title, {
      variant
    });
  }
  const testId = element.getAttribute(getConfig().testIdAttribute);
  if (canSuggest("TestId", method, testId)) {
    return makeSuggestion("TestId", element, testId, {
      variant
    });
  }
  return void 0;
}
function copyStackTrace(target, source) {
  target.stack = source.stack.replace(source.message, target.message);
}
function waitFor(callback, _ref) {
  let {
    container = getDocument(),
    timeout = getConfig().asyncUtilTimeout,
    showOriginalStackTrace = getConfig().showOriginalStackTrace,
    stackTraceError,
    interval = 50,
    onTimeout = (error) => {
      error.message = getConfig().getElementError(error.message, container).message;
      return error;
    },
    mutationObserverOptions = {
      subtree: true,
      childList: true,
      attributes: true,
      characterData: true
    }
  } = _ref;
  if (typeof callback !== "function") {
    throw new TypeError("Received `callback` arg must be a function");
  }
  return new Promise(async (resolve, reject) => {
    let lastError, intervalId, observer;
    let finished = false;
    let promiseStatus = "idle";
    const overallTimeoutTimer = setTimeout(handleTimeout, timeout);
    const usingJestFakeTimers = jestFakeTimersAreEnabled();
    if (usingJestFakeTimers) {
      const {
        unstable_advanceTimersWrapper: advanceTimersWrapper
      } = getConfig();
      checkCallback();
      while (!finished) {
        if (!jestFakeTimersAreEnabled()) {
          const error = new Error("Changed from using fake timers to real timers while using waitFor. This is not allowed and will result in very strange behavior. Please ensure you're awaiting all async things your test is doing before changing to real timers. For more info, please go to https://github.com/testing-library/dom-testing-library/issues/830");
          if (!showOriginalStackTrace)
            copyStackTrace(error, stackTraceError);
          reject(error);
          return;
        }
        advanceTimersWrapper(() => {
          jest.advanceTimersByTime(interval);
        });
        checkCallback();
        if (finished) {
          break;
        }
        await advanceTimersWrapper(async () => {
          await new Promise((r) => {
            setTimeout(r, 0);
            jest.advanceTimersByTime(0);
          });
        });
      }
    } else {
      try {
        checkContainerType(container);
      } catch (e) {
        reject(e);
        return;
      }
      intervalId = setInterval(checkRealTimersCallback, interval);
      const {
        MutationObserver
      } = getWindowFromNode(container);
      observer = new MutationObserver(checkRealTimersCallback);
      observer.observe(container, mutationObserverOptions);
      checkCallback();
    }
    function onDone(error, result) {
      finished = true;
      clearTimeout(overallTimeoutTimer);
      if (!usingJestFakeTimers) {
        clearInterval(intervalId);
        observer.disconnect();
      }
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    }
    function checkRealTimersCallback() {
      if (jestFakeTimersAreEnabled()) {
        const error = new Error("Changed from using real timers to fake timers while using waitFor. This is not allowed and will result in very strange behavior. Please ensure you're awaiting all async things your test is doing before changing to fake timers. For more info, please go to https://github.com/testing-library/dom-testing-library/issues/830");
        if (!showOriginalStackTrace)
          copyStackTrace(error, stackTraceError);
        return reject(error);
      } else {
        return checkCallback();
      }
    }
    function checkCallback() {
      if (promiseStatus === "pending")
        return;
      try {
        const result = runWithExpensiveErrorDiagnosticsDisabled(callback);
        if (typeof (result == null ? void 0 : result.then) === "function") {
          promiseStatus = "pending";
          result.then((resolvedValue) => {
            promiseStatus = "resolved";
            onDone(null, resolvedValue);
          }, (rejectedValue) => {
            promiseStatus = "rejected";
            lastError = rejectedValue;
          });
        } else {
          onDone(null, result);
        }
      } catch (error) {
        lastError = error;
      }
    }
    function handleTimeout() {
      let error;
      if (lastError) {
        error = lastError;
        if (!showOriginalStackTrace && error.name === "TestingLibraryElementError") {
          copyStackTrace(error, stackTraceError);
        }
      } else {
        error = new Error("Timed out in waitFor.");
        if (!showOriginalStackTrace) {
          copyStackTrace(error, stackTraceError);
        }
      }
      onDone(onTimeout(error), null);
    }
  });
}
function waitForWrapper(callback, options) {
  const stackTraceError = new Error("STACK_TRACE_MESSAGE");
  return getConfig().asyncWrapper(() => waitFor(callback, {
    stackTraceError,
    ...options
  }));
}
function getElementError(message, container) {
  return getConfig().getElementError(message, container);
}
function getMultipleElementsFoundError(message, container) {
  return getElementError(message + "\n\n(If this is intentional, then use the `*AllBy*` variant of the query (like `queryAllByText`, `getAllByText`, or `findAllByText`)).", container);
}
function queryAllByAttribute(attribute, container, text, _temp) {
  let {
    exact = true,
    collapseWhitespace,
    trim,
    normalizer
  } = _temp === void 0 ? {} : _temp;
  const matcher = exact ? matches : fuzzyMatches;
  const matchNormalizer = makeNormalizer({
    collapseWhitespace,
    trim,
    normalizer
  });
  return Array.from(container.querySelectorAll("[" + attribute + "]")).filter((node) => matcher(node.getAttribute(attribute), node, text, matchNormalizer));
}
function makeSingleQuery(allQuery, getMultipleError2) {
  return function(container) {
    for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }
    const els = allQuery(container, ...args);
    if (els.length > 1) {
      const elementStrings = els.map((element) => getElementError(null, element).message).join("\n\n");
      throw getMultipleElementsFoundError(getMultipleError2(container, ...args) + "\n\nHere are the matching elements:\n\n" + elementStrings, container);
    }
    return els[0] || null;
  };
}
function getSuggestionError(suggestion, container) {
  return getConfig().getElementError("A better query is available, try this:\n" + suggestion.toString() + "\n", container);
}
function makeGetAllQuery(allQuery, getMissingError2) {
  return function(container) {
    for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
      args[_key2 - 1] = arguments[_key2];
    }
    const els = allQuery(container, ...args);
    if (!els.length) {
      throw getConfig().getElementError(getMissingError2(container, ...args), container);
    }
    return els;
  };
}
function makeFindQuery(getter) {
  return (container, text, options, waitForOptions) => {
    return waitForWrapper(() => {
      return getter(container, text, options);
    }, {
      container,
      ...waitForOptions
    });
  };
}
var wrapSingleQueryWithSuggestion = (query, queryAllByName, variant) => function(container) {
  for (var _len3 = arguments.length, args = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
    args[_key3 - 1] = arguments[_key3];
  }
  const element = query(container, ...args);
  const [{
    suggest = getConfig().throwSuggestions
  } = {}] = args.slice(-1);
  if (element && suggest) {
    const suggestion = getSuggestedQuery(element, variant);
    if (suggestion && !queryAllByName.endsWith(suggestion.queryName)) {
      throw getSuggestionError(suggestion.toString(), container);
    }
  }
  return element;
};
var wrapAllByQueryWithSuggestion = (query, queryAllByName, variant) => function(container) {
  for (var _len4 = arguments.length, args = new Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
    args[_key4 - 1] = arguments[_key4];
  }
  const els = query(container, ...args);
  const [{
    suggest = getConfig().throwSuggestions
  } = {}] = args.slice(-1);
  if (els.length && suggest) {
    const uniqueSuggestionMessages = [...new Set(els.map((element) => {
      var _getSuggestedQuery;
      return (_getSuggestedQuery = getSuggestedQuery(element, variant)) == null ? void 0 : _getSuggestedQuery.toString();
    }))];
    if (uniqueSuggestionMessages.length === 1 && !queryAllByName.endsWith(
      getSuggestedQuery(els[0], variant).queryName
    )) {
      throw getSuggestionError(uniqueSuggestionMessages[0], container);
    }
  }
  return els;
};
function buildQueries(queryAllBy, getMultipleError2, getMissingError2) {
  const queryBy = wrapSingleQueryWithSuggestion(makeSingleQuery(queryAllBy, getMultipleError2), queryAllBy.name, "query");
  const getAllBy = makeGetAllQuery(queryAllBy, getMissingError2);
  const getBy = makeSingleQuery(getAllBy, getMultipleError2);
  const getByWithSuggestions = wrapSingleQueryWithSuggestion(getBy, queryAllBy.name, "get");
  const getAllWithSuggestions = wrapAllByQueryWithSuggestion(getAllBy, queryAllBy.name.replace("query", "get"), "getAll");
  const findAllBy = makeFindQuery(wrapAllByQueryWithSuggestion(getAllBy, queryAllBy.name, "findAll"));
  const findBy = makeFindQuery(wrapSingleQueryWithSuggestion(getBy, queryAllBy.name, "find"));
  return [queryBy, getAllWithSuggestions, getByWithSuggestions, findAllBy, findBy];
}
function queryAllLabels(container) {
  return Array.from(container.querySelectorAll("label,input")).map((node) => {
    return {
      node,
      textToMatch: getLabelContent(node)
    };
  }).filter((_ref) => {
    let {
      textToMatch
    } = _ref;
    return textToMatch !== null;
  });
}
var queryAllLabelsByText = function(container, text, _temp) {
  let {
    exact = true,
    trim,
    collapseWhitespace,
    normalizer
  } = _temp === void 0 ? {} : _temp;
  const matcher = exact ? matches : fuzzyMatches;
  const matchNormalizer = makeNormalizer({
    collapseWhitespace,
    trim,
    normalizer
  });
  const textToMatchByLabels = queryAllLabels(container);
  return textToMatchByLabels.filter((_ref2) => {
    let {
      node,
      textToMatch
    } = _ref2;
    return matcher(textToMatch, node, text, matchNormalizer);
  }).map((_ref3) => {
    let {
      node
    } = _ref3;
    return node;
  });
};
var queryAllByLabelText = function(container, text, _temp2) {
  let {
    selector = "*",
    exact = true,
    collapseWhitespace,
    trim,
    normalizer
  } = _temp2 === void 0 ? {} : _temp2;
  checkContainerType(container);
  const matcher = exact ? matches : fuzzyMatches;
  const matchNormalizer = makeNormalizer({
    collapseWhitespace,
    trim,
    normalizer
  });
  const matchingLabelledElements = Array.from(container.querySelectorAll("*")).filter((element) => {
    return getRealLabels(element).length || element.hasAttribute("aria-labelledby");
  }).reduce((labelledElements, labelledElement) => {
    const labelList = getLabels(container, labelledElement, {
      selector
    });
    labelList.filter((label) => Boolean(label.formControl)).forEach((label) => {
      if (matcher(label.content, label.formControl, text, matchNormalizer) && label.formControl)
        labelledElements.push(label.formControl);
    });
    const labelsValue = labelList.filter((label) => Boolean(label.content)).map((label) => label.content);
    if (matcher(labelsValue.join(" "), labelledElement, text, matchNormalizer))
      labelledElements.push(labelledElement);
    if (labelsValue.length > 1) {
      labelsValue.forEach((labelValue, index) => {
        if (matcher(labelValue, labelledElement, text, matchNormalizer))
          labelledElements.push(labelledElement);
        const labelsFiltered = [...labelsValue];
        labelsFiltered.splice(index, 1);
        if (labelsFiltered.length > 1) {
          if (matcher(labelsFiltered.join(" "), labelledElement, text, matchNormalizer))
            labelledElements.push(labelledElement);
        }
      });
    }
    return labelledElements;
  }, []).concat(queryAllByAttribute("aria-label", container, text, {
    exact,
    normalizer: matchNormalizer
  }));
  return Array.from(new Set(matchingLabelledElements)).filter((element) => element.matches(selector));
};
var getAllByLabelText = function(container, text) {
  for (var _len = arguments.length, rest = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    rest[_key - 2] = arguments[_key];
  }
  const els = queryAllByLabelText(container, text, ...rest);
  if (!els.length) {
    const labels = queryAllLabelsByText(container, text, ...rest);
    if (labels.length) {
      const tagNames = labels.map((label) => getTagNameOfElementAssociatedWithLabelViaFor(container, label)).filter((tagName) => !!tagName);
      if (tagNames.length) {
        throw getConfig().getElementError(tagNames.map((tagName) => "Found a label with the text of: " + text + ", however the element associated with this label (<" + tagName + " />) is non-labellable [https://html.spec.whatwg.org/multipage/forms.html#category-label]. If you really need to label a <" + tagName + " />, you can use aria-label or aria-labelledby instead.").join("\n\n"), container);
      } else {
        throw getConfig().getElementError("Found a label with the text of: " + text + `, however no form control was found associated to that label. Make sure you're using the "for" attribute or "aria-labelledby" attribute correctly.`, container);
      }
    } else {
      throw getConfig().getElementError("Unable to find a label with the text of: " + text, container);
    }
  }
  return els;
};
function getTagNameOfElementAssociatedWithLabelViaFor(container, label) {
  const htmlFor = label.getAttribute("for");
  if (!htmlFor) {
    return null;
  }
  const element = container.querySelector('[id="' + htmlFor + '"]');
  return element ? element.tagName.toLowerCase() : null;
}
var getMultipleError$7 = (c, text) => "Found multiple elements with the text of: " + text;
var queryByLabelText = wrapSingleQueryWithSuggestion(makeSingleQuery(queryAllByLabelText, getMultipleError$7), queryAllByLabelText.name, "query");
var getByLabelText = makeSingleQuery(getAllByLabelText, getMultipleError$7);
var findAllByLabelText = makeFindQuery(wrapAllByQueryWithSuggestion(getAllByLabelText, getAllByLabelText.name, "findAll"));
var findByLabelText = makeFindQuery(wrapSingleQueryWithSuggestion(getByLabelText, getAllByLabelText.name, "find"));
var getAllByLabelTextWithSuggestions = wrapAllByQueryWithSuggestion(getAllByLabelText, getAllByLabelText.name, "getAll");
var getByLabelTextWithSuggestions = wrapSingleQueryWithSuggestion(getByLabelText, getAllByLabelText.name, "get");
var queryAllByLabelTextWithSuggestions = wrapAllByQueryWithSuggestion(queryAllByLabelText, queryAllByLabelText.name, "queryAll");
var queryAllByPlaceholderText = function() {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }
  checkContainerType(args[0]);
  return queryAllByAttribute("placeholder", ...args);
};
var getMultipleError$6 = (c, text) => "Found multiple elements with the placeholder text of: " + text;
var getMissingError$6 = (c, text) => "Unable to find an element with the placeholder text of: " + text;
var queryAllByPlaceholderTextWithSuggestions = wrapAllByQueryWithSuggestion(queryAllByPlaceholderText, queryAllByPlaceholderText.name, "queryAll");
var [queryByPlaceholderText, getAllByPlaceholderText, getByPlaceholderText, findAllByPlaceholderText, findByPlaceholderText] = buildQueries(queryAllByPlaceholderText, getMultipleError$6, getMissingError$6);
var queryAllByText = function(container, text, _temp) {
  let {
    selector = "*",
    exact = true,
    collapseWhitespace,
    trim,
    ignore = getConfig().defaultIgnore,
    normalizer
  } = _temp === void 0 ? {} : _temp;
  checkContainerType(container);
  const matcher = exact ? matches : fuzzyMatches;
  const matchNormalizer = makeNormalizer({
    collapseWhitespace,
    trim,
    normalizer
  });
  let baseArray = [];
  if (typeof container.matches === "function" && container.matches(selector)) {
    baseArray = [container];
  }
  return [...baseArray, ...Array.from(container.querySelectorAll(selector))].filter((node) => !ignore || !node.matches(ignore)).filter((node) => matcher(getNodeText(node), node, text, matchNormalizer));
};
var getMultipleError$5 = (c, text) => "Found multiple elements with the text: " + text;
var getMissingError$5 = function(c, text, options) {
  if (options === void 0) {
    options = {};
  }
  const {
    collapseWhitespace,
    trim,
    normalizer,
    selector
  } = options;
  const matchNormalizer = makeNormalizer({
    collapseWhitespace,
    trim,
    normalizer
  });
  const normalizedText = matchNormalizer(text.toString());
  const isNormalizedDifferent = normalizedText !== text.toString();
  const isCustomSelector = (selector != null ? selector : "*") !== "*";
  return "Unable to find an element with the text: " + (isNormalizedDifferent ? normalizedText + " (normalized from '" + text + "')" : text) + (isCustomSelector ? ", which matches selector '" + selector + "'" : "") + ". This could be because the text is broken up by multiple elements. In this case, you can provide a function for your text matcher to make your matcher more flexible.";
};
var queryAllByTextWithSuggestions = wrapAllByQueryWithSuggestion(queryAllByText, queryAllByText.name, "queryAll");
var [queryByText, getAllByText, getByText, findAllByText, findByText] = buildQueries(queryAllByText, getMultipleError$5, getMissingError$5);
var queryAllByDisplayValue = function(container, value, _temp) {
  let {
    exact = true,
    collapseWhitespace,
    trim,
    normalizer
  } = _temp === void 0 ? {} : _temp;
  checkContainerType(container);
  const matcher = exact ? matches : fuzzyMatches;
  const matchNormalizer = makeNormalizer({
    collapseWhitespace,
    trim,
    normalizer
  });
  return Array.from(container.querySelectorAll("input,textarea,select")).filter((node) => {
    if (node.tagName === "SELECT") {
      const selectedOptions = Array.from(node.options).filter((option) => option.selected);
      return selectedOptions.some((optionNode) => matcher(getNodeText(optionNode), optionNode, value, matchNormalizer));
    } else {
      return matcher(node.value, node, value, matchNormalizer);
    }
  });
};
var getMultipleError$4 = (c, value) => "Found multiple elements with the display value: " + value + ".";
var getMissingError$4 = (c, value) => "Unable to find an element with the display value: " + value + ".";
var queryAllByDisplayValueWithSuggestions = wrapAllByQueryWithSuggestion(queryAllByDisplayValue, queryAllByDisplayValue.name, "queryAll");
var [queryByDisplayValue, getAllByDisplayValue, getByDisplayValue, findAllByDisplayValue, findByDisplayValue] = buildQueries(queryAllByDisplayValue, getMultipleError$4, getMissingError$4);
var VALID_TAG_REGEXP = /^(img|input|area|.+-.+)$/i;
var queryAllByAltText = function(container, alt, options) {
  if (options === void 0) {
    options = {};
  }
  checkContainerType(container);
  return queryAllByAttribute("alt", container, alt, options).filter((node) => VALID_TAG_REGEXP.test(node.tagName));
};
var getMultipleError$3 = (c, alt) => "Found multiple elements with the alt text: " + alt;
var getMissingError$3 = (c, alt) => "Unable to find an element with the alt text: " + alt;
var queryAllByAltTextWithSuggestions = wrapAllByQueryWithSuggestion(queryAllByAltText, queryAllByAltText.name, "queryAll");
var [queryByAltText, getAllByAltText, getByAltText, findAllByAltText, findByAltText] = buildQueries(queryAllByAltText, getMultipleError$3, getMissingError$3);
var isSvgTitle = (node) => {
  var _node$parentElement;
  return node.tagName.toLowerCase() === "title" && ((_node$parentElement = node.parentElement) == null ? void 0 : _node$parentElement.tagName.toLowerCase()) === "svg";
};
var queryAllByTitle = function(container, text, _temp) {
  let {
    exact = true,
    collapseWhitespace,
    trim,
    normalizer
  } = _temp === void 0 ? {} : _temp;
  checkContainerType(container);
  const matcher = exact ? matches : fuzzyMatches;
  const matchNormalizer = makeNormalizer({
    collapseWhitespace,
    trim,
    normalizer
  });
  return Array.from(container.querySelectorAll("[title], svg > title")).filter((node) => matcher(node.getAttribute("title"), node, text, matchNormalizer) || isSvgTitle(node) && matcher(getNodeText(node), node, text, matchNormalizer));
};
var getMultipleError$2 = (c, title) => "Found multiple elements with the title: " + title + ".";
var getMissingError$2 = (c, title) => "Unable to find an element with the title: " + title + ".";
var queryAllByTitleWithSuggestions = wrapAllByQueryWithSuggestion(queryAllByTitle, queryAllByTitle.name, "queryAll");
var [queryByTitle, getAllByTitle, getByTitle, findAllByTitle, findByTitle] = buildQueries(queryAllByTitle, getMultipleError$2, getMissingError$2);
function queryAllByRole(container, role, _temp) {
  let {
    exact = true,
    collapseWhitespace,
    hidden = getConfig().defaultHidden,
    name,
    description,
    trim,
    normalizer,
    queryFallbacks = false,
    selected,
    checked,
    pressed,
    current,
    level,
    expanded
  } = _temp === void 0 ? {} : _temp;
  checkContainerType(container);
  const matcher = exact ? matches : fuzzyMatches;
  const matchNormalizer = makeNormalizer({
    collapseWhitespace,
    trim,
    normalizer
  });
  if (selected !== void 0) {
    var _allRoles$get;
    if (((_allRoles$get = import_aria_query.roles.get(role)) == null ? void 0 : _allRoles$get.props["aria-selected"]) === void 0) {
      throw new Error('"aria-selected" is not supported on role "' + role + '".');
    }
  }
  if (checked !== void 0) {
    var _allRoles$get2;
    if (((_allRoles$get2 = import_aria_query.roles.get(role)) == null ? void 0 : _allRoles$get2.props["aria-checked"]) === void 0) {
      throw new Error('"aria-checked" is not supported on role "' + role + '".');
    }
  }
  if (pressed !== void 0) {
    var _allRoles$get3;
    if (((_allRoles$get3 = import_aria_query.roles.get(role)) == null ? void 0 : _allRoles$get3.props["aria-pressed"]) === void 0) {
      throw new Error('"aria-pressed" is not supported on role "' + role + '".');
    }
  }
  if (current !== void 0) {
    var _allRoles$get4;
    if (((_allRoles$get4 = import_aria_query.roles.get(role)) == null ? void 0 : _allRoles$get4.props["aria-current"]) === void 0) {
      throw new Error('"aria-current" is not supported on role "' + role + '".');
    }
  }
  if (level !== void 0) {
    if (role !== "heading") {
      throw new Error('Role "' + role + '" cannot have "level" property.');
    }
  }
  if (expanded !== void 0) {
    var _allRoles$get5;
    if (((_allRoles$get5 = import_aria_query.roles.get(role)) == null ? void 0 : _allRoles$get5.props["aria-expanded"]) === void 0) {
      throw new Error('"aria-expanded" is not supported on role "' + role + '".');
    }
  }
  const subtreeIsInaccessibleCache = /* @__PURE__ */ new WeakMap();
  function cachedIsSubtreeInaccessible(element) {
    if (!subtreeIsInaccessibleCache.has(element)) {
      subtreeIsInaccessibleCache.set(element, isSubtreeInaccessible(element));
    }
    return subtreeIsInaccessibleCache.get(element);
  }
  return Array.from(container.querySelectorAll(
    makeRoleSelector(role, exact, normalizer ? matchNormalizer : void 0)
  )).filter((node) => {
    const isRoleSpecifiedExplicitly = node.hasAttribute("role");
    if (isRoleSpecifiedExplicitly) {
      const roleValue = node.getAttribute("role");
      if (queryFallbacks) {
        return roleValue.split(" ").filter(Boolean).some((text) => matcher(text, node, role, matchNormalizer));
      }
      if (normalizer) {
        return matcher(roleValue, node, role, matchNormalizer);
      }
      const [firstWord] = roleValue.split(" ");
      return matcher(firstWord, node, role, matchNormalizer);
    }
    const implicitRoles = getImplicitAriaRoles(node);
    return implicitRoles.some((implicitRole) => matcher(implicitRole, node, role, matchNormalizer));
  }).filter((element) => {
    if (selected !== void 0) {
      return selected === computeAriaSelected(element);
    }
    if (checked !== void 0) {
      return checked === computeAriaChecked(element);
    }
    if (pressed !== void 0) {
      return pressed === computeAriaPressed(element);
    }
    if (current !== void 0) {
      return current === computeAriaCurrent(element);
    }
    if (expanded !== void 0) {
      return expanded === computeAriaExpanded(element);
    }
    if (level !== void 0) {
      return level === computeHeadingLevel(element);
    }
    return true;
  }).filter((element) => {
    if (name === void 0) {
      return true;
    }
    return matches(computeAccessibleName(element, {
      computedStyleSupportsPseudoElements: getConfig().computedStyleSupportsPseudoElements
    }), element, name, (text) => text);
  }).filter((element) => {
    if (description === void 0) {
      return true;
    }
    return matches(computeAccessibleDescription(element, {
      computedStyleSupportsPseudoElements: getConfig().computedStyleSupportsPseudoElements
    }), element, description, (text) => text);
  }).filter((element) => {
    return hidden === false ? isInaccessible(element, {
      isSubtreeInaccessible: cachedIsSubtreeInaccessible
    }) === false : true;
  });
}
function makeRoleSelector(role, exact, customNormalizer) {
  var _roleElements$get;
  if (typeof role !== "string") {
    return "*";
  }
  const explicitRoleSelector = exact && !customNormalizer ? '*[role~="' + role + '"]' : "*[role]";
  const roleRelations = (_roleElements$get = import_aria_query.roleElements.get(role)) != null ? _roleElements$get : /* @__PURE__ */ new Set();
  const implicitRoleSelectors = new Set(Array.from(roleRelations).map((_ref) => {
    let {
      name
    } = _ref;
    return name;
  }));
  return [explicitRoleSelector].concat(Array.from(implicitRoleSelectors)).join(",");
}
var getNameHint = (name) => {
  let nameHint = "";
  if (name === void 0) {
    nameHint = "";
  } else if (typeof name === "string") {
    nameHint = ' and name "' + name + '"';
  } else {
    nameHint = " and name `" + name + "`";
  }
  return nameHint;
};
var getMultipleError$1 = function(c, role, _temp2) {
  let {
    name
  } = _temp2 === void 0 ? {} : _temp2;
  return 'Found multiple elements with the role "' + role + '"' + getNameHint(name);
};
var getMissingError$1 = function(container, role, _temp3) {
  let {
    hidden = getConfig().defaultHidden,
    name,
    description
  } = _temp3 === void 0 ? {} : _temp3;
  if (getConfig()._disableExpensiveErrorDiagnostics) {
    return 'Unable to find role="' + role + '"' + getNameHint(name);
  }
  let roles2 = "";
  Array.from(container.children).forEach((childElement) => {
    roles2 += prettyRoles(childElement, {
      hidden,
      includeDescription: description !== void 0
    });
  });
  let roleMessage;
  if (roles2.length === 0) {
    if (hidden === false) {
      roleMessage = "There are no accessible roles. But there might be some inaccessible roles. If you wish to access them, then set the `hidden` option to `true`. Learn more about this here: https://testing-library.com/docs/dom-testing-library/api-queries#byrole";
    } else {
      roleMessage = "There are no available roles.";
    }
  } else {
    roleMessage = ("\nHere are the " + (hidden === false ? "accessible" : "available") + " roles:\n\n  " + roles2.replace(/\n/g, "\n  ").replace(/\n\s\s\n/g, "\n\n") + "\n").trim();
  }
  let nameHint = "";
  if (name === void 0) {
    nameHint = "";
  } else if (typeof name === "string") {
    nameHint = ' and name "' + name + '"';
  } else {
    nameHint = " and name `" + name + "`";
  }
  let descriptionHint = "";
  if (description === void 0) {
    descriptionHint = "";
  } else if (typeof description === "string") {
    descriptionHint = ' and description "' + description + '"';
  } else {
    descriptionHint = " and description `" + description + "`";
  }
  return ("\nUnable to find an " + (hidden === false ? "accessible " : "") + 'element with the role "' + role + '"' + nameHint + descriptionHint + "\n\n" + roleMessage).trim();
};
var queryAllByRoleWithSuggestions = wrapAllByQueryWithSuggestion(queryAllByRole, queryAllByRole.name, "queryAll");
var [queryByRole, getAllByRole, getByRole, findAllByRole, findByRole] = buildQueries(queryAllByRole, getMultipleError$1, getMissingError$1);
var getTestIdAttribute = () => getConfig().testIdAttribute;
var queryAllByTestId = function() {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }
  checkContainerType(args[0]);
  return queryAllByAttribute(getTestIdAttribute(), ...args);
};
var getMultipleError = (c, id) => "Found multiple elements by: [" + getTestIdAttribute() + '="' + id + '"]';
var getMissingError = (c, id) => "Unable to find an element by: [" + getTestIdAttribute() + '="' + id + '"]';
var queryAllByTestIdWithSuggestions = wrapAllByQueryWithSuggestion(queryAllByTestId, queryAllByTestId.name, "queryAll");
var [queryByTestId, getAllByTestId, getByTestId, findAllByTestId, findByTestId] = buildQueries(queryAllByTestId, getMultipleError, getMissingError);
var queries = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  queryAllByLabelText: queryAllByLabelTextWithSuggestions,
  queryByLabelText,
  getAllByLabelText: getAllByLabelTextWithSuggestions,
  getByLabelText: getByLabelTextWithSuggestions,
  findAllByLabelText,
  findByLabelText,
  queryByPlaceholderText,
  queryAllByPlaceholderText: queryAllByPlaceholderTextWithSuggestions,
  getByPlaceholderText,
  getAllByPlaceholderText,
  findAllByPlaceholderText,
  findByPlaceholderText,
  queryByText,
  queryAllByText: queryAllByTextWithSuggestions,
  getByText,
  getAllByText,
  findAllByText,
  findByText,
  queryByDisplayValue,
  queryAllByDisplayValue: queryAllByDisplayValueWithSuggestions,
  getByDisplayValue,
  getAllByDisplayValue,
  findAllByDisplayValue,
  findByDisplayValue,
  queryByAltText,
  queryAllByAltText: queryAllByAltTextWithSuggestions,
  getByAltText,
  getAllByAltText,
  findAllByAltText,
  findByAltText,
  queryByTitle,
  queryAllByTitle: queryAllByTitleWithSuggestions,
  getByTitle,
  getAllByTitle,
  findAllByTitle,
  findByTitle,
  queryByRole,
  queryAllByRole: queryAllByRoleWithSuggestions,
  getAllByRole,
  getByRole,
  findAllByRole,
  findByRole,
  queryByTestId,
  queryAllByTestId: queryAllByTestIdWithSuggestions,
  getByTestId,
  getAllByTestId,
  findAllByTestId,
  findByTestId
});
function getQueriesForElement(element, queries$1, initialValue2) {
  if (queries$1 === void 0) {
    queries$1 = queries;
  }
  if (initialValue2 === void 0) {
    initialValue2 = {};
  }
  return Object.keys(queries$1).reduce((helpers, key) => {
    const fn = queries$1[key];
    helpers[key] = fn.bind(null, element);
    return helpers;
  }, initialValue2);
}
var eventMap = {
  copy: {
    EventType: "ClipboardEvent",
    defaultInit: {
      bubbles: true,
      cancelable: true,
      composed: true
    }
  },
  cut: {
    EventType: "ClipboardEvent",
    defaultInit: {
      bubbles: true,
      cancelable: true,
      composed: true
    }
  },
  paste: {
    EventType: "ClipboardEvent",
    defaultInit: {
      bubbles: true,
      cancelable: true,
      composed: true
    }
  },
  compositionEnd: {
    EventType: "CompositionEvent",
    defaultInit: {
      bubbles: true,
      cancelable: true,
      composed: true
    }
  },
  compositionStart: {
    EventType: "CompositionEvent",
    defaultInit: {
      bubbles: true,
      cancelable: true,
      composed: true
    }
  },
  compositionUpdate: {
    EventType: "CompositionEvent",
    defaultInit: {
      bubbles: true,
      cancelable: true,
      composed: true
    }
  },
  keyDown: {
    EventType: "KeyboardEvent",
    defaultInit: {
      bubbles: true,
      cancelable: true,
      charCode: 0,
      composed: true
    }
  },
  keyPress: {
    EventType: "KeyboardEvent",
    defaultInit: {
      bubbles: true,
      cancelable: true,
      charCode: 0,
      composed: true
    }
  },
  keyUp: {
    EventType: "KeyboardEvent",
    defaultInit: {
      bubbles: true,
      cancelable: true,
      charCode: 0,
      composed: true
    }
  },
  focus: {
    EventType: "FocusEvent",
    defaultInit: {
      bubbles: false,
      cancelable: false,
      composed: true
    }
  },
  blur: {
    EventType: "FocusEvent",
    defaultInit: {
      bubbles: false,
      cancelable: false,
      composed: true
    }
  },
  focusIn: {
    EventType: "FocusEvent",
    defaultInit: {
      bubbles: true,
      cancelable: false,
      composed: true
    }
  },
  focusOut: {
    EventType: "FocusEvent",
    defaultInit: {
      bubbles: true,
      cancelable: false,
      composed: true
    }
  },
  change: {
    EventType: "Event",
    defaultInit: {
      bubbles: true,
      cancelable: false
    }
  },
  input: {
    EventType: "InputEvent",
    defaultInit: {
      bubbles: true,
      cancelable: false,
      composed: true
    }
  },
  invalid: {
    EventType: "Event",
    defaultInit: {
      bubbles: false,
      cancelable: true
    }
  },
  submit: {
    EventType: "Event",
    defaultInit: {
      bubbles: true,
      cancelable: true
    }
  },
  reset: {
    EventType: "Event",
    defaultInit: {
      bubbles: true,
      cancelable: true
    }
  },
  click: {
    EventType: "MouseEvent",
    defaultInit: {
      bubbles: true,
      cancelable: true,
      button: 0,
      composed: true
    }
  },
  contextMenu: {
    EventType: "MouseEvent",
    defaultInit: {
      bubbles: true,
      cancelable: true,
      composed: true
    }
  },
  dblClick: {
    EventType: "MouseEvent",
    defaultInit: {
      bubbles: true,
      cancelable: true,
      composed: true
    }
  },
  drag: {
    EventType: "DragEvent",
    defaultInit: {
      bubbles: true,
      cancelable: true,
      composed: true
    }
  },
  dragEnd: {
    EventType: "DragEvent",
    defaultInit: {
      bubbles: true,
      cancelable: false,
      composed: true
    }
  },
  dragEnter: {
    EventType: "DragEvent",
    defaultInit: {
      bubbles: true,
      cancelable: true,
      composed: true
    }
  },
  dragExit: {
    EventType: "DragEvent",
    defaultInit: {
      bubbles: true,
      cancelable: false,
      composed: true
    }
  },
  dragLeave: {
    EventType: "DragEvent",
    defaultInit: {
      bubbles: true,
      cancelable: false,
      composed: true
    }
  },
  dragOver: {
    EventType: "DragEvent",
    defaultInit: {
      bubbles: true,
      cancelable: true,
      composed: true
    }
  },
  dragStart: {
    EventType: "DragEvent",
    defaultInit: {
      bubbles: true,
      cancelable: true,
      composed: true
    }
  },
  drop: {
    EventType: "DragEvent",
    defaultInit: {
      bubbles: true,
      cancelable: true,
      composed: true
    }
  },
  mouseDown: {
    EventType: "MouseEvent",
    defaultInit: {
      bubbles: true,
      cancelable: true,
      composed: true
    }
  },
  mouseEnter: {
    EventType: "MouseEvent",
    defaultInit: {
      bubbles: false,
      cancelable: false,
      composed: true
    }
  },
  mouseLeave: {
    EventType: "MouseEvent",
    defaultInit: {
      bubbles: false,
      cancelable: false,
      composed: true
    }
  },
  mouseMove: {
    EventType: "MouseEvent",
    defaultInit: {
      bubbles: true,
      cancelable: true,
      composed: true
    }
  },
  mouseOut: {
    EventType: "MouseEvent",
    defaultInit: {
      bubbles: true,
      cancelable: true,
      composed: true
    }
  },
  mouseOver: {
    EventType: "MouseEvent",
    defaultInit: {
      bubbles: true,
      cancelable: true,
      composed: true
    }
  },
  mouseUp: {
    EventType: "MouseEvent",
    defaultInit: {
      bubbles: true,
      cancelable: true,
      composed: true
    }
  },
  select: {
    EventType: "Event",
    defaultInit: {
      bubbles: true,
      cancelable: false
    }
  },
  touchCancel: {
    EventType: "TouchEvent",
    defaultInit: {
      bubbles: true,
      cancelable: false,
      composed: true
    }
  },
  touchEnd: {
    EventType: "TouchEvent",
    defaultInit: {
      bubbles: true,
      cancelable: true,
      composed: true
    }
  },
  touchMove: {
    EventType: "TouchEvent",
    defaultInit: {
      bubbles: true,
      cancelable: true,
      composed: true
    }
  },
  touchStart: {
    EventType: "TouchEvent",
    defaultInit: {
      bubbles: true,
      cancelable: true,
      composed: true
    }
  },
  resize: {
    EventType: "UIEvent",
    defaultInit: {
      bubbles: false,
      cancelable: false
    }
  },
  scroll: {
    EventType: "UIEvent",
    defaultInit: {
      bubbles: false,
      cancelable: false
    }
  },
  wheel: {
    EventType: "WheelEvent",
    defaultInit: {
      bubbles: true,
      cancelable: true,
      composed: true
    }
  },
  abort: {
    EventType: "Event",
    defaultInit: {
      bubbles: false,
      cancelable: false
    }
  },
  canPlay: {
    EventType: "Event",
    defaultInit: {
      bubbles: false,
      cancelable: false
    }
  },
  canPlayThrough: {
    EventType: "Event",
    defaultInit: {
      bubbles: false,
      cancelable: false
    }
  },
  durationChange: {
    EventType: "Event",
    defaultInit: {
      bubbles: false,
      cancelable: false
    }
  },
  emptied: {
    EventType: "Event",
    defaultInit: {
      bubbles: false,
      cancelable: false
    }
  },
  encrypted: {
    EventType: "Event",
    defaultInit: {
      bubbles: false,
      cancelable: false
    }
  },
  ended: {
    EventType: "Event",
    defaultInit: {
      bubbles: false,
      cancelable: false
    }
  },
  loadedData: {
    EventType: "Event",
    defaultInit: {
      bubbles: false,
      cancelable: false
    }
  },
  loadedMetadata: {
    EventType: "Event",
    defaultInit: {
      bubbles: false,
      cancelable: false
    }
  },
  loadStart: {
    EventType: "ProgressEvent",
    defaultInit: {
      bubbles: false,
      cancelable: false
    }
  },
  pause: {
    EventType: "Event",
    defaultInit: {
      bubbles: false,
      cancelable: false
    }
  },
  play: {
    EventType: "Event",
    defaultInit: {
      bubbles: false,
      cancelable: false
    }
  },
  playing: {
    EventType: "Event",
    defaultInit: {
      bubbles: false,
      cancelable: false
    }
  },
  progress: {
    EventType: "ProgressEvent",
    defaultInit: {
      bubbles: false,
      cancelable: false
    }
  },
  rateChange: {
    EventType: "Event",
    defaultInit: {
      bubbles: false,
      cancelable: false
    }
  },
  seeked: {
    EventType: "Event",
    defaultInit: {
      bubbles: false,
      cancelable: false
    }
  },
  seeking: {
    EventType: "Event",
    defaultInit: {
      bubbles: false,
      cancelable: false
    }
  },
  stalled: {
    EventType: "Event",
    defaultInit: {
      bubbles: false,
      cancelable: false
    }
  },
  suspend: {
    EventType: "Event",
    defaultInit: {
      bubbles: false,
      cancelable: false
    }
  },
  timeUpdate: {
    EventType: "Event",
    defaultInit: {
      bubbles: false,
      cancelable: false
    }
  },
  volumeChange: {
    EventType: "Event",
    defaultInit: {
      bubbles: false,
      cancelable: false
    }
  },
  waiting: {
    EventType: "Event",
    defaultInit: {
      bubbles: false,
      cancelable: false
    }
  },
  load: {
    EventType: "Event",
    defaultInit: {
      bubbles: false,
      cancelable: false
    }
  },
  error: {
    EventType: "Event",
    defaultInit: {
      bubbles: false,
      cancelable: false
    }
  },
  animationStart: {
    EventType: "AnimationEvent",
    defaultInit: {
      bubbles: true,
      cancelable: false
    }
  },
  animationEnd: {
    EventType: "AnimationEvent",
    defaultInit: {
      bubbles: true,
      cancelable: false
    }
  },
  animationIteration: {
    EventType: "AnimationEvent",
    defaultInit: {
      bubbles: true,
      cancelable: false
    }
  },
  transitionCancel: {
    EventType: "TransitionEvent",
    defaultInit: {
      bubbles: true,
      cancelable: false
    }
  },
  transitionEnd: {
    EventType: "TransitionEvent",
    defaultInit: {
      bubbles: true,
      cancelable: true
    }
  },
  transitionRun: {
    EventType: "TransitionEvent",
    defaultInit: {
      bubbles: true,
      cancelable: false
    }
  },
  transitionStart: {
    EventType: "TransitionEvent",
    defaultInit: {
      bubbles: true,
      cancelable: false
    }
  },
  pointerOver: {
    EventType: "PointerEvent",
    defaultInit: {
      bubbles: true,
      cancelable: true,
      composed: true
    }
  },
  pointerEnter: {
    EventType: "PointerEvent",
    defaultInit: {
      bubbles: false,
      cancelable: false
    }
  },
  pointerDown: {
    EventType: "PointerEvent",
    defaultInit: {
      bubbles: true,
      cancelable: true,
      composed: true
    }
  },
  pointerMove: {
    EventType: "PointerEvent",
    defaultInit: {
      bubbles: true,
      cancelable: true,
      composed: true
    }
  },
  pointerUp: {
    EventType: "PointerEvent",
    defaultInit: {
      bubbles: true,
      cancelable: true,
      composed: true
    }
  },
  pointerCancel: {
    EventType: "PointerEvent",
    defaultInit: {
      bubbles: true,
      cancelable: false,
      composed: true
    }
  },
  pointerOut: {
    EventType: "PointerEvent",
    defaultInit: {
      bubbles: true,
      cancelable: true,
      composed: true
    }
  },
  pointerLeave: {
    EventType: "PointerEvent",
    defaultInit: {
      bubbles: false,
      cancelable: false
    }
  },
  gotPointerCapture: {
    EventType: "PointerEvent",
    defaultInit: {
      bubbles: true,
      cancelable: false,
      composed: true
    }
  },
  lostPointerCapture: {
    EventType: "PointerEvent",
    defaultInit: {
      bubbles: true,
      cancelable: false,
      composed: true
    }
  },
  popState: {
    EventType: "PopStateEvent",
    defaultInit: {
      bubbles: true,
      cancelable: false
    }
  },
  offline: {
    EventType: "Event",
    defaultInit: {
      bubbles: false,
      cancelable: false
    }
  },
  online: {
    EventType: "Event",
    defaultInit: {
      bubbles: false,
      cancelable: false
    }
  }
};
var eventAliasMap = {
  doubleClick: "dblClick"
};
function fireEvent(element, event) {
  return getConfig().eventWrapper(() => {
    if (!event) {
      throw new Error("Unable to fire an event - please provide an event object.");
    }
    if (!element) {
      throw new Error('Unable to fire a "' + event.type + '" event - please provide a DOM element.');
    }
    return element.dispatchEvent(event);
  });
}
function createEvent(eventName, node, init, _temp) {
  let {
    EventType = "Event",
    defaultInit = {}
  } = _temp === void 0 ? {} : _temp;
  if (!node) {
    throw new Error('Unable to fire a "' + eventName + '" event - please provide a DOM element.');
  }
  const eventInit = {
    ...defaultInit,
    ...init
  };
  const {
    target: {
      value,
      files,
      ...targetProperties
    } = {}
  } = eventInit;
  if (value !== void 0) {
    setNativeValue(node, value);
  }
  if (files !== void 0) {
    Object.defineProperty(node, "files", {
      configurable: true,
      enumerable: true,
      writable: true,
      value: files
    });
  }
  Object.assign(node, targetProperties);
  const window2 = getWindowFromNode(node);
  const EventConstructor = window2[EventType] || window2.Event;
  let event;
  if (typeof EventConstructor === "function") {
    event = new EventConstructor(eventName, eventInit);
  } else {
    event = window2.document.createEvent(EventType);
    const {
      bubbles,
      cancelable,
      detail,
      ...otherInit
    } = eventInit;
    event.initEvent(eventName, bubbles, cancelable, detail);
    Object.keys(otherInit).forEach((eventKey) => {
      event[eventKey] = otherInit[eventKey];
    });
  }
  const dataTransferProperties = ["dataTransfer", "clipboardData"];
  dataTransferProperties.forEach((dataTransferKey) => {
    const dataTransferValue = eventInit[dataTransferKey];
    if (typeof dataTransferValue === "object") {
      if (typeof window2.DataTransfer === "function") {
        Object.defineProperty(event, dataTransferKey, {
          value: Object.getOwnPropertyNames(dataTransferValue).reduce((acc, propName) => {
            Object.defineProperty(acc, propName, {
              value: dataTransferValue[propName]
            });
            return acc;
          }, new window2.DataTransfer())
        });
      } else {
        Object.defineProperty(event, dataTransferKey, {
          value: dataTransferValue
        });
      }
    }
  });
  return event;
}
Object.keys(eventMap).forEach((key) => {
  const {
    EventType,
    defaultInit
  } = eventMap[key];
  const eventName = key.toLowerCase();
  createEvent[key] = (node, init) => createEvent(eventName, node, init, {
    EventType,
    defaultInit
  });
  fireEvent[key] = (node, init) => fireEvent(node, createEvent[key](node, init));
});
function setNativeValue(element, value) {
  const {
    set: valueSetter
  } = Object.getOwnPropertyDescriptor(element, "value") || {};
  const prototype = Object.getPrototypeOf(element);
  const {
    set: prototypeValueSetter
  } = Object.getOwnPropertyDescriptor(prototype, "value") || {};
  if (prototypeValueSetter && valueSetter !== prototypeValueSetter) {
    prototypeValueSetter.call(element, value);
  } else {
    if (valueSetter) {
      valueSetter.call(element, value);
    } else {
      throw new Error("The given element does not have a value setter");
    }
  }
}
Object.keys(eventAliasMap).forEach((aliasKey) => {
  const key = eventAliasMap[aliasKey];
  fireEvent[aliasKey] = function() {
    return fireEvent[key](...arguments);
  };
});
function unindent(string) {
  return string.replace(/[ \t]*[\n][ \t]*/g, "\n");
}
function encode(value) {
  return import_lz_string.default.compressToEncodedURIComponent(unindent(value));
}
function getPlaygroundUrl(markup) {
  return "https://testing-playground.com/#markup=" + encode(markup);
}
var debug = (element, maxLength, options) => Array.isArray(element) ? element.forEach((el) => logDOM(el, maxLength, options)) : logDOM(element, maxLength, options);
var logTestingPlaygroundURL = function(element) {
  if (element === void 0) {
    element = getDocument().body;
  }
  if (!element || !("innerHTML" in element)) {
    console.log("The element you're providing isn't a valid DOM element.");
    return;
  }
  if (!element.innerHTML) {
    console.log("The provided element doesn't have any children.");
    return;
  }
  const playgroundUrl = getPlaygroundUrl(element.innerHTML);
  console.log("Open this URL in your browser\n\n" + playgroundUrl);
  return playgroundUrl;
};
var initialValue = {
  debug,
  logTestingPlaygroundURL
};
var screen = typeof document !== "undefined" && document.body ? getQueriesForElement(document.body, queries, initialValue) : Object.keys(queries).reduce((helpers, key) => {
  helpers[key] = () => {
    throw new TypeError("For queries bound to document.body a global document has to be available... Learn more: https://testing-library.com/s/screen-global-error");
  };
  return helpers;
}, initialValue);

// src/drag.ts
function isElement(obj) {
  if (typeof obj !== "object") {
    return false;
  }
  let prototypeStr, prototype;
  do {
    prototype = Object.getPrototypeOf(obj);
    prototypeStr = Object.prototype.toString.call(prototype);
    if (prototypeStr === "[object Element]" || prototypeStr === "[object Document]") {
      return true;
    }
    obj = prototype;
  } while (prototype !== null);
  return false;
}
function getElementClientCenter(element) {
  const { left, top, width, height } = element.getBoundingClientRect();
  return {
    x: left + width / 2,
    y: top + height / 2
  };
}
var getCoords = (charlie) => isElement(charlie) ? getElementClientCenter(charlie) : charlie;
var sleep = (ms) => new Promise((resolve) => {
  setTimeout(resolve, ms);
});
async function drag(element, {
  to: inTo,
  delta,
  steps = 20,
  duration = 500
}) {
  const from = getElementClientCenter(element);
  const to = delta ? {
    x: from.x + delta.x,
    y: from.y + delta.y
  } : inTo ? getCoords(inTo) : null;
  if (to === null)
    throw new Error("You must provide either `delta` or `to`");
  const step = {
    x: (to.x - from.x) / steps,
    y: (to.y - from.y) / steps
  };
  const current = {
    clientX: from.x,
    clientY: from.y
  };
  fireEvent.mouseEnter(element, current);
  fireEvent.mouseOver(element, current);
  fireEvent.mouseMove(element, current);
  fireEvent.mouseDown(element, current);
  for (let i = 0; i < steps; i++) {
    current.clientX += step.x;
    current.clientY += step.y;
    await sleep(duration / steps);
    fireEvent.mouseMove(element, current);
  }
  fireEvent.mouseUp(element, current);
}

export {
  drag
};
