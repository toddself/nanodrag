const window = require('global/window')
const document = require('global/document')
const Nanobus = require('nanobus')

const events = {
  touchstart: 'start',
  touchend: 'end',
  touchmove: 'move',
  mousedown: 'start',
  mouseup: 'end',
  mousemove: 'move'
}

const raf = window.requestAnimationFrame || window.setTimeout

function Nanodrag (targetEl) {
  if (!(this instanceof Nanodrag)) return new Nanodrag(targetEl)
  Nanobus.call(this)
  if (typeof targetEl === 'string') {
    targetEl = document.querySelector(targetEl)
  }

  if (!targetEl) {
    throw new Error('You must supply a valid selector or DOM Node')
  }

  this.targetEl = targetEl
  this._active = false
  this._startX = null
  this._startY = null
  this._currentX = null
  this._currentY = null
  this._direction = {x: '', y: ''}

  Object.keys(events).forEach((evt) => this.targetEl.addEventListener(evt, this))
}

Nanodrag.prototype = Object.create(Nanobus.prototype)

Nanodrag.prototype.handleEvent = function (evt) {
  const evtType = events[evt.type]
  const pointerData = this._getPointerData(evt)
  console.log('handling', evtType, pointerData)
  this[`on${evtType}`](evt, pointerData)
}

Nanodrag.prototype._getPointerData = function (evt) {
  if (evt.touches && evt.touches.length > 0) {
    return evt.touches[0]
  }

  const data = {
    pageX: evt.screenX + evt.currentTarget.scrollLeft,
    pageY: evt.screenY + evt.currentTarget.scrollTop
  }

  return data
}

Nanodrag.prototype.onstart = function (evt, pointerData) {
  this._startX = pointerData.pageX
  this._startY = pointerData.pageY
  this._active = true
  this.emit('start', {start: {x: this._startX, y: this._startY}})
}

Nanodrag.prototype.onend = function (evt) {
  const data = {
    start: {
      x: this._startX,
      y: this._startY
    },
    end: {
      x: this._currentX,
      y: this._currentY
    }
  }
  this._active = false
  this.emit('end', data)
}

Nanodrag.prototype.onmove = function (evt, pointerData) {
  if (this._active) {
    evt.preventDefault()
    raf(() => {
      this._currentX = pointerData.pageX
      this._currentY = pointerData.pageY
      const direction = this._getSwipeDirection()
      const data = {
        direction,
        start: {
          x: this._startX,
          y: this._startY
        },
        current: {
          x: this._currentX,
          y: this._currentY}
      }
      this.emit('move', data)
    })
  }
}

Nanodrag.prototype.close = function () {
  Object.keys(events).forEach((evt) => this.targetEl.removeEventListener(evt, this))
  this.removeAllListeners()
  this._active = false
}

Nanodrag.prototype._getSwipeDirection = function () {
  const diffX = this._startX - this._currentX
  const diffY = this._startY - this._currentY
  const x = diffX > -1 ? 'left' : diffX < 0 ? 'right' : ''
  const y = diffY > -1 ? 'up' : diffY < 0 ? 'down' : ''
  return {x, y}
}

module.exports = Nanodrag
