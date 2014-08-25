# virtual-dom-stringify

[![Build Status](https://secure.travis-ci.org/alexmingoia/virtual-dom-stringify.png)](http://travis-ci.org/alexmingoia/virtual-dom-stringify) 
[![NPM version](https://badge.fury.io/js/virtual-dom-stringify.png)](http://badge.fury.io/js/virtual-dom-stringify)
[![Dependency Status](https://david-dm.org/alexmingoia/virtual-dom-stringify.png)](http://david-dm.org/alexmingoia/virtual-dom-stringify)

Stringify [virtual-dom][0] trees into HTML. For parsing DOM nodes into a
virtual-dom tree use [vnode-virtualize][1].

## Installation

Using [npm](https://npmjs.org/):

```sh
npm install --save virtual-dom-stringify
```

Using [bower](http://bower.io/):

```sh
bower install --save virtual-dom-stringify
```

Using browser script tag and global (UMD wrapper):

```html
// Available via window.mio
<script src="dist/virtual-dom-stringify.js"></script>
```

## Usage

```javascript
var VirtualNode = require('vtree/vnode');
var stringify = require('virtual-dom-stringify');

stringify(new VirtualNode('div'));
// => "<div></div>"
```

## API

### stringify(node:VirtualNode)

Returns html string.

## BSD Licensed

[0]: https://github.com/Matt-Esch/virtual-dom/
[1]: https://github.com/marcelklehr/vdom-virtualize/
