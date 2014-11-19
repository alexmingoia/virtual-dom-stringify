var encode = require('he').encode;
var isVNode = require('vtree/is-vnode');
var isVText = require('vtree/is-vtext');
var validProps = require('./attributes');
var selfClosingTags = ['br'];

/**
 * Stringify given virtual dom tree and return html.
 *
 * @param {VirtualNode} node
 * @param {VirtualNode?} parent
 * @return {String}
 * @api public
 */

module.exports = function stringify (node, parent) {
  if (!node) return "";

  var attributes = [];
  var html = [];

  if (isVNode(node)) {
    html.push('<' + node.tagName);

    for (var attrName in node.properties) {
      var prop = node.properties[attrName];
      var validProp = validProps[camelCase(attrName)];
      var attrVal;

      if (prop && validProp) {
        attrName = validProp;

        if (typeof prop === 'object' && attrName !== 'style') {
          attrVal = prop.value;
        } else {
          attrVal = prop;
        }

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
    }

    if (attributes.length) {
      html.push(' ' + attributes.join(' '));
    }

    if (~selfClosingTags.indexOf(node.tagName.toLowerCase())) {
      html.push('/>');
    } else {
      html.push('>');

      if (node.children && node.children.length) {
        for (var i=0, l=node.children.length; i<l; i++) {
          var child = node.children[i];
          html.push(stringify(child, node));
        }
      }

      html.push('</' + node.tagName + '>');
    }
  }
  else if (isVText(node)) {
    if (parent && parent.tagName === 'script') {
      html.push(String(node.text));
    } else {
      html.push(encode(String(node.text)));
    }
  }

  return html.join('');
};

function camelCase (str) {
  return str.replace(/[\W_](\w)/g, function (match, p1) {
    return p1.toUpperCase();
  }).replace(/[\W_]/g, '');
}
