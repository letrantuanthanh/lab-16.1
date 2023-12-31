const bcrypt = require('bcryptjs')

const User = require('../models/user')

exports.getLogin = (req, res, next) => {
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    isAuthenticated: req.session.isLoggedIn,
  })
}

exports.postLogin = (req, res, next) => {
  const email = req.body.email
  const password = req.body.password
  User.findOne({ email: email })
    .then(user => {
      if (!user) return res.redirect('/login')
      bcrypt
        .compare(password, user.password)
        .then(isCorrect => {
          if (isCorrect) {
            req.session.userId = user._id
            req.session.isLoggedIn = true
            return req.session.save(err => {
              console.log(err)
              res.redirect('/')
            })
          }
          res.redirect('/login')
        })
    })
    .catch(err => console.log(err))
}

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    console.log(err)
    res.redirect('/login')
  })
}

exports.getSignup = (req, res, next) => {
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    isAuthenticated: req.session.isLoggedIn,
  })
}

exports.postSignup = (req, res, next) => {
  const email = req.body.email
  const password = req.body.password

  User.findOne({ email: email })
    .then(userDoc => {
      if (userDoc) {
        return res.redirect('/signup')
      }
      return bcrypt.hash(password, 12)
        .then(hashedPassword => {
          const user = new User({
            email,
            password: hashedPassword,
            cart: { items: [] },
          })
          return user.save()
        })
        .then(() => {
          res.redirect('/login')
        })
    })
    .catch(err => console.log(err))
}
