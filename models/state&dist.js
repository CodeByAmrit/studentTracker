const fs = require('fs')
const path = require('path')

function getFile (req, res, next) {
  fs.readFile('./states-and-districts.json', 'utf8', (err, data) => {
    if (err) {
      console.log('error on file read', err)
    }
    try {
      data = JSON.parse(data)
      res.locals.stateList = data
      next()
    } catch {
      console.log('Json.parse error : state And District')
      res.locals.stateList = {}
      next()
    }
  })
}

module.exports = { getFile }
