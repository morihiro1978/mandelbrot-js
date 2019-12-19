const canvas = document.getElementById("canvas");
const context = canvas.getContext('2d');
const pixel = canvas.width > canvas.height ? canvas.height : canvas.width
let currentX = 0
let currentY = 0
let currentSize = 2 // (-2, -2) to (2, 2)
let currentResolution = 20

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
  history.pushState(null, null, `index.html?cx=${currentX}&cy=${currentY}&s=${currentSize}&r=${currentResolution}`)
}

function setCurrentByURL () {
  const search = decodeURI(location.search.substring(1).replace(/&/g, "\",\"").replace(/=/g, "\":\""))
  if (search !== '') {
    const param = JSON.parse('{"' + search + '"}')
    currentX = parseFloat(param.cx)
    currentY = parseFloat(param.cy)
    currentSize = parseFloat(param.s)
    currentResolution = parseFloat(param.r)
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

function addEventListener () {
  canvas.addEventListener('click', (e) => {
    const x = (e.offsetX * (currentSize * 2) / pixel - currentSize) + currentX
    const y = (e.offsetY * (currentSize * 2) / pixel - currentSize) + currentY
    const size = currentSize * 0.5
    const resolution = currentResolution * 1.2
    drawMandelbrot(x, y, size, resolution)

    currentX = x
    currentY = y
    currentSize = size
    currentResolution = resolution
    setURL()
  }, false);
}

function onLoad () {
  addEventListener()
  setCurrentByURL()
  drawMandelbrot(currentX, currentY, currentSize, currentResolution)
}

onLoad()
