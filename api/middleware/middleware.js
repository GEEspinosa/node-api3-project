const Users = require('../users/users-model')



function logger(req, res, next) {
 
  console.log(`[${new Date().toISOString()}] ${req.method} to ${req.url}`);
  next()
}

async function validateUserId(req, res, next) {
  const user = await Users.getById(req.params.id)
  if (!user){
    res.status(404).send({
      message: "user not found"
    })
  } else{
    req.user = user
    next()
  }
  
}

function validateUser(req, res, next) {
  // DO YOUR MAGIC
  if (!req.body.name || !req.body.name.trim()) {
    res.status(400).send({
      message: "missing required name field"
    })
  }  else {
    next()
  }
  
}

function validatePost(req, res, next) {
  // DO YOUR MAGIC
  if (!req.body.text){
    res.status(400).send({
      message: "missing required text field"
    })
  } else {
    next()
  }
  
}

// do not forget to expose these functions to other modules
module.exports = {
  logger,
  validateUserId,
  validateUser,
  validatePost
}