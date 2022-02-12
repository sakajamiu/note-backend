const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.post('/', async (request, response) => {
    const body = request.body
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(body.password, saltRounds)

    const user = new User({
        username : body.username,
        name : body.name,
        passwordHash : passwordHash,
    })

    const savedUser =  await user.save()
    response.json(savedUser)
})

usersRouter.get('/', async(request,response) =>{
    const Users = await User.find({}).populate('notes',{content: 1, date: 1})
    response.json(Users)
})

module.exports = usersRouter