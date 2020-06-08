require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

const app = express()
app.use(cors())
app.use(express.json())

morgan.token('body', req => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(express.static('build'))

app.get('/info', async (req, res, next) => {
  let persons = await Person.find({})
    .catch(error => next(error))

  let string = `
    <div><p>Phonebook has info for ${persons.length} people<p>
    <p>${new Date()}<p><div>`

  res.send(string)
})

app.get('/api/persons', async (req, res, next) => {
  let persons = await Person.find({})
    .catch(error => next(error))
  res.send(persons)
})

app.get('/api/persons/:id', async (req, res, next) => {
  let person = await Person.findById(req.params.id)
    .catch(error => next(error))

  if (person) {
    res.send(person)
  } else {
    res.send(404)
  }
})

app.delete('/api/persons/:id', async (req, res, next) => {
  let personToBeRemoved = await Person.findByIdAndDelete(req.params.id)
    .catch(error => next(error))

  if (personToBeRemoved) {
    res.send('person removed')
  } else {
    res.status(404).send({ error: 'not found' })
  }
})

app.post('/api/persons/', (req, res, next) => {
  if (req.body === undefined) {
    return res.status(400).json({ error: 'content missing' })
  }

  let person = req.body
  const personToBeSaved = new Person({ name: person.name, number: person.number })
  personToBeSaved.save()
    .then( savedPerson => res.send(`${savedPerson} added`) )
    .catch( error => next(error) )
})

app.put('/api/persons/:id', (req, res, next) => {
  if (req.body === undefined) {
    return res.status(400).json({ error: 'content missing' })
  }

  let person = req.body
  Person.findByIdAndUpdate(req.params.id, person, { new: true })
    .then(modifiedPerson => res.send(`${modifiedPerson} modified`))
    .catch(error => next(error))
})

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

const errorHandler = (error, req, res, next) => {
  console.error(error.message)
  if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message })
  } else {
    return res.status(500).send({ error: 'Internal server error' })
  }
  // eslint-disable-next-line no-unreachable
  next(error)
}
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))