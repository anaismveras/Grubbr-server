const express = require('express')
// jsonwebtoken docs: https://github.com/auth0/node-jsonwebtoken
const crypto = require('crypto')
// Passport docs: http://www.passportjs.org/docs/
const passport = require('passport')
// bcrypt docs: https://github.com/kelektiv/node.bcrypt.js
const bcrypt = require('bcrypt')
// pull in error types and the logic to handle them and set status codes
const customErrors = require('../../lib/custom_errors')

const BadParamsError = customErrors.BadParamsError
const BadCredentialsError = customErrors.BadCredentialsError
const Profile = require('../models/profile')
const User = require('../models/user')

// passing this as a second argument to `router.<verb>` will make it
// so that a token MUST be passed for that route to be available
// it will also set `res.user`
const requireToken = passport.authenticate('bearer', { session: false })

const removeBlanks = require('../../lib/remove_blank_fields')
const { json } = require('express/lib/response')

const handle404 = customErrors.handle404
// instantiate a router (mini app that only handles routes)
const router = express.Router()

// READ ALL users profile
router.get('/profile/restaurantLikers', requireToken, (req, res, next) => {
    Profile.find({
        _id: {$in: req.body.userIds}
    })
        .then(handle404)
        .then(foundUsers => {
        res.json(foundUsers)
        })
    .catch(err => console.log(err))
})

// READ ONE users profile
router.get('/profile/:userId', requireToken, (req, res, next) => {
    Profile.findOne({
        userId: req.params.userId
    })
        .then(handle404)
        .then(foundProfile => {
        res.json(foundProfile)
        })
    .catch(err => console.log(err))
})

// CREATE user's profile
router.post('/profile', requireToken, (req, res, next) => {
    Profile.create({
        userId: req.user._id,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        zipCode: req.body.zipCode,
        bio: req.body.bio,
        photo: req.body.photo,
        liked: req.body.liked,
        visited: req.body.visited,
        matchedUsers: req.body.matchedUsers
    })
        .then(handle404)
        .then(createdProfile => {
            res.json(createdProfile)
        })
        .catch(err => console.log(err))
})

// EDIT user's profile
router.patch('/profile/:userId', requireToken, removeBlanks, (req, res, next) => {
    Profile.findOneAndUpdate({userId: req.user._id},
        req.body
    )
        .then(handle404)
        .then(resp => {
            res.json(resp)
        })
    .catch(next)
})

// EDIT edit user's liked restaurants
router.patch('/profile/:userId/liked', requireToken, (req, res, next) => {
    Profile.findOne({
        userId: req.user._id

    })
        .then(handle404)
        .then(foundProfile => {
            if (foundProfile.liked.includes(req.body.restaurant)) {
                return 'Restaurant already exists, redirect'
            } else {
                foundProfile.liked.push(req.body.restaurant)
                return foundProfile.save()
            }
        })
        .then(resp => {
            res.json(resp)
        })
    .catch(err => console.log(err))
})

// DELETE a profile
router.delete('/profile/:userId', requireToken, (req, res, next) => {
    Profile.findOne({
        userId: req.user._id
    })
        .then(handle404)
        .then(foundProfile => {
        return foundProfile.deleteOne()
        })
        .then(() => res.sendStatus(204))
        // if error => throw to handler
        .catch(next)
})

module.exports = router