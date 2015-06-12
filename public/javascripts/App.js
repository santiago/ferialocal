requirejs.config({
    baseUrl: 'javascripts/modules',
    urlArgs: "bust=" + (new Date()).getTime()
});

// Start the main app logic.
requirejs(['Shop', 'Map'], function(_Shop, _Map) {

    var app = new(Backbone.View.extend({
        el: document,

        events: {
            "click a#plus-btn": "plus",
            "click a#share-btn": "share",
            "click a#que-es-btn": "que_es",
            "click section#que-es a.close": "close_que_es"
        },
        
        plus: function() {
            console.log('oe')
            
            $('section#publish').hide();
            $('section#share').hide();
            $('section#que-es').hide();

            if(app.loggedIn) {
                $('section#publish').fadeIn();
            } else {
                $('section#login').fadeIn();
            }
        },
        
        share: function() {
            $('section#publish').hide();
            $('section#login').hide();
            $('section#share').fadeIn();
        },
        
        que_es: function() {
            $('section#publish').hide();
            $('section#login').hide();
            $('section#share').hide();
            $('section#que-es').fadeIn();
        },
        
        close_que_es: function() {
            $('section#que-es').fadeOut();
        },

        initialize: function() {
            if(location.href.match(/cooperaciones/)) {
                location.href = 'http://ferialocal.co'
            }
        },
    }));

    app.loggedIn = !!$('.account').length;

    // app.Map = _Map;

    var AppRouter = Backbone.Router.extend({
        routes: {
            "": "start",
            "_=_": "start",
            "login": "showLogin",
            "search": "showSearch"
        },
        
        start: function(id) {
        },
        
        showLogin: function() {
        },
        
        showSearch: function() {
        }
    });
    new AppRouter();

    var Shop = _Shop(app);

    Backbone.history.start();
});