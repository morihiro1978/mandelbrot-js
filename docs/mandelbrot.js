const canvas = document.getElementById("canvas");
const context = canvas.getContext('2d');
const pixel = canvas.width > canvas.height ? canvas.height : canvas.width
let current = {
  x: 0,
  y: 0,
  size: 2, // (-2, -2) to (2, 2)
  resolution: 20
}

function downloadCanvas () {
  let link = document.getElementById('hiddenLink')
  link.href = canvas.toDataURL()
  link.click()
}

function includeMandelbrotSet (x, y, resolution) {
  let a = 0
  let b = 0

  for (let k = 0; resolution > k; k++) {
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

function setURL () {
  history.pushState(current, null, `index.html?cx=${current.x}&cy=${current.y}&s=${current.size}&r=${current.resolution}`)
}

function setCurrentByURL () {
  const search = decodeURI(location.search.substring(1).replace(/&/g, "\",\"").replace(/=/g, "\":\""))
  if (search !== '') {
    const param = JSON.parse('{"' + search + '"}')
    current.x = parseFloat(param.cx)
    current.y = parseFloat(param.cy)
    current.size = parseFloat(param.s)
    current.resolution = parseFloat(param.r)
  }
}

function fillBackground () {
  context.clearRect(0, 0, 800, 800);
}

function drawMandelbrot (centerX, centerY, size, resolution) {
  fillBackground()
  for (let i = 0; pixel > i; i++) {
    const x = (i * (size * 2) / pixel - size) + centerX

    for (let j = 0; pixel > j; j++) {
      const y = (j * (size * 2) / pixel - size) + centerY

      const {divergence, loopCount} = includeMandelbrotSet(x, y, resolution)
      if (divergence) {
        const color = `rgb(${loopCount % 256}, ${(loopCount*2) % 256}, ${(loopCount*4) % 256})`
        context.fillStyle = color
        context.fillRect(i, j, 1, 1)
      }
    }
  }
}

function event () {
  window.addEventListener('popstate', (e) => {
    if (e.state) {
      current = e.state
    } else {
      current.x = 0
      current.y = 0
      current.size = 2
      current.resolution = 20
    }
    drawMandelbrot(current.x, current.y, current.size, current.resolution)
  })

  canvas.addEventListener('click', (e) => {
    const x = (e.offsetX * (current.size * 2) / pixel - current.size) + current.x
    const y = (e.offsetY * (current.size * 2) / pixel - current.size) + current.y
    const size = current.size * 0.5
    const resolution = current.resolution * 1.2
    drawMandelbrot(x, y, size, resolution)

    current.x = x
    current.y = y
    current.size = size
    current.resolution = resolution
    setURL()
  }, false)
}

function onLoad () {
  event()
  setCurrentByURL()
  drawMandelbrot(current.x, current.y, current.size, current.resolution)
}

onLoad()
