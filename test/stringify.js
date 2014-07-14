var expect = require('expect.js');
var stringify = require('..');
var VirtualNode = require('vtree/vnode');
var VirtualText = require('vtree/vtext');

describe('stringify()', function() {
  it('returns string', function() {
    var vnode = new VirtualNode('div');
    var html = stringify(vnode);
    expect(html).to.be.a('string');
    expect(html).to.equal('<div></div>');
  });

  it('serializes valid vnode.properties', function() {
    var vnode = new VirtualNode('div', {
      'id': "test",
      'class': "testClass",
      'invalid': "test"
    });
    var html = stringify(vnode);
    expect(html).to.be.a('string');
    expect(html).to.equal('<div class="testClass" id="test"></div>');
  });

  it('outputs "class" for "className" property', function() {
    var vnode = new VirtualNode('div', {
      className: "small"
    });
    var html = stringify(vnode);
    expect(html).to.be.a('string');
    expect(html).to.equal('<div class="small"></div>');
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
});
