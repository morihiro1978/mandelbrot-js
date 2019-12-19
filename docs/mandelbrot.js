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

function drawMandelbrot () {
  const size = 4
  const pixel = canvas.width > canvas.height ? canvas.height : canvas.width

  for (let i = 0; pixel > i; i++) {
    const x = i * size / pixel - size / 2

    for (let j = 0; pixel > j; j++) {
      const y = j * size / pixel - size / 2

      let a = 0
      let b = 0

      for (let k = 0; 50 > k; k++) {
        const _a = a * a - b * b + x
        const _b = 2 * a * b + y
        a = _a
        b = _b
        if (a * a + b * b > 4) {
          context.fillRect(i, j, 1, 1)
          break
        }
      }
    }
  }
}

function onLoad () {
  addEventListener()
  fillBackground()

  context.fillStyle = "blue"
  drawMandelbrot()
}

onLoad()
