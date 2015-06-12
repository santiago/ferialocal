var Store = require('../lib/Store');

var CommentStore = Store('Comment', {
    user_id: { type: String, index: true },
    user_photo: String,
    by: { type: String, index: true },
    shop_id: { type: String, index: true },
    comment: { type: Array, index: true },
    created: { type: Date, default: Date.now },
    modified: { type: Date, default: Date.now }
});

module.exports = {
    store: CommentStore
}