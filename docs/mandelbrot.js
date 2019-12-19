let canvas = document.getElementById("canvas");
let context = canvas.getContext('2d');

function addEventListener () {
  canvas.addEventListener('click', (e) => {
    console.log(e)
    context.fillStyle = "red"
    context.fillRect(e.offsetX, e.offsetY, 2, 2);
  }, false);
}

function fillBackground () {
  context.fillStyle = "gray"
  context.fillRect(0, 0, 800, 800);
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

function drawMandelbrot (centerX, centerY, size, resolution) {
  const pixel = canvas.width > canvas.height ? canvas.height : canvas.width

  for (let i = 0; pixel > i; i++) {
    const x = (i * (size * 2) / pixel - size) + centerX

    for (let j = 0; pixel > j; j++) {
      const y = (j * (size * 2) / pixel - size) + centerY

      const {divergence, loopCount} = includeMandelbrotSet(x, y, resolution)
      if (divergence) {
        context.fillStyle = `rgb(${loopCount}, ${loopCount*2}, ${loopCount*4})`
        context.fillRect(i, j, 1, 1)
      }
    }
  }
}

function onLoad () {
  addEventListener()
  fillBackground()

  drawMandelbrot(0, 0, 2, 50)
  // drawMandelbrot(-1, 0, 0.5, 100)
}

onLoad()
