const test = require('tape')
const Nanodrag = require('../nanodrag')

function makeEl () {
  const d = document.createElement('div')
  d.style.cssText = 'width: 3px; height: 3px; position: absolute;'
  return d
}

function createTouch (x, y, el, type) {
  const t = new window.Touch({
    identifier: Date.now(),
    clientX: x,
    clientY: y,
    pageX: x,
    pageY: y,
    target: el
  })

  const evt = new window.TouchEvent(`touch${type}`, {
    touches: [t],
    changedTouches: [t]
  })

  return evt
}

test('init and close', (t) => {
  t.plan(4)
  const el = makeEl()
  document.body.appendChild(el)
  const nd = Nanodrag(el)
  nd.on('start', (data) => {
    t.equal(data.start.x, 2, 'touch start x')
    t.equal(data.start.y, 2, 'touch start y')
    t.ok(nd._active, 'is active')
  })
  const evt = createTouch(2, 2, el, 'start')
  el.dispatchEvent(evt)
  nd.close()
  el.dispatchEvent(evt)
  t.ok(!nd._active, 'not active')
  el.remove()
})

test('with a string', (t) => {
  t.plan(1)
  const el = makeEl()
  el.id = 'drag-tester'
  document.body.appendChild(el)
  const nd = new Nanodrag('#drag-tester')
  const evt = createTouch(2, 2, el, 'start')
  el.dispatchEvent(evt)
  t.ok(nd._active, 'active')
  nd.close()
  el.remove()
})

test('throws', (t) => {
  t.plan(1)
  t.throws(() => {
    Nanodrag('boop')
  }, 'boop throws')
})

test('tracks direction', (t) => {
  t.plan(12)
  const el = makeEl()
  document.body.appendChild(el)
  const nd = new Nanodrag(el)

  nd.on('start', () => {
    const dragEvent = createTouch(3, 3, el, 'move')
    t.ok(nd._active, 'is active')
    el.dispatchEvent(dragEvent)
  })

  nd.on('move', (data) => {
    t.equal(data.start.x, 2, 'start at 2')
    t.equal(data.start.y, 2, 'start at 2')
    t.equal(data.current.x, 3, 'move to 3')
    t.equal(data.current.y, 3, 'move to 3')
    t.equal(data.direction.x, 'right')
    t.equal(data.direction.y, 'down')
    const endEvent = createTouch(3, 3, el, 'end')
    el.dispatchEvent(endEvent)
  })

  nd.on('end', (data) => {
    t.ok(!nd._active, 'not active')
    t.equal(data.start.x, 2, 'start at 2')
    t.equal(data.start.y, 2, 'start at 2')
    t.equal(data.end.x, 3, 'end at 3')
    t.equal(data.end.y, 3, 'end at 3')
    nd.close()
    el.remove()
  })

  const startEvent = createTouch(2, 2, el, 'start')
  el.dispatchEvent(startEvent)
})
