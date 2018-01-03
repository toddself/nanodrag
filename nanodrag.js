const window = require('global/window')
const document = require('global/document')
const Nanobus = require('nanobus')
const noop = () => {}

const defaultTrackingDelay = 300

const controlEvents = {
  touchstart: 'start',
  touchend: 'end',
  mousedown: 'start',
  mouseup: 'end',
  mouseleave: 'end',
  mouseover: ''
}

const moveEvents = {
  touchmove: 'move',
  mousemove: 'move'
}

const raf = window.requestAnimationFrame || window.setTimeout

function Nanodrag (targetEl, options) {
  if (!(this instanceof Nanodrag)) return new Nanodrag(targetEl)
  Nanobus.call(this)
  if (typeof targetEl === 'string') {
    targetEl = document.querySelector(targetEl)
  }

  if (!targetEl) {
    throw new Error('You must supply a valid selector or DOM Node')
  }

  options = options || {}

  this.targetEl = targetEl
  this._active = false
  this._startX = null
  this._startY = null
  this._currentX = null
  this._currentY = null
  this._direction = {x: '', y: ''}
  this._trackingDelay = options.trackingDelay || defaultTrackingDelay
  this._leaveTimer = null

  Object.keys(controlEvents).forEach((evt) => this.targetEl.addEventListener(evt, this, {passive: true}))
}

Nanodrag.prototype = Object.create(Nanobus.prototype)

Nanodrag.prototype.handleEvent = function (evt) {
  const evtType = controlEvents[evt.type] || moveEvents[evt.type]
  const pointerData = this._getPointerData(evt)
  const evtMethod = (this[`on${evtType}`] || noop).bind(this)

  if (evt.type === 'mouseleave' && this._active) {
    this._leaveTimer = window.setTimeout(() => evtMethod(evt, pointerData), this._trackingDelay)
    return
  } else if (this._leaveTimer !== null) {
    window.clearTimeout(this._leaveTimer)
    this._leaveTimer = null
  }

  evtMethod(evt, pointerData)
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
  Object.keys(moveEvents).forEach((evt) => this.targetEl.addEventListener(evt, this))
  this.emit('start', {start: {x: this._startX, y: this._startY}})
}

Nanodrag.prototype.onend = function (evt) {
  if (this._active) {
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
    Object.keys(moveEvents).forEach((evt) => this.targetEl.removeEventListener(evt, this))
    this._active = false
    this.emit('end', data)
  }
}

Nanodrag.prototype.onmove = function (evt, pointerData, force) {
  const update = () => {
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
  }

  if (this._active) {
    evt.preventDefault()
    raf(update)
  }
}

Nanodrag.prototype.close = function () {
  Object.keys(controlEvents).forEach((evt) => this.targetEl.removeEventListener(evt, this))
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
