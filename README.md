# nanodrag

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

## License
Copyright © 2018 Todd Kennedy, Apache 2.0 License

