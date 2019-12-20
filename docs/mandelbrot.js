let cur = {
  x: 0,
  y: 0,
  size: 2, // (-2, -2) to (2, 2)
  iteration: 20
}

const dom = {
  canvas: document.getElementById("canvas"),
  link: document.getElementById('hiddenLink'),
  x: document.getElementById('x'),
  y: document.getElementById('y'),
  size: document.getElementById('size'),
  iteration: document.getElementById('iteration')
}
const context = dom.canvas.getContext('2d');
const pixel = dom.canvas.width > dom.canvas.height ? dom.canvas.height : dom.canvas.width

function resetCanvas () {
  cur.x = 0
  cur.y = 0
  cur.size = 2
  cur.iteration = 20
  setText()
  drawMandelbrot()
}

function drawCanvas () {
  getText()
  drawMandelbrot()
}

function downloadCanvas () {
  dom.link.href = dom.canvas.toDataURL()
  dom.link.click()
}

function includeMandelbrotSet (x, y, iteration) {
  let a = 0
  let b = 0

  for (let k = 0; iteration > k; k++) {
    const _a = a * a - b * b + x
    const _b = 2 * a * b + y
    a = _a
    b = _b
    if (a * a + b * b > 4) {
      return {divergence: true, loopCount: k}
    }
  }
  return {divergence: false, loopCount: 0}
}

function setText () {
  dom.x.value = cur.x
  dom.y.value = cur.y
  dom.size.value = cur.size
  dom.iteration.value = cur.iteration
}

function getText () {
  cur.x = parseFloat(dom.x.value)
  cur.y = parseFloat(dom.y.value)
  cur.size = parseFloat(dom.size.value)
  cur.iteration = parseFloat(dom.iteration.value)
}

function setURL () {
  history.pushState(cur, null, `index.html?cx=${cur.x}&cy=${cur.y}&s=${cur.size}&r=${cur.iteration}`)
}

function getURL () {
  const search = decodeURI(location.search.substring(1).replace(/&/g, "\",\"").replace(/=/g, "\":\""))
  if (search !== '') {
    const param = JSON.parse('{"' + search + '"}')
    cur.x = parseFloat(param.cx)
    cur.y = parseFloat(param.cy)
    cur.size = parseFloat(param.s)
    cur.iteration = parseFloat(param.r)
  }
}

function fillBackground () {
  context.clearRect(0, 0, 800, 800);
}

function drawMandelbrot () {
  fillBackground()
  for (let i = 0; pixel > i; i++) {
    const x = (i * (cur.size * 2) / pixel - cur.size) + cur.x

    for (let j = 0; pixel > j; j++) {
      const y = (j * (cur.size * 2) / pixel - cur.size) + cur.y

      const {divergence, loopCount} = includeMandelbrotSet(x, y, cur.iteration)
      if (divergence) {
        const color = `rgb(${loopCount % 256}, ${(loopCount*2) % 256}, ${(loopCount*4) % 256})`
        context.fillStyle = color
        context.fillRect(i, j, 1, 1)
      }
    }
  }
  setURL()
  setText()
}

function event () {
  window.addEventListener('load', function() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('service_worker.js')
        .then(() => {
          console.log('Service Worker was registered');
        })
        .catch((err) => {
          console.log('Service Worker was NOT registered');
        })
    }
  })

  window.addEventListener('popstate', (e) => {
    if (e.state) {
      cur = e.state
    } else {
      cur.x = 0
      cur.y = 0
      cur.size = 2
      cur.iteration = 20
    }
    drawMandelbrot()
  })

  canvas.addEventListener('click', (e) => {
    const x = (e.offsetX * (cur.size * 2) / pixel - cur.size) + cur.x
    const y = (e.offsetY * (cur.size * 2) / pixel - cur.size) + cur.y
    const size = cur.size * 0.5
    const iteration = cur.iteration * 1.2
    cur.x = x
    cur.y = y
    cur.size = size
    cur.iteration = iteration
    drawMandelbrot()
  }, false)
}

function onLoad () {
  event()
  getURL()
  drawMandelbrot()
}

onLoad()
