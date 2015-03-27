(function($){

    var getFeeds = function() {
        return $.get('/data/feeds.json');
    };
    
    var setPage = function(feeds) {
        return $.Deferred(function(deferred) {
            
            $('#feeds').html('');
            
            $(feeds).each(function(i, feed) {
                $(
                    '<div class="feed">' +
                        '<div class="field name">'+feed.name+'</div>' +
                        '<div class="field office">'+feed.office+'</div>' +
                    '</div>'
                ).appendTo('#feeds');
            });

            return deferred.resolve();
        });
    };

    var getCachedFeeds = function() {
        return $.Deferred(function (deferred) {
            if('serviceWorker' in navigator) {
                $.ajax('/data/feeds.json',{
                    headers: {'x-use-cache': 'true'}
                }).then(function (data) {
                    deferred.resolve(data);
                });
            } else {
                deferred.reject();
            }
        });
    };

    var showingLiveFeeds = false;

    getFeeds()
        .done(function() {
            $('#offlineIndicator').hide();
            showingLiveFeeds = true;
        })
        .done(setPage);

    getCachedFeeds()
        .done(function(feeds) {
            if(!showingLiveFeeds) {
                return setPage(feeds)
            }
        });


})(window.jQuery);