const info = (...params) => {
  if (process.env.NODE_ENV !== 'test') {
    console.log(...params)
  }
}

const error = (...params) => {
  if (process.env.NODE_ENV !== 'test') {
    console.error(...params)
  }
}

module.exports = {
  info,
  error,
}

// Tämän exportin jälkeen viittaus muodossa:
// logger.info('message')
// logger.error('error message')

// TOINEN TAPA:
// Toinen vaihtoehto on destrukturoida funktiot omiin muuttujiin require-kutsun yhteydessä:
// const { info, error } = require('./utils/logger')
// info('message')
// error('error message')
