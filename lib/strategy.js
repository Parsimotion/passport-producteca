/**
 * Module dependencies.
 */
var util = require('util')
  , OAuth2Strategy = require('passport-oauth').OAuth2Strategy;

/**
 * `Strategy` constructor.
 *
 * The Producteca authentication strategy authenticates requests by delegating
 * to Producteca using the OAuth 2.0 protocol.
 *
 * Applications must supply a `verify` callback which accepts an `accessToken`,
 * `refreshToken` (it will be null) and service-specific `profile`, and then
 * calls the `done` callback supplying a `user`, which should be set to `false`
 * if the credentials are not valid. If an exception occured, `err` should be set.
 *
 * Options:
 *   - `clientID`      your Producteca application's client id
 *   - `clientSecret`  your Producteca application's client secret
 *   - `callbackURL`   URL to which Producteca will redirect the user after granting authorization
 *
 * Examples:
 *
 *     passport.use(new ProductecaStrategy({
 *         clientID: '2288989987133514',
 *         clientSecret: 'shhh-its-a-secret'
 *         callbackURL: 'https://www.example.net/auth/mercadolibre/callback'
 *       },
 *       function(accessToken, _, profile, done) {
 *         User.findOrCreate(..., function (err, user) {
 *           done(err, user);
 *         });
 *       }
 *     ));
 *
 * @param {Object} Options
 * @param {Function} verify
 * @api public
 */
function Strategy(options, verify, locale) {
  options = options || {};
  options.authorizationURL = options.authorizationURL || 'http://auth.producteca.com/oauth/authorise';
  options.tokenURL = options.tokenURL || 'http://auth.producteca.com/oauth/token';
  this.profileUrl = options.profileUrl || 'http://auth.producteca.com/users/me';
  
  OAuth2Strategy.call(this, options, verify);
  this.name = 'producteca';
}

/**
 * Inherit from `OAuth2Strategy`.
 */
util.inherits(Strategy, OAuth2Strategy);

/**
 * Retrieve user profile from Producteca.
 *
 * This function constructs a normalized profile.
 *
 * @param {String} accessToken
 * @param {Function} done
 * @api protected
 */
Strategy.prototype.userProfile = function(accessToken, done) {
  this._oauth2.get(this.profileUrl, accessToken, function (err, body, res) {
    if (err) return done(err);
    
    try {
      var profile = JSON.parse(body);

      profile.provider = 'producteca';
      profile.accessToken = accessToken;

      done(null, profile);
    } catch(e) {
      done(e);
    };
  });
}

/**
 * Expose `Strategy`.
 */
module.exports = Strategy;
