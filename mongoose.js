const mongoose = require('mongoose')
if (process.argv.length < 3){
    console.log('please provide the password as an argument: node mongo.js <password>')
    process.exit(1)
}

const password = process.argv[2]

const url =
`mongodb+srv://phone_book_project:${password}@cluster0.6hvdh.mongodb.net/note-app?retryWrites=true&w=majority`

mongoose.connect(url)

const noteSchema = new mongoose.Schema({
    content: String,
    date : Date,
    important: Boolean,
})

const Note = mongoose.model('Note',noteSchema)

/*const note = new Note({
    content: 'fullstack course is enrinching',
    date : new Date(),
    important: true,

})

note.save().then(result =>{
    console.log('note saved!')
    mongoose.connection.close()

}).catch( err => console.log(err))*/

Note.find({important: true}).then(result =>{
    result.forEach(note =>{
        console.log(note)
    })
    mongoose.connection.close()
})

