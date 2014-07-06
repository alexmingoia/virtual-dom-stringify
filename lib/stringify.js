var encode = require('he').encode;
var isVNode = require('vtree/is-vnode');
var isVText = require('vtree/is-vtext');
var validProps = require('./attributes');

/**
 * Stringify given virtual dom tree and return html.
 *
 * @param {VirtualNode} node
 * @return {String}
 * @api public
 */

module.exports = function stringify (node) {
  if (!node) return "";

  var attributes = [];
  var html = [];

  if (isVNode(node)) {
    html.push('<' + node.tagName);

    for (var i=0, l=validProps.length; i<l; i++) {
      var attrName = validProps[i];
      var attrVal = node.properties[attrName];

      if (attrVal) {
        // Special case for style. We need to iterate over all rules to create a
        // hash of applied css properties.
        if (attrName === 'style') {
          var css = [];
          for (var styleProp in attrVal) {
            css.push(styleProp + ': ' + attrVal[styleProp] + ';');
          }
          attributes.push(attrName + '="' + css.join(' ') + '"');
        } else if (attrVal === "true" || attrVal === true) {
          attributes.push(attrName);
        } else {
          attributes.push(attrName + '="' + encode(String(attrVal)) + '"');
        }
      }
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
    html.push(encode(String(node.text)));
  }

  return html.join('');
};
