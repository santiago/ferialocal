var upload = require('../lib/Upload')();
var ServiceBase = require('../lib/ServiceBase');

var Shop = require('../domain/Shop').domain;
var ShopStore = require('../domain/Shop').store;

module.exports = function(app) {
    this.name = 'shop';
    this.resource = '/shops';
    this.store = ShopStore;
    
    this.beforePost = function(req, res, next) {
        req.body.user_id = 0; // = req.session.auth.userId
        next();
    };
    
    ServiceBase.call(this, app, null);
    
    app.post('/shops/:shop_id/logo_image', upload, function(req, res) {
        res.send('ok')
    });

    return this;
};