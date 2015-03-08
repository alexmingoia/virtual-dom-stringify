var expect = require('expect.js');
var h = require('virtual-dom/h');
var VirtualNode = require('virtual-dom/vnode/vnode');
var VirtualText = require('virtual-dom/vnode/vtext');
var VirtualThunk = require('vdom-thunk');
var svg = require('virtual-dom/virtual-hyperscript/svg');
var stringify = require('..');
var noop = function () {};

describe('stringify()', function() {
  it('returns string', function() {
    var vnode = h('div');
    var html = stringify(vnode);
    expect(html).to.be.a('string');
    expect(html).to.equal('<div></div>');
  });

  it('serializes unrendered thunks', function () {
    var vthunk = VirtualThunk(function () {
      return h('div')
    });
    var html = stringify(vthunk);
    expect(html).to.be.a('string');
    expect(html).to.equal('<div></div>');
  });

  it('does not stringify functions', function () {
    var vnode = h('div', {
      'ev-click': noop
    });
    var html = stringify(vnode);
    expect(html).to.be.a('string');
    expect(html).to.equal('<div></div>');
  });

  it('serializes rendered thunks', function () {
    var vthunk = VirtualThunk(function () {
      return h('div')
    }).render();
    var html = stringify(vthunk);
    expect(html).to.be.a('string');
    expect(html).to.equal('<div></div>');
  });

  it('outputs "class" for "class" property', function() {
    var vnode = new VirtualNode('div', {
      'class': "small"
    });
    var html = stringify(vnode);
    expect(html).to.be.a('string');
    expect(html).to.equal('<div class="small"></div>');
  });

  it('outputs "class" for "className" property', function() {
    var vnode = new VirtualNode('div', {
      className: "small"
    });
    var html = stringify(vnode);
    expect(html).to.be.a('string');
    expect(html).to.equal('<div class="small"></div>');
  });

  it('outputs "accept-charset" for "acceptCharset" property', function() {
    var vnode = new VirtualNode('div', {
      acceptCharset: "utf-8"
    });
    var html = stringify(vnode);
    expect(html).to.be.a('string');
    expect(html).to.equal('<div accept-charset="utf-8"></div>');
  });

  it('outputs "http-equiv" for "httpEquiv" property', function() {
    var vnode = new VirtualNode('div', {
      httpEquiv: "refresh"
    });
    var html = stringify(vnode);
    expect(html).to.be.a('string');
    expect(html).to.equal('<div http-equiv="refresh"></div>');
  });

  it('serializes CSS for style attribute', function() {
    var vnode = new VirtualNode('div', {
      style: {
        'background': 'red',
        'font-weight': 'bold'
      }
    });
    var html = stringify(vnode);
    expect(html).to.be.a('string');
    expect(html).to.equal('<div style="background: red; font-weight: bold;"></div>');
  });

  it('recurses children', function() {
    var vnode = new VirtualNode('div', null, [
      new VirtualNode('div', { id: 2 }, [
        new VirtualNode('div', null, [new VirtualText('Test')])
      ]),
      new VirtualNode('div', { id: 3 })
    ]);
    var html = stringify(vnode);
    expect(html).to.be.a('string');
    expect(html).to.equal('<div><div id="2"><div>Test</div></div><div id="3"></div></div>');
  });

  it('serializes self closing tags', function () {
    var vnode = new VirtualNode('br');
    var html = stringify(vnode);
    expect(html).to.be.a('string');
    expect(html).to.equal('<br />');
  });

  it('does not encode script tag contents', function() {
    var vnode = h('div', [
      h('script', 'console.log("foobar");')
    ]);
    var html = stringify(vnode);
    expect(html).to.be.a('string');
    expect(html).to.equal('<div><script>console.log("foobar");</script></div>');
  });

  it('includes node\'s innerHTML', function () {
    var vnode = new VirtualNode('div', {
      innerHTML: '<p>hello world</p>'
    }, []);

    var html = stringify(vnode);
    expect(html).to.be.a('string');
    expect(html).to.equal('<div><p>hello world</p></div>');
  });

  it('ignores svg namespaces', function() {
    var vnode = svg('svg', null, [
      svg('use', {
        'xlink:href': '/icons.svg#icon-name'
      })
    ]);

    var html = stringify(vnode);
    expect(html).to.be.a('string');
    expect(html).to.equal('<svg><use xlink:href="/icons.svg#icon-name"></use></svg>');
  });

  it('serializes svg attributes', function() {
    var vnode = svg('svg', {
      viewBox: '0 0 24 24'
    }, [
      svg('path', {
        d: 'M3,18h18v-2H3V18z M3,13h18v-2H3V13z M3,6v2h18V6H3z'
      })
    ]);

    var html = stringify(vnode);
    expect(html).to.be.a('string');
    expect(html).to.equal('<svg viewBox="0 0 24 24"><path d="M3,18h18v-2H3V18z M3,13h18v-2H3V13z M3,6v2h18V6H3z"></path></svg>');
  });

  it('renders custom attributes', function () {
    var vnode = new VirtualNode('div', { 'custom-attribute': 'test' }, []);
    var html = stringify(vnode);
    expect(html).to.be.a('string');
    expect(html).to.equal('<div custom-attribute="test"></div>');
  });

  describe('options.attributes', function () {
    it('dictates which attributes are valid', function () {
      var vnode = new VirtualNode('div', { 'testAttribute': 'test' }, []);
      var html = stringify(vnode, {
        attributes: {
          'testAttribute': 'test-attribute'
        }
      });
      expect(html).to.be.a('string');
      expect(html).to.equal('<div test-attribute="test"></div>');
    });
  });

  describe('options.selfClosingTags', function () {
    it('dictates which tags should be self-closing', function () {
      var vnode = new VirtualNode('div', null, []);
      var html = stringify(vnode, {
        selfClosingTags: ['div']
      });
      expect(html).to.be.a('string');
      expect(html).to.equal('<div />');
    });
  });
});
