const Note = require('../models/note')
const User = require('../models/user')

const initialNote =[
    {
        content : 'HTML is easy',
        date : new Date(),
        important : false,
    },
    {
        content : 'Browser can execute only Javascript',
        date : new Date(),
        important : true,
    },
]

const nonExistingId = async() => {
    const note  = new Note({
        content : 'not will be deleted soon',
        date : new Date(),
        important : false
    })

    await note.save()
    await note.remove()   
    return note._id.toString()
}

const notesInDb = async() => {
    const notes = await Note.find({})
    return  notes.map(note => note.toJSON())
}
const userInDb = async() => {
    const users = await User.find({})
    return users.map(user => user.toJSON())
}

module.exports = {
    initialNote, nonExistingId, notesInDb,userInDb
}