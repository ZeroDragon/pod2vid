const width = 1280
const height = 720
const cnvs = document.getElementById('cnvs')
const ctx = cnvs.getContext('2d')
const mirror = document.getElementById('mirror')
const button = document.getElementById('btn-download')

const addText = (text, size, x, y) => {
  cnvs.style.letterSpacing = -2
  ctx.textBaseline = "top"
  ctx.font = `700 ${size}px Fira Code`
  ctx.textAlign = "center"
  ctx.fillStyle = "#2a2d40"
  wrapText(text, x + 5, y + 5, width, size * 1.1)
  ctx.fillStyle = "#FFFFFF"
  wrapText(text, x, y, width, size * 1.1)
}

const wrapText = (text, x, y, maxWidth, lineHeight) => {
  var words = text.split(' ');
  var line = '';

  for(var n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;
    if (testWidth > maxWidth && n > 0) {
    ctx.fillText(line, x, y);
    line = words[n] + ' ';
    y += lineHeight;
    }
    else {
    line = testLine;
    }
  }
  ctx.fillText(line, x, y);
}

const addWaves = () => {
  [... new Array(4)].forEach((i,k) => {
    const alpha = (3.5 - k) / 10
    const offset = 1000 - (k * 115)
    ctx.beginPath()
    ctx.fillStyle = `rgba(255,255,255,${alpha})`
    ctx.ellipse(width / 2, offset, width * 0.64, 380, 0, 0, 2 * Math.PI)
    ctx.fill()
  })
}

button.addEventListener('click', function (e) {
  const dataURL = cnvs.toDataURL('image/png')
  button.href = dataURL
})

const loadImage = (uri, x, y) => {
  return new Promise(resolve => {
    var img1 = new Image()
    img1.onload = function () {
      ctx.drawImage(img1, 0, 0, this.width, this.height, x, y, 400, 400)
      resolve()
    }
    img1.src = uri
  })
}

const draw = async () => {
  const number = document.getElementById('number').value
  const name = document.getElementById('name').value
  const numberVPos = document.getElementById('numbervpos').value
  cnvs.width = mirror.width = width
  cnvs.height = mirror.height = height
  cnvs.style.letterSpacing = 0
  button.download = `${number} ${name}.png`

  ctx.clearRect(0, 0, width, height)

  const lingrad = ctx.createLinearGradient(0, 0, 0, height)
  lingrad.addColorStop(0.1, '#2a2d50')
  lingrad.addColorStop(1, '#191c3a')
  ctx.fillStyle = lingrad
  ctx.fillRect(0, 0, width, height)
  // addWaves(ctx)

  await loadImage('/avatar_swanros.png', 0, height - 400)
  await loadImage('/avatar_zero.png', width - 400, height - 400)

  addText(name, 100, width/2 + 20, 40)
  addText(number, 250, width/2 + 70, numberVPos)

  var dataURL = cnvs.toDataURL('image/png')
  mirror.src = dataURL
}
draw()
