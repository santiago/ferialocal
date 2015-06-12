/*
 *  @module Mapping
 *  @exports function
 *
 */
define(function() {
return function(app) {
    // var Map = app.Map;
    
    /*  @Model Shop
     *
     */
    var Shop = Backbone.Model.extend({
        idAttribute: '_id',
        urlRoot: '/shops'
    });

    /*  @Model Point
     *
     */
    var Comment = Backbone.Model.extend({
        idAttribute: '_id',
        urlRoot: '/comments'
    });

    /*  @Collection ShopList
     *
     */
    var ShopList = Backbone.Collection.extend({
        model: Shop,
        url: '/shops'
    });
    

    /*  @Collection Comments
     *
     */
    var CommentList = Backbone.Collection.extend({
        model: Comment,
        url: '/comments'
    });


    /*  @View PublishView
     *
     */
    var el = $('section#publish').get();
    var PublishView = Backbone.View.extend({
        el: el,

        events: {
            "click a#publish-btn": "publish",
            'click #addlogo': 'addLogo',
            'click a.close': 'close'
        },

        initialize: function() {
            this.photoUpload();
            
            // Hide file input
            var wrapper = $('<div/>').css({height:0,width:0,'overflow':'hidden'});
            var fileInput = $(':file').wrap(wrapper);
            fileInput.change(function(){
                var $this = $(this);
                $('#file').text($this.val());
            });
        },

        /*render: function() {
        },*/

        close: function() {
            $("section#publish").fadeOut();
        },

        publish: function(e) {
            console.log('oe')
            var data = PublishForm.getValidData();
            if(data) {
                // console.log(data);
                this.collection.create(data, {
                    success: function(a, b) {
                        //console.log(a)
                        //Shops.render()
                        location.href = '#!/shops/'+a.id;
                        $('section#publish').fadeOut()
                    }
                });
            }
        },
    
        captureKey: function(e) {
            switch (e.keyCode) {
            case 13:
                this.createMapping();
                break;
            default:
                break;
            }
        },
        
        photoUpload: function() {
            var view = this;
            
            /*this.$el.find('.image-upload .control a').click(function(e) {
                e.preventDefault();
                $(this).blur();
                
                if ($(this).hasClass('cancel')) {
                    view.cancelUpload();
                }
                if ($(this).hasClass('skip')) {
                    view.skipCurrentUpload();
                }
            });*/
            
            $("#upload").html5_upload({
                url: '/shops/'+this.shop_id+'/logo_image',
                sendBoundary: window.FormData || $.browser.mozilla,
                onStart: function(event, total) {
                    // view.__progress = 0;
                    //$('.meter > span').width(0);
                    //$('.meter > span').removeClass('stop')
                    
                    /*var check = confirm("Está subiendo un total de " + total + " imágenes. ¿Desea continuar?");
                    if (check) {
                        $('.image-upload').find('.control p span.index').text(' 1');
                        $('.image-upload').find('.control p span.total').text(total);
                        $('#addphoto').fadeOut(function() {
                            $('.image-upload').slideDown();
                        });
                    }
                    return check;*/
                    return true;
                },
                onStartOne: function(event, name, number, total) {
                    view.__progress = 0;
                    view.__uploading = true;
                    $('.meter > span').removeClass('stop');
                    // $('.image-upload').find('.control p span.index').text(' ' + (number + 1));
                    view.startProgressBar();
                    return true;
                },
                onProgress: function(event, progress, name, number, total) {
                    view.__progress = parseFloat((progress*100).toString().slice(0,5));
                },
                onFinish: function(event, response, name, number, total) {
                    view.__uploading = false;
                },
                onError: function(event, name, error) {
                    alert('error while uploading file ' + name);
                }
            })
        },
        
        startProgressBar: function() {
            $('.meter > span').width(0);
            $('.meter > span').removeClass('stop')

            var view = this;
            function go() {
                var w = view.__progress + '%';
                if (/*view.__progress == 100 || */!view.__uploading) { return }
                $(".meter > span").animate({
                    width: w
                }, 100, go);
            }
            go()
        },
        
        addLogo: function() {
            $(':file').click();
        },

    });

    var Publish = new PublishView({
        collection: new ShopList
    });
 
    var ShopsView = Backbone.View.extend({
        el: $('section#shops').get(),
        
        initialize: function() {
            var view = this;
            this.collection.fetch({
                success: function(coll, data) {
                    view.render();
                }
            });
        },
        
        render: function() {
            $('section#shops ul').empty();
            this.collection.models.forEach(function(item) {
                item = item.toJSON();
                item.id = item._id;
                dust.render('shop_item', item, function(err, html) {
                    $('section#shops ul').prepend(html);
                });
            });
        },
        
        loadCategory: function(cat) {
            var view = this;
            this.collection.fetch({
                data: {
                    category: cat
                },
                success: function(data) {
                    $(".category-item a").each(function() {
                        var href = $(this).attr('href').split('/').pop();
                        if (href == cat) {
                            $(this).closest('ul').find('li.on').removeClass('on');
                            $(this).closest('li').addClass('on');
                        }
                    });
                    view.render()
                }
            });
        }
    });
    
    var Shops = new ShopsView({
        collection: new ShopList
    });
    
    var ShopView = new (Backbone.View.extend({
        initialize: function() {
            var view = this;
            this.comments = new CommentList;
            
            $("a#post-comment").live('click', function(e) {
                e.preventDefault();
                if (app.loggedIn) {
                    view.postComment();
                } else {
                    $('section#login').fadeIn();
                }
            });
        },
        
        render: function() {
            var view = this;
            var data = this.model.toJSON();
            if(data.web) data.web = data.web.replace(/(http|https):\/\//, '');
            if(data.fb) data.fb = data.fb.replace(/(http|https):\/\//, '');
            if(data.flickr) data.flickr = data.flickr.replace(/(http|https):\/\//, '');
            
            if(data.web) data.web = data.web.split('?')[0];
            if(data.fb) data.fb = data.fb.split('?')[0];
            if(data.flickr) data.flickr = data.flickr.split('?')[0];

            dust.render('shop_info', data, function(err, html) {
                $("section#front").hide();
                $("section#shop").fadeIn('fast');
                                
                $("section#shop").find('.info-wrapper')
                    .empty()
                    .html(html);
            });
            
            this.comments.fetch({
                data: {
                    shop_id: this.id
                },
                success: function(a) {
                    console.log('commentsss')
                    console.log(a)
                    $('section#comments').find('ul').empty();
                    view.comments.models.forEach(function(item) {
                        dust.render('comment_item', item.toJSON(), function(err, html) {
                            $('section#comments').find('ul').prepend(html)
                        });
                    });
                }
            });
        },
        
        load: function(id) {
            var view = this;
            this.model = new Shop({ _id: id });
            this.model.fetch({
                success: function(d) {
                    view.id = id;
                    view.render()
                }
            });
        },
        
        postComment: function() {
            var view = this;
            var comment = $('section#comments textarea').val();
            var user_photo = $(".account img").attr('src');
            var by = $(".account p").text();
            this.comments.create({ shop_id: this.id, comment: comment, user_photo: user_photo, by: by }, {
                success: function(a, b) {
                    console.log(a)
                    console.log(b)
                    view.render();
                }
            });
        }
    }));
    
    // Backbone Router for Mappings
    var ShopRouter = Backbone.Router.extend({
        routes: {
            "!/shops/:id": "getShopById",
            "!/c/:cat": "loadCategory"
        },
        getShopById: function(id) {
            ShopView.load(id);
        },
        loadCategory: function(cat) {
            Shops.loadCategory(cat);
        }
    });
    new ShopRouter();
    
}});