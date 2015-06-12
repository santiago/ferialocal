var upload = require('../lib/Upload')();
var ServiceBase = require('../lib/ServiceBase');

var CommentStore = require('../domain/Comment').store;

module.exports = function(app) {
    this.name = 'comment';
    this.resource = '/comments';
    this.store = CommentStore;
    
    ServiceBase.call(this, app, null);
    
    app.post('/shops/:shop_id/logo_image', upload, function(req, res) {
        res.send('ok')
    });

    return this;
};