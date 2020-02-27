const width = 1000
const height = 1000
const cnvs = document.getElementById('cnvs')
const ctx = cnvs.getContext('2d')
const mirror = document.getElementById('mirror')
const button = document.getElementById('btn-download')

const addText = (text, size, x, y, fg="#FFFFFF", bg="#1A1E2A") => {
  cnvs.style.letterSpacing = -2
  ctx.textBaseline = "top"
  ctx.font = `700 ${size}px Fira Code`
  ctx.textAlign = "center"
  ctx.fillStyle = bg
  wrapText(text, x + 5, y + 5, width, size * 1.1)
  ctx.fillStyle = fg
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
  [... new Array(4)].forEach((_i, k) => {
    const alpha = (3 - k) / 10
    const offset = 1150 - (k * 115)
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
      ctx.drawImage(img1, 0, 0, this.width, this.height, x, y, 900, 250)
      resolve()
    }
    img1.src = uri
  })
}

const draw = async () => {
  const number = document.getElementById('number').value
  const name = document.getElementById('name').value
  cnvs.width = mirror.width = width
  cnvs.height = mirror.height = height
  cnvs.style.letterSpacing = 0
  button.download = `${number} ${name}.png`

  ctx.clearRect(0, 0, width, height)

  const lingrad = ctx.createLinearGradient(0, 0, 0, height)
  lingrad.addColorStop(0.1, '#fdb53f')
  lingrad.addColorStop(0.5, '#ed9c47')
  ctx.fillStyle = lingrad
  ctx.fillRect(0, 0, width, height)
  addWaves(ctx)

  // await loadImage('/thing1.png', 50, 600)

  addText(name, 90, width/2 + 25, 40)
  addText(number, 150, width/2 + 50, 200)
  addText('patreon.com/elpodcastdev', 50, width/2 + 20, 900, "#730067", "transparent")
  addText('escucha el after completo en', 30, width/2 + 20, 860, "#730067", "transparent")

  var dataURL = cnvs.toDataURL('image/png')
  mirror.src = dataURL
}
draw()
