var encode = require('he').encode;
var isVNode = require('virtual-dom/vnode/is-vnode');
var isVText = require('virtual-dom/vnode/is-vtext');
var htmlAttrs = require('html-attributes');
var svgAttrs = require('svg-attributes');
var paramCase = require('param-case');
var selfClosingTags = require('./self-closing-tags');


/**
 * Stringify given virtual dom tree and return html.
 *
 * @param {VirtualNode} node
 * @param {VirtualNode?} parent
 * @param {Object=} options
 * @param {Array} options.selfClosingTags array of self-closing tag names
 * @param {Object} options.validAttributes map of valid attribute names where
 * keys are camelCased attribute name and values are HTML attribute name.
 * @param {Boolean=false} options.invalidAttributes output invalid attributes
 * @return {String}
 * @api public
 */

module.exports = function stringify (node, parent, options) {
  if (!node) return "";

  var attributes = [];
  var html = [];

  if (arguments.length === 2 && typeof parent === 'object' && !parent.tagName) {
    options = parent;
    parent = null;
  }

  options = options || {};
  options.selfClosingTags = (options.selfClosingTags || selfClosingTags);

  if (!options.validAttributes) {
    options.validAttributes = merge(htmlAttrs, svgAttrs);
  }

  if (isVNode(node)) {
    var properties = node.properties.attributes || node.properties;

    html.push('<' + node.tagName.toLowerCase());

    for (var attrName in properties) {
      var prop = properties[attrName];
      var validProp = options.validAttributes[camelCase(attrName)];
      var attrVal;

      if (!validProp && options.invalidAttributes) {
        validProp = attrName;
      }

      if (prop && validProp) {
        attrName = validProp || attrName;

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
              css.push(paramCase(styleProp) + ': ' + attrVal[styleProp] + ';');
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

    if (~options.selfClosingTags.indexOf(node.tagName.toLowerCase())) {
      html.push(' />');
    } else {
      html.push('>');

      if (node.children && node.children.length) {
        for (var i=0, l=node.children.length; i<l; i++) {
          var child = node.children[i];
          html.push(stringify(child, node));
        }
      }

      html.push('</' + node.tagName.toLowerCase() + '>');
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

function merge (a, b) {
  for (var key in b) {
    a[key] = b[key];
  }
  return a;
};
