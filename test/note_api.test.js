const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const Note = require('../models/note')

beforeEach(async()=>{
    await Note.deleteMany({})
    /*const noteObjects = helper.initialNote.map(note => new Note(note))
    const promiseArray = noteObjects.map( note => note.save())
    await Promise.all(promiseArray)*/
    /*for (let note of helper.initialNote){
        let noteObject = new Note(note)
        await noteObject.save()
    }*/
    await Note.insertMany(helper.initialNote)
})

describe('when there is initially some note saved', ()=>{

    test('notes are returned as json', async() =>{
        await api
        .get('/api/notes') 
        .expect(200)
        .expect('Content-Type', /application\/json/)
    })

    test('all notes are returned', async() =>{
        const response = await api.get('/api/notes')
        expect(response.body).toHaveLength(helper.initialNote.length)
    })

    test('a specific note is within the returned Note', async() =>{
        const response = await api.get('/api/notes')
        const contents = response.body.map(r => r.content)
        expect(contents).toContain(
            'Browser can execute only Javascript'
        )
    })
})

describe('adding a new note', () =>{
    test('note without content will not be added', async() =>{
        const newNote = {
            important : true

        }
        await api
        .post('/api/notes')
        .send(newNote)
        .expect(400)
        
        const response = await helper.notesInDb()

        expect(response).toHaveLength(helper.initialNote.length)
    })

    test('a valid note can be added', async () => {
        const newNote = {
            content :'async/await simplifies making async calls',
            important: true
        }
        await api
        .post('/api/notes')
        .send(newNote)
        .expect(200)
        .expect('Content-Type', /application\/json/)
        
        const response = await helper.notesInDb()
        const contents = response.map( r => r.content)
        expect(response).toHaveLength(helper.initialNote.length + 1)
        expect(contents).toContain(
            'async/await simplifies making async calls'
        )
    })
})

describe('action pertaining to a specfic note', ()=> {
    test('a specific note can be viewed', async() =>{
        const noteInDB = await helper.notesInDb()
        const noteToView = noteInDB[0]
        const testNote  = await api 
                            .get(`/api/notes/${noteToView.id}`) 
                            .expect(200)
                            .expect('Content-Type', /application\/json/)
        
        const noteToTest = JSON.parse(JSON.stringify(noteToView))
        expect(testNote.body).toEqual(noteToTest)
    })

    test('a note can be delete', async() => {
        const noteInDB = await helper.notesInDb()
        const noteToDelete = noteInDB[0]
        await api
        .delete(`/api/notes/${noteToDelete.id}`)
        .expect(204)
        
        const notesRemainingInDb = await helper.notesInDb()
        
        expect(notesRemainingInDb).toHaveLength(noteInDB.length - 1)

        const contents = notesRemainingInDb.map( note => note.content)

        expect(contents).not.toContain(noteToDelete.content)
        
    })
})

afterAll(()=>{
    mongoose.connection.close()
})