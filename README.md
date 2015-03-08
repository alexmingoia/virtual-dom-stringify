# virtual-dom-stringify

[![NPM version](http://img.shields.io/npm/v/virtual-dom-stringify.svg?style=flat)](https://npmjs.org/package/virtual-dom-stringify) [![NPM Downloads](https://img.shields.io/npm/dm/virtual-dom-stringify.svg?style=flat)](https://npmjs.org/package/virtual-dom-stringify) [![Build Status](http://img.shields.io/travis/alexmingoia/virtual-dom-stringify.svg?style=flat)](http://travis-ci.org/alexmingoia/virtual-dom-stringify) [![Tips](https://img.shields.io/gratipay/alexmingoia.svg?style=flat)](https://www.gratipay.com/alexmingoia/)

> Stringify [virtual-dom][0] trees into HTML. For parsing DOM nodes into a
virtual-dom tree use [vnode-virtualize][1].

## Deprecated

This module is deprecated. Use
[vdom-to-html](https://github.com/nthtran/vdom-to-html/).

## Installation

Using [npm](https://www.npmjs.org/):

```sh
npm install --save virtual-dom-stringify
```

Using [bower](http://bower.io/):

```sh
bower install --save virtual-dom-stringify
```

## API Reference
<a name="exp_module_virtual-dom-stringify--module.exports"></a>
### module.exports(node, parent, [options]) ⇒ <code>String</code> ⏏
Stringify given virtual dom tree and return html.

**Kind**: Exported function

| Param | Type | Description |
| --- | --- | --- |
| node | <code>VirtualNode</code> |  |
| parent | <code>VirtualNode</code> |  |
| [options] | <code>Object</code> |  |
| [options.selfClosingTags] | <code>Array.&lt;String&gt;</code> | tags that are self-closing |
| [options.attributes] | <code>Object.&lt;String, String&gt;</code> | map of attribute names where keys are camelCased name and values are the HTML attribute name. |
| [options.asciiSafe] | <code>Boolean</code> | encode non-ASCII symbols (default: false) |

**Example**
```javascript
var VirtualNode = require('vtree/vnode');
var stringify = require('virtual-dom-stringify');

stringify(new VirtualNode('div'));
// => "<div></div>"
```
## Contributing

Please submit all issues and pull requests to the [alexmingoia/virtual-dom-stringify](http://github.com/alexmingoia/virtual-dom-stringify) repository!

## Tests

Run tests using `npm test`.

## Support

If you have any problem or suggestion please open an issue [here](https://github.com/alexmingoia/virtual-dom-stringify/issues).

[0]: https://github.com/Matt-Esch/virtual-dom/
[1]: https://github.com/marcelklehr/vdom-virtualize/
