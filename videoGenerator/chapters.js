const { spawn } = require('child_process')
const fs = require('fs')
const path = require('path')

const mp3 = fs.readdirSync(__dirname)
  .filter(file => {
    return path.extname(file) === '.mp3'
  })[0]

const call = spawn('ffprobe', [mp3])

const events = []
// call.stdout.on('data', chunk => {
  // console.log(chunk.toString())
  // events.push(chunk.toString())
// })
call.stderr.on('data', chunk => {
  // console.log(chunk.toString())
  events.push(chunk.toString())
})
const z = i => `00${i}`.slice(-2)
call.on('close', _code => {
  const lines = events
    .join('\n')
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0)
    .filter(line => {
      return line.slice(0,7) === 'Chapter' || line.slice(0,5) === 'title'
    })
  const [, ...raw] = lines
  const chapters = raw.map((element, index) => {
    if (index % 2 === 0) {
      const time = element.split(' ')[3]
      const seconds = ~~parseFloat(time.toString().slice(0, time.length - 1))
      return z(Math.floor(seconds / 60)) + ':' + z(seconds % 60)
    }
    return ' ' + element.split(': ')[1] + '\n'
  }).join('')
  console.log(chapters)
})

