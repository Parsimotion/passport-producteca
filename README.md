# passport-producteca

[Passport](https://github.com/jaredhanson/passport) strategy for authenticating with [Producteca](http://www.producteca.com) using the OAuth 2.0 API.

Learn more about the OAuth 2.0 schema [here](http://oauth.net/2/).

## Installation

    $ npm install --save passport-producteca

## Configuration

The Producteca authentication strategy authenticates users using a Producteca
account and OAuth 2.0 tokens.  The strategy requires a `verify` callback, which
accepts these credentials and calls `done` providing a user, as well as
`options` specifying a client ID, client secret, and callback URL.

You can obtain the client ID and secret by creating a Producteca app:
```
POST auth.producteca.com/apps
Headers:
  Authorization: Bearer {tokenOfTheAppOwner}
Body:
  {
    "name": "Aplicateca",
    "scopes": "all",
    "redirectUri": "http://aplicateca.com/auth/producteca/callback"
  }
```

The configuration of the strategy is something like this:
```javascript
var ProductecaStrategy = require('passport-producteca').Strategy;

passport.use(new ProductecaStrategy({
    clientID: 'aplicateca-01fsk',
    clientSecret: 'sarasasasa',
    callbackURL: 'http://aplicateca.com/auth/producteca/callback',
  },
  function (accessToken, _, profile, done) {
    // + store/retrieve user from database, together with access token
    return done(null, profile); 
  }
));

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});
```

## Usage

Use `passport.authorize()`, specifying the `'producteca'` strategy, to
authenticate requests.

For example, as route middleware in an [Express](http://expressjs.com/)
application:

```javascript
app.get('/auth/producteca', passport.authorize('producteca'));

app.get('/auth/producteca/callback', 
  passport.authorize('producteca', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });

app.get('/', ensureAuthenticated, 
  function(req, res) {
    res.send("Logged in user: " + req.user.username);
  }
);

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { 
    return next(); 
  };
  res.redirect('/auth/producteca');
};
```

Example of the `user` object are:
```json
{  
   "id": 3,
   "provider": "producteca",
   "accessToken": "alskdjaklsjdflaskjfasl",
   "email": "pablo@gmail.com",
   "authorizations": [  
      {  
         "app": "aplicateca-01fsk",
         "scopes": "all",
         "_id": "5583353109ed7374185e8e82"
      }
   ],
   "company": {  
      "name": "A company",
      "id": 3
   },
   "profile": {  
      "firstName": "Pablo",
      "lastName": "Alta"
   },
   "credentials": {  
      "username": "pablo"
   }
}
```

## License

[The MIT License](http://opensource.org/licenses/MIT)

## Thanks

Thanks to https://github.com/mjpearson/passport-wordpress for the README and file structure.
