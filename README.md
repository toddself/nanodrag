# nanodrag  [![stability][0]][1]
[![npm version][2]][3] [![build status][4]][5]
[![downloads][6]][7] [![js-standard-style][8]][9]

A small library to simplify the handling of drag events on mouse & touch devices.

## Usage

```js
const Nanodrag = require('nanodrag')
const div = document.createElement('div')
const nd = Nanodrag(div)

nd.on('start', (data) => {
  console.log('Drag started!', data)
})

nd.on('move', (data) => {
  console.log('Dragging!', data)
})

nd.on('end', (data) => {
  console.log('Drag finished!', data)
})

nd.close()
```

## API

### Methods

#### new Nanodrag(selector:string|element:HTMLElement):nanodrag
Create a new nanodrag instance. You can either pass in a valid selector for
`.querySelector` or a reference to an HTML element. A nanodrag instance is also
an instance of a [nanobus](https://github.com/choojs/nanobus) object.

#### nanodrag#on(event:string, listener:function)
Provide a function to invoke when the specified event is triggered

#### nanodrag#once(event:string, listener:function)
Attach an event to invoke only once

#### nanodrag#emit(event:string, data:any)
Invoke an event with a specific payload of data

#### nanodrag#removeListener(event:string, listener:function)
Remove a specific listener

#### nanodrag#removeAllListeners(event?:string)
Remove all listeners for a given event; if no event is specified, removed all
listeners.

#### nanodrag#close()
Remove all listeners on the DOM as well as on the nanobus instances and stop
reporting any move events

### Events

#### start
Triggered when a touch start or mouse down event occur on the nanodrag element. 

**data**
* start:object
    * x:number - the x coordinate of the touch instrument or mouse
    * y:number - the y coordinate of the touch instrument or mouse

#### move
Triggered when the mouse or touch instrument is moved after being started. For
mouse-like devices, this means the button must be actively held down

**data**
* start:object
    * x:number - the starting x coordinate of the touch instrument or mouse
    * y:number - the starting y coordinate of the touch instrument or mouse
* current:object
    * x:number - the current x coordinate of the touch instrument or mouse
    * y:number - the current y coordinate of the touch instrument or mouse
* direction:object
    * x:string - either 'left' or 'right
    * y:string - either 'up' or 'down

#### end
Triggered when the touchend or mouseup event occurs.

**data**
* start:object
    * x:number - the starting x coordinate of the touch instrument or mouse
    * y:number - the starting y coordinate of the touch instrument or mouse
* end:object
    * x:number - the end x coordinate of the touch instrument or mouse
    * y:number - the end y coordinate of the touch instrument or mouse



## License
Copyright © 2018 Todd Kennedy, [Apache 2.0 License](https://tldrlegal.com/license/apache-license-2.0-(apache-2.0))

[0]: https://img.shields.io/badge/stability-experimental-orange.svg?style=flat-square
[1]: https://nodejs.org/api/documentation.html#documentation_stability_index
[2]: https://img.shields.io/npm/v/nanodrag.svg?style=flat-square
[3]: https://npmjs.org/package/nanodrag
[4]: https://img.shields.io/travis/toddself/nanodrag/master.svg?style=flat-square
[5]: https://travis-ci.org/toddself/nanodrag
[6]: http://img.shields.io/npm/dm/nanodrag.svg?style=flat-square
[7]: https://npmjs.org/package/nanodrag
[8]: https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square
[9]: https://github.com/feross/standard
