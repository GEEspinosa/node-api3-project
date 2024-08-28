const express = require('express');
const Users = require('./users-model');
const Posts = require('../posts/posts-model');
const {
  validateUserId,
  validateUser,
  validatePost
} = require('../middleware/middleware')

// You will need `users-model.js` and `posts-model.js` both
// The middleware functions also need to be required

const router = express.Router();

router.get('/', async (req, res) => {
  // RETURN AN ARRAY WITH ALL THE USERS

  try {
    const users = await Users.get();
    res.status(200).json(users)
  } catch (err) {
    res.status(400).json({
      message: "The users information could not be retrieved"
    })
  }
});

router.get('/:id', validateUserId, (req, res) => {
  // RETURN THE USER OBJECT
  // this needs a middleware to verify user id

  try {
    res.status(200).json(req.user)
  } catch (err) {
    res.status(500).json({
      message: "The user information could not be retrieved"
    })
  }  
});

router.post('/', validateUser, async (req, res) => {
  // RETURN THE NEWLY CREATED USER OBJECT
  // this needs a middleware to check that the request body is valid

  try {
    const newUser = await Users.insert(req.body)
    res.status(201).json(newUser)
  } catch (err) {
    res.status(500).json({message: 'The user was unable to post', err})
  } 
});

router.put('/:id', validateUserId, validateUser, async (req, res) => {
  // RETURN THE FRESHLY UPDATED USER OBJECT
  // this needs a middleware to verify user id
  // and another middleware to check that the request body is valid
  
  try {
    const {id} = req.params
    //const {changes} = req.body
    const updatedUser = await Users.update(id, {...req.body});
    res.status(201).json(updatedUser)

  } catch (err) {
    res.status(500).json({
      message: "The user was unable to update", err
    })
  }
});

router.delete('/:id', validateUserId, async (req, res) => {
  // RETURN THE FRESHLY DELETED USER OBJECT
  // this needs a middleware to verify user id
  try {
    const {id} = req.params
    const goodbye = await Users.getById(id)
    const deletedUser = await Users.remove(id)
    res.status(200).json(goodbye)
  } catch (err) {
    res.status(500).json({
      message: "the user was unable to be deleted", err
    })
  }

});

router.get('/:id/posts', validateUserId, async (req, res) => {
  // RETURN THE ARRAY OF USER POSTS
  // this needs a middleware to verify user id

  try {
    const {id} = req.params 
    const posts = await Posts.get();
    const postsById = posts.filter((post) => post.user_id === Number(id))
    res.status(200).json(postsById)
  } catch (err) {
    res.status(500).json({
      message: "The posts were unable to be retrieved"
    })
  }
});

router.post('/:id/posts', validateUserId, validatePost, async (req, res) => {
  // RETURN THE NEWLY CREATED USER POST
  // this needs a middleware to verify user id
  // and another middleware to check that the request body is valid
  try {
    const post = req.body
    const {id} = req.params
    const newPost = await Posts.insert({...post, user_id: id})
    res.status(201).json(newPost)
  } catch (err) {
    res.status(500).json({
      message: "The post was not able to be inserted", err
    })
  }

});

// do not forget to export the router
module.exports = router