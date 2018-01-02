const window = require('global/window')
const document = require('global/document')
const Nanobus = require('nanobus')

const events = ['touchstart', 'touchend', 'touchmove']
const raf = window.requestAnimationFrame || window.setTimeout

function Nanoswipe (targetEl, config) {
  Nanobus.call(this)
  if (typeof target === 'string') {
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

  events.forEach((evt) => this.targetEl.addEventListener(evt, this))
}

Nanoswipe.prototype = Object.create(Nanobus.prototype)

Nanoswipe.prototype.handleEvent = function (evt) {
  const activeEl = evt.touches[0]
  this[`on${evt.type}`](evt, activeEl)
}

Nanoswipe.prototype.ontouchstart = function (evt, activeEl) {
  this._startX = activeEl.pageX
  this._startY = activeEl.pageY
  this._active = true
  this.emit('start', {start: {x: this._startX, y: this._startY}})
}

Nanoswipe.prototype.ontouchend = function (evt) {
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

Nanoswipe.prototype.ontouchmove = function (evt, activeEl) {
  if (this._active) {
    evt.preventDefault()
    raf(() => {
      this._currentX = activeEl.pageX
      this._currentY = activeEl.pageY
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

Nanoswipe.prototype.close = function () {
  events.forEach((evt) => this.targetEl.removeEventListener(evt, this))
  this.removeAllListeners()
  this._active = false
}

Nanoswipe.prototype._getSwipeDirection = function () {
  const diffX = this._startX - this._currentX
  const diffY = this._startY - this._currentY
  const x = diffX > -1 ? 'right' : diffX < 0 ? 'left' : ''
  const y = diffY > -1 ? 'up' : diffY < 0 ? 'down' : ''
  return {x, y}
}

module.exports = Nanoswipe
