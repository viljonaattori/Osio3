require('dotenv').config()
const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const url = process.env.MONGODB_URI // Tuotanto
//const url = process.env.TEST_MONGODB_URI // Testaus

mongoose.set('strictQuery', false)
mongoose.connect(url)

const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
})

const Note = mongoose.model('Note', noteSchema)

/*note.save().then((result) => {
  console.log("note saved!");
  mongoose.connection.close();
});*/
Note.find({}).then((result) => {
  result.forEach((note) => {
    console.log(note)
  })
  mongoose.connection.close()
})
