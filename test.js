const Nanodrag = require('./')
if (typeof window !== 'undefined') {
  const d = document.createElement('div')
  d.style.cssText = 'border: 1px solid black; position: absolute; top: 100px; left: 100px; width: 200px; height: 200px;'
  document.body.appendChild(d)
  const n = new Nanodrag(d)
  let offsetX = 0
  let offsetY = 0
  n.on('start', (data) => {
    const rect = d.getBoundingClientRect()
    offsetY = rect.y - data.start.y
    offsetX = rect.x - data.start.x
  })

  n.on('move', (data) => {
    d.style.top = `${data.current.y + offsetY}px`
    d.style.left = `${data.current.x + offsetX}px`
  })
}
