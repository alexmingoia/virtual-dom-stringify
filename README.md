# virtual-dom-html

Stringify [virtual-dom][0] trees into HTML. For parsing DOM nodes into a
virtual-dom tree use [vnode-virtualize][1]).

## Installation

```sh
npm install virtual-dom-html
```

## Usage

```javascript
var VirtualNode = require('vtree/vnode');
var vhtml = require('virtual-dom-html');

vhtml.stringify(new VirtualNode('div'));
// => "<div></div>"
```

### exports.stringify(vnode)

Returns html string.

## BSD Licensed

[0]: https://github.com/Matt-Esch/virtual-dom/
[1]: https://github.com/marcelklehr/vdom-virtualize/
