const passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    Models = require('./models.js'),
    passportJWT = require('passport-jwt');

let Users = Modal.User,
    JWTStrategy = passportJWT.Strategy,
    ExtractJWT = passportJWT.ExtractJwt;

passport.use(new LocalStrategy({
    usernameField: 'Username',
    passwordField: 'Password'
}, (username, password, callback) =>{
    console.log(username + '' + password);
    Users.findOne({ Username: username}, (error, user) =>{
        if (error) {
            console.log(error);
            return callback(error);
        }
    })
}
    ))