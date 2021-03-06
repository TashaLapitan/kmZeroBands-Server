const express = require("express");
const router = express.Router();
const createError = require("http-errors");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const User = require("../models/user.model");


const {
  isLoggedIn,
  isNotLoggedIn,
  validationLogin
} = require("../helpers/middlewares");


router.post('/signup', isNotLoggedIn, validationLogin, (req, res, next) => {
  const { username, email, password } = req.body;

  User.findOne({ email })
    .then( (foundUser) => {

      if (foundUser) {
        return next( createError(400) ); // Bad Request
      }
      else {
        const salt = bcrypt.genSaltSync(saltRounds);
        const encryptedPassword = bcrypt.hashSync(password, salt);

        User.create( { username, email, password: encryptedPassword })
          .then( (createdUser) => {

            createdUser.password = "*";
            req.session.currentUser = createdUser; 

            res
              .status(201) 
              .json(createdUser); 

          })
          .catch( (err) => {
            next( createError(err) );  
          });
      }
    })
    .catch( (err) => {
      next( createError(err) );
    });


})




router.post('/login', isNotLoggedIn, validationLogin, (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email })
    .then( (user) => {
      if (!user) {
        return next( createError(404)  );  
      }

      const passwordIsValid = bcrypt.compareSync(password, user.password); 

      if (passwordIsValid) {
        user.password = "*";
        req.session.currentUser = user;

        res
          .status(200)
          .json(user);
      }
      else {
        next( createError(401) ); 
      }

    })
    .catch( (err) => {
      next( createError(err)  );
    });
})


router.get('/logout',  isLoggedIn, (req, res, next) => {
  req.session.destroy( function(err){
    if (err) {
      return next(err);
    }
    res
      .status(204)  
      .send();
  } )
})

router.get('/me', isLoggedIn, (req, res, next) => {
  const {_id} = req.session.currentUser;
  User.findById(_id)
    .then(() => {
      const currentUserSessionData = req.session.currentUser;
      res.status(200).json(currentUserSessionData);
    })
})


module.exports = router;
