const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://fullstackuser:${password}@cluster0-dq717.mongodb.net/phonebook?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv[3] && process.argv[4]) {
  const person = new Person({
    name: process.argv[3],
    number: process.argv[4],
  })

  person.save().then( () => {
    console.log('person saved!')
    mongoose.connection.close()
  })
} else {
  Person.find({}).then(result => {
    result.forEach(person => {
      console.log(person.name , person.number)
    })
    mongoose.connection.close()
  })
}