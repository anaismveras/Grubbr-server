const express = require('express')
// jsonwebtoken docs: https://github.com/auth0/node-jsonwebtoken
const crypto = require('crypto')
// Passport docs: http://www.passportjs.org/docs/
const passport = require('passport')
// bcrypt docs: https://github.com/kelektiv/node.bcrypt.js
const bcrypt = require('bcrypt')
// pull in error types and the logic to handle them and set status codes
const errors = require('../../lib/custom_errors')
const axios = require('axios')

const BadParamsError = errors.BadParamsError
const BadCredentialsError = errors.BadCredentialsError
const Restaurant = require('../models/restaurant')
const Profile = require('../models/profile')
const User = require('../models/user')
const mongoose = require('mongoose')


// passing this as a second argument to `router.<verb>` will make it
// so that a token MUST be passed for that route to be available
// it will also set `res.user`
const requireToken = passport.authenticate('bearer', { session: false })

const removeBlanks = require('../../lib/remove_blank_fields')

// instantiate a router (mini app that only handles routes)
const router = express.Router()

// const profileUpdateRequest = (userId) => {
//     return  axios.post(`http://localhost:8000/profile/${userId}`)
// }

// const restFindByYelp = (yelpId) => {
//     return 
// }

// API call for just zip
router.get('/restaurants/Yelp/:zipCode', requireToken, (req, res, next) => { 
    axios(`https://api.yelp.com/v3/businesses/search?location=${req.params.zipCode}&categories=restaurants`, {
        headers: {
            "Authorization": `Bearer U4Q48Uepg5PTsphW2fvdiGgCwHpmuamF-4GZxM8J-FbjqH8g5zobhiSylXz_BYdL6YoyC-sAqNvljaeo3t8-RfEo8ZSDgqO9OX0aYpd8kAv8vBVTppzfnDVgBrSyYXYx`
            // "Access-Control-Allow-Origin":"*",
            // "Access-Control-Allow-Credentials": true,
            // "Access-Control-Allow-Methods": "GET",
            // "accept": "application/json",
            // "x-requested-with": "xmlhttprequest"
        }
    }).then(resp => {
        console.log('Response:\n', resp.data)
        res.json(resp.data)
    })
    .catch(next)
})

// API call for just zip
router.get('/restaurants/Yelp/:zipCode/:category', requireToken, (req, res, next) => {
    axios.get(`https://api.yelp.com/v3/businesses/search?location=${req.params.zipCode}&categories=${req.params.category}`, {
        headers: {
            "Authorization": `Bearer ${process.env.API_KEY}`
            // "Access-Control-Allow-Origin":"*",
            // "Access-Control-Allow-Credentials": true,
            // "Access-Control-Allow-Methods": "GET",
            // "accept": "application/json",
            // "x-requested-with": "xmlhttprequest"
        }
    }).then(resp => {
        console.log('Response:\n', resp.data.businesses)
        res.json(resp.data.businesses)
    })
    .catch(next)
})

// show all restaurants
router.get('/restaurants', requireToken, (req, res, next) => {
    Restaurant.find({})
        .then(rest => {
        res.json(rest)
        })
    .catch(next)
})

// show one restaurant
router.get('/restaurants/:restaurantId', requireToken, (req, res, next) => {
    Restaurant.find({_id: req.params.restaurantId})
        .then(rest => {
        res.json(rest)
        })
    .catch(next)
})

// create a restaurant if it doesn't already exist
router.post('/restaurants', requireToken, (req, res, next) => {
    // finds one restaurant by it's yelp id
    Restaurant.findOne({
        yelpId: req.body.yelpId,
    })
        .then(resp => {
            // if it already exists in the grubbr db
            if (resp) {
                // console.log(resp)
                // add the current user who is liking it to the restaurants user array
                resp.users.push(req.user._id)
                return resp.save()
            // if it doesn't already exist
            } else {
                // console.log(resp)
                // create a new restaurant with the current user in the users array
                // remove unneccesary information from and simplify categories array
                let categories = req.body.categories.map(cat => {
                    return cat.title
                })
                return Restaurant.create({
                    name: req.body.name,
                    location: req.body.location,
                    yelpId: req.body.yelpId,
                    comments: [],
                    image_url: req.body.image_url,
                    rating: req.body.rating,
                    price: req.body.price,
                    categories: categories,
                    users: [req.user._id]
                })
            }
        })
        .then(restaurant => {
            console.log('restaurant likers:', restaurant.users)
            let objectifiedUsers = restaurant.users.map(user => {
                return user
            })
            Profile.find({
                userId: { $in: objectifiedUsers }
            })
                .then(usersArray => {
                console.log(usersArray)
                return { restaurant: restaurant, usersArray: usersArray}
            })
            .then(data => res.status(200).json(data))
        })
    .catch(next)
})

// delete a restaurant
router.delete('/restaurant/:restaurantId', requireToken, (req, res, next) => {
    Restaurant.findOne({
        _id: req.params.profileId,
    })
        .then(foundRestaurant => {
        return foundRestaurant.deleteOne()
        })
        .then(() => res.sendStatus(204))
        // if error => throw to handler
        .catch(next)
})

module.exports = router