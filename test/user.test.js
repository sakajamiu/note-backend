const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const User = require('../models/user')
const helper = require('./test_helper')

describe('when there is initially one user in the db', () => {
    beforeEach(async () => {
        await User.deleteMany({})
        const passwordHash = await bcrypt.hash('pass', 10)
        const user = new User({username: 'root', passwordHash})
        await user.save()
    })

    test('test that a new user can be added in the db',async() => {
        
        const userAtStart = await helper.userInDb()
        const user ={
            username: 'jamiusaka',
            name: 'jamiu',
            password : 'admin',
        }

        await api
          .post('/api/users')
          .send(user)
          .expect(200)
          .expect('Content-Type', /application\/json/)
        
        const UserAtEnd = await helper.userInDb()
        const username = UserAtEnd.map( user => user.username)

        expect(username).toContain(user.username)
        expect(UserAtEnd).toHaveLength(userAtStart.length + 1)
    })

    test('test that creating a new user fail with a proper status code and error mesage if user already exist', async() =>{
        const userAtStart = await helper.userInDb()
        const newUser ={
            username : 'jamiusaka',
            name: 'administrator',
            password:'pass1234'
        }

        const result = await api
                        .post('/api/users')
                        .send(newUser)
                        .expect(400)
                        .expect('Content-Type', /application\/json/)

        expect(result.body.error).toBe('`username` to be unique')
        const UserAtEnd = await helper.userInDb()
        expect(userAtStart).toHaveLength(UserAtEnd)
    })
})



afterAll(()=>{
    mongoose.connection.close()
})