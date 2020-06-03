const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

app.use(cors())
app.use(express.json())

morgan.token('body', req => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

let persons = [
  {
    "name": "Arto Hellas",
    "number": "040-123456",
    "id": 1
  },
  {
    "name": "Ada Lovelace",
    "number": "39-44-5323523",
    "id": 2
  },
  {
    "name": "Dan Abramov",
    "number": "12-43-234345",
    "id": 3
  },
  {
    "name": "Mary Poppendieck",
    "number": "39-23-6423122",
    "id": 4
  }
]

app.get('/', (req, res) => res.send('Hello World!'))

app.get('/info', (req, res) => {
  let string = `
    <div><p>Phonebook has info for ${persons.length} people<p>
    <p>${new Date()}<p><div>`

  res.send(string)
})


app.get('/api/persons', (req, res) => {
    res.send(persons)
})

app.get('/api/persons/:id', (req, res) => {
  let person = persons.find( person => person.id === Number(req.params.id))

  if (person) {
    res.send(person)
  } else {
    res.send(404)
  }
})

app.delete('/api/persons/:id', (req, res) => {
  let personToBeRemoved = persons[Number(req.params.id)]

  if (personToBeRemoved) {
    persons = persons.filter(person => person.id != personToBeRemoved.id)
    res.send("person removed")
  } else {
    res.status(404).send({error: 'not found'})
  }
})

app.post('/api/persons/', (req, res) => {

  let person = req.body

  if (!person.name) {
    res.status(400).send({error: 'person must have a name'})
  } else if (!person.number) {
    res.status(400).send({error: 'person must have a number'})
  } else if (persons.find(persons => persons.name === person.name)) {
    res.status(409).send({error: 'name must be unique'})
  } else {
    person.id = parseInt(Math.random() * 10000)
    persons.push(person)
    res.send("person added")
  }
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))