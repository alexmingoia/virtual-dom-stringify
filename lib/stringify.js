var he = require('he');
var isVNode = require('virtual-dom/vnode/is-vnode');
var isVText = require('virtual-dom/vnode/is-vtext');
var isThunk = require('virtual-dom/vnode/is-thunk');
var htmlAttrs = require('html-attributes');
var svgAttrs = require('svg-attributes');
var paramCase = require('param-case');
var selfClosingTags = require('./self-closing-tags');

/**
 * @module virtual-dom-stringify
 */

/**
 * Stringify given virtual dom tree and return html.
 *
 * @example
 *
 * ```javascript
 * var VirtualNode = require('vtree/vnode');
 * var stringify = require('virtual-dom-stringify');
 *
 * stringify(new VirtualNode('div'));
 * // => "<div></div>"
 * ```
 *
 * @param {VirtualNode} node
 * @param {VirtualNode?} parent
 * @param {Object=} options
 * @param {Array.<String>=} options.selfClosingTags tags that are self-closing
 * @param {Object.<String, String>=} options.attributes map of attribute names
 * where keys are camelCased name and values are the HTML attribute name.
 * @param {Boolean=} options.asciiSafe encode non-ASCII symbols (default: false)
 * @returns {String}
 * @alias module:virtual-dom-stringify
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

  if (!options.attributes) {
    options.attributes = merge(htmlAttrs, svgAttrs);
  }

  var encode = options.asciiSafe ? he.encode : he.escape;

  if (isThunk(node)) {
    node = (node.vnode || node.render());
  }

  if (isVNode(node)) {
    var properties = node.properties;

    if (node.properties.attributes) {
      merge(properties, node.properties.attributes);
    }

    html.push('<' + node.tagName.toLowerCase());

    for (var key in properties) {
      var split = key.split(':');
      var ns = (split.length > 1) ? (split[0] + ':') : '';
      var prop = options.attributes[camelCase(split.pop())] || key;
      var attrVal = properties[key];

      if (prop && prop !== 'innerHTML') {
        if (typeof attrVal === 'object' && key !== 'style') {
          attrVal = attrVal.value;
        }

        if (attrVal) {
          // Special case for style. We need to iterate over all rules to create a
          // hash of applied css properties.
          if (key === 'style') {
            var css = [];
            for (var styleProp in attrVal) {
              css.push(paramCase(styleProp) + ': ' + attrVal[styleProp] + ';');
            }
            attributes.push(ns + prop + '="' + css.join(' ') + '"');
          } else if (attrVal === "true" || attrVal === true) {
            attributes.push(ns + prop);
          } else if (typeof attrVal !== 'function') {
            attributes.push(ns + prop + '="' + encode(String(attrVal)) + '"');
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

      if (node.properties.innerHTML) {
        html.push(node.properties.innerHTML);
      } else if (node.children && node.children.length) {
        for (var i=0, l=node.children.length; i<l; i++) {
          var child = node.children[i];
          html.push(stringify(child, node, options));
        }
      }

      html.push('</' + node.tagName.toLowerCase() + '>');
    }
  }
  else if (isVText(node)) {
    if (parent && parent.tagName.toLowerCase() === 'script') {
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
