require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const app = express()
const Person = require('./models/person')

app.use(express.json()) // JSON muotoisen pyynnön käsittely.
// Otetaan morgani käyttöön myös POST pyynnöissä
morgan.token('body', (req) => {
  return req.method === 'POST' ? JSON.stringify(req.body) : ''
})

app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
)
app.use(express.static('dist'))

app.use(morgan('tiny'))

app.get('/', (request, response) => {
  response.send('<h1>Hello Puhelinluettelo!</h1>')
})

// Hakee kaikki
app.get('/api/persons', (request, response, next) => {
  Person.find({})
    .then((persons) => {
      response.json(persons)
    })
    .catch((error) => {
      next(error)
    })
})

// Haku id perusteella
app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then((person) => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch((error) => next(error))
})

app.post('/api/persons', (request, response, next) => {
  const body = request.body

  // Tarkastetaan onko nimi ja numero annettu
  if (!body.name || !body.number) {
    const error = new Error('name or number missing')
    error.statusCode = 400
    return next(error)
  }

  // Tarkastetaan onko nimi jo olemassa
  Person.findOne({ name: body.name })
    .then((existingPerson) => {
      if (existingPerson) {
        const error = new Error('name must be unique')
        error.statusCode = 400
        return next(error)
      }

      // Luodaan uusi henkilö ja disti push
      const person = new Person({
        name: body.name,
        number: body.number,
      })

      // Tallennetaan henkilö tietokantaan
      person
        .save()
        .then((savedPerson) => {
          response.json(savedPerson)
        })
        .catch((error) => {
          next(error) // Siirretään virhe eteenpäin
        })
    })
    .catch((error) => {
      next(error) // Siirretään virhe eteenpäin
    })
})

app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body

  // Etsitään henkilö ID:n perusteella
  Person.findById(request.params.id)
    .then((person) => {
      if (!person) {
        return response.status(404).end() // Jos henkilöä ei löydy, palautetaan 404
      }

      // Päivitetään henkilön tiedot
      person.name = name
      person.number = number

      // Tallennetaan muutokset tietokantaan
      return person.save().then((updatedPerson) => {
        response.json(updatedPerson)
      })
    })
    .catch((error) => next(error))
})

// Poisto id perusteella
app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then((person) => {
      if (!person) {
        return response.status(404).json({ error: 'Person not found' })
      }
      response.status(204).end()
    })
    .catch((error) => next(error))
})

app.get('/info', (request, response, next) => {
  const date = new Date()

  Person.countDocuments({})
    .then((count) => {
      response.send(`
        <div>Phonebook has info for ${count} people</div>
        <div>${date}</div>
      `)
    })
    .catch((error) => {
      next(error)
    })
})

const unknownEndpoint = (response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}
app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
