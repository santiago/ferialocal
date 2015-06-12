var Store = require('../lib/Store');

var ShopStore = Store('Shop', {
    name: { type: String, index: true },
    user_id: { type: String, index: true },
    mapping_id: { type: String, index: true },
    category: { type: String, index: true },
    address: { type: String, default: '' },
    description: { type: String, index: true, default: '' },
    loc: { type: Array, index: '2d' },
    logo: String,
    
    author: { type: String, index: true },
    phone: { type: String, index: true },
    web: { type: String, index: true },
    fb: { type: String, index: true },
    flickr: { type: String, index: true },
    tumblr: { type: String, index: true },
    
    video: { type: Array },
    audio: { type: Array },
    image: { type: Array },
    created: { type: Date, default: Date.now },
    modified: { type: Date, default: Date.now }
});

var Shop = function() {
};

module.exports = {
    domain: Shop,
    store: ShopStore
}