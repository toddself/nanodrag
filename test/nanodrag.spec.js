const test = require('tape')
const Nanodrag = require('../')

function setup () {
  const d = document.createElement('div')
  d.style.cssText = 'width: 3px; height: 3px; position: absolute;'
  return d
}

function cleanup (d) {
  d.remove()
}

function createTouch (x, y, el, type) {
  const t = new window.Touch({
    identifier: Date.now(),
    clientX: x,
    clientY: y,
    target: el
  })

  const evt = new window.TouchEvent(`touch${type}`, {
    touches: [t],
    changedTouches: [t]
  })

  return evt
}

test('what a drag', (t) => {
  t.plan(4)
  const el = setup()
  document.body.appendChild(el)
  const nd = Nanodrag(el)
  nd.on('start', (data) => {
    t.equal(data.start.x, 2, 'touch start x')
    t.equal(data.start.y, 2, 'touch start y')
    t.ok(nd._active, 'is active')
  })
  const evt = createTouch(2, 2, el, 'start')
  document.body.dispatchEvent(evt)
  nd.close()
  document.body.dispatchEvent(evt)
  t.ok(!nd._active, 'not active')
  cleanup(el)
})
