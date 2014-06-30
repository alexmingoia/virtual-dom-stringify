var isVNode = require('vtree/is-vnode');
var isVText = require('vtree/is-vtext');

/**
 * Stringify given virtual dom tree and return html.
 *
 * @param {VirtualNode} node
 * @return {String}
 * @api public
 */

module.exports = function stringify (node) {
  var attributes = [];
  var html = [];

  if (isVNode(node)) {
    html.push('<' + node.tagName);

    for (var i=0, l=validProps.length; i<l; i++) {
      var attrName = validProps[i];
      var attrVal = node.properties[attrName];

      if (attrVal === undefined) continue;

      // Special case for style. We need to iterate over all rules to create a
      // hash of applied css properties.
      if (attrName === 'style') {
        var css = [];
        for (var styleProp in attrVal) {
          css.push(styleProp+ ': ' + attrVal[styleProp] + ';');
        }
        attrVal = css.join(' ');
      }

      attributes.push(attrName + '="' + attrVal + '"');
    }

    if (attributes.length) {
      html.push(' ' + attributes.join(', '));
    }

    html.push('>');

    if (node.children && node.children.length) {
      for (var i=0, l=node.children.length; i<l; i++) {
        var child = node.children[i];
        html.push(stringify(child));
      }
    }

    html.push('</' + node.tagName + '>');
  }
  else if (isVText(node)) {
    html.push(node.text);
  }

  return html.join('');
};

/**
* DOMNode property white list
* Taken from https://github.com/Raynos/react/blob/dom-property-config/src/browser/ui/dom/DefaultDOMPropertyConfig.js
*/
var validProps = module.exports.properties = [
  "accept",
  "accessKey",
  "action",
  "alt",
  "async",
  "autoComplete",
  "autoPlay",
  "cellPadding",
  "cellSpacing",
  "checked",
  "className",
  "colSpan",
  "content",
  "contentEditable",
  "controls",
  "crossOrigin",
  "data",
  "defer",
  "dir",
  "download",
  "draggable",
  "encType",
  "formNoValidate",
  "href",
  "hrefLang",
  "htmlFor",
  "httpEquiv",
  "icon",
  "id",
  "label",
  "lang",
  "list",
  "loop",
  "max",
  "mediaGroup",
  "method",
  "min",
  "multiple",
  "muted",
  "name",
  "noValidate",
  "pattern",
  "placeholder",
  "poster",
  "preload",
  "radioGroup",
  "readOnly",
  "rel",
  "required",
  "rowSpan",
  "sandbox",
  "scope",
  "scrollLeft",
  "scrolling",
  "scrollTop",
  "selected",
  "span",
  "spellCheck",
  "src",
  "srcDoc",
  "srcSet",
  "start",
  "step",
  "style",
  "tabIndex",
  "target",
  "title",
  "type",
  "value",

  // Non-standard Properties
  "autoCapitalize",
  "autoCorrect",
  "property",
  "attributes"
];
