const { spawn } = require('child_process')
const fs = require('fs')
const path = require('path')

const [,,offset = '00:00'] = process.argv
const [ms, ss] = offset.split(':').map(tt => ~~tt)
const extraSeconds = ss + ms * 60

const mp3 = fs.readdirSync(__dirname)
  .filter(file => {
    return path.extname(file) === '.mp3'
  })[0]

const fileName = path.basename(mp3, '.mp3')

const call = spawn('ffprobe', [mp3])

const events = []
call.stderr.on('data', chunk => {
  events.push(chunk.toString())
})
const secondsToTime = s => {
  return [
    Math.floor(s / 3600),
    Math.floor(s / 60),
    s % 60
  ]
    .map(t => t >= 60 ? t % 60 : t)
    .map(t => z(t))
    .join(':')
}
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
      const seconds = ~~parseFloat(time.toString().slice(0, time.length - 1)) + extraSeconds
      return secondsToTime(seconds)
      // return z(Math.floor(seconds / 60)) + ':' + z(seconds % 60)
    }
    return ' ' + element.split(': ')[1] + '\n'
  }).join('')
  const output = path.join(__dirname, `${fileName}.txt`)
  fs.writeFileSync(output, chapters)
  console.log(output)
})

