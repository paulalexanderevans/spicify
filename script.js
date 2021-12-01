(function () {
    console.log("welcome to Spotify Search", $);

    var useInfiniteScroll = location.search.indexOf("scroll=infinite") > -1;
    console.log(useInfiniteScroll);

    var hasScrolledToBottom;

    var button = $("button");
    button.on("mouseover", function (e) {
        $(e.currentTarget).addClass("highlight");
    });
    button.on("mouseleave", function (e) {
        $(e.currentTarget).removeClass("highlight");
    });

    var user = $("input");
    user.on("mouseover", function (e) {
        $(e.currentTarget).addClass("highlight");
    });
    user.on("mouseleave", function (e) {
        $(e.currentTarget).removeClass("highlight");
    });

    var select = $("select");
    select.on("mouseover", function (e) {
        $(e.currentTarget).addClass("highlight");
    });
    select.on("mouseleave", function (e) {
        $(e.currentTarget).removeClass("highlight");
    });

    var moreButton = $(".more");
    moreButton.on("mouseover", function (e) {
        $(e.currentTarget).addClass("highlight");
    });
    moreButton.on("mouseleave", function (e) {
        $(e.currentTarget).removeClass("highlight");
    });

    var nextUrl;

    button.on("click", function (e) {
        // console.log("someone clicked on the button");
        var userInput = $(".input").val();
        // console.log(userInput);
        var artistOrAlbum = $("select").val();
        // console.log("user data ", userInput, " - ", artistOrAlbum);

        // ajax request

        $.ajax({
            method: "get",
            url: "https://spicedify.herokuapp.com/spotify?scroll=infinite",
            data: {
                query: userInput,
                type: artistOrAlbum,
            },
            success: function (response) {
                // console.log("response ", response);
                response = response.artists || response.albums;
                // console.log("response ", response);

                //results for / no results message
                var resultsForHtml = "";
                // console.log("response items.length ", response.items.length);
                if (response.items.length === 0) {
                    console.log("no results");
                    resultsForHtml += "no results";
                } else {
                    resultsForHtml += 'Results for "' + userInput + '"';
                }
                $(".resultsFor").html(resultsForHtml);
                // $(".resultsFor").html('Results for "' + userInput + '"');

                var resultsHtml = "";
                for (var i = 0; i < response.items.length; i++) {
                    var defaultImage = "media/brokenIcon.jpg";
                    if (response.items[i].images.length === 0) {
                        // console.log("no image");
                    } else {
                        defaultImage = response.items[i].images[0].url;
                        var link = response.items[i].external_urls.spotify;
                        // console.log(link);
                    }

                    resultsHtml +=
                        '<div class="results">' +
                        "<img src=" +
                        defaultImage +
                        ' alt="Artist or album image" width="100px" height="100px">' +
                        "<div>" +
                        '<a href="' +
                        link +
                        '">' +
                        response.items[i].name +
                        "</a>" +
                        "</div>" +
                        "</div>";
                }
                $(".results-container").html(
                    Handlebars.templates.adobo(response)
                );
                var more = response.next;

                if (useInfiniteScroll) {
                    checkScrollPosition();
                }

                if (more === null) {
                    console.log("no more links");
                } else {
                    $(".more").html("More");
                    nextUrl =
                        response.next &&
                        response.next.replace(
                            "api.spotify.com/v1/search",
                            "spicedify.herokuapp.com/spotify"
                        );
                }
            },
        });

        function checkScrollPosition() {
            hasScrolledToBottom =
                $(document).height() - 100 <=
                $(window).height() + $(document).scrollTop();
            if (hasScrolledToBottom) {
                console.log("user scrolled to the bottom");
                //do the same as if the user clicked the more button
                $.ajax({
                    method: "get",
                    url: nextUrl,
                    success: function (response) {
                        response = response.artists || response.albums;
                        var resultsHtml = "";
                        for (var i = 0; i < response.items.length; i++) {
                            var defaultImage = "media/brokenIcon.jpg";
                            if (response.items[i].images.length === 0) {
                                // console.log("no image");
                            } else {
                                defaultImage = response.items[i].images[0].url;
                                var link =
                                    response.items[i].external_urls.spotify;
                            }

                            resultsHtml +=
                                '<div class="results">' +
                                "<img src=" +
                                defaultImage +
                                ' alt="Artist or album image" width="100px" height="100px">' +
                                "<div>" +
                                '<a href="' +
                                link +
                                '">' +
                                response.items[i].name +
                                "</a>" +
                                "</div>" +
                                "</div>";
                        }
                        $(".results-container").append(resultsHtml);
                        var more = response.next;

                        if (more === null) {
                            console.log("no more links");
                        } else {
                            $(".more").html("More");
                            nextUrl =
                                response.next &&
                                response.next.replace(
                                    "api.spotify.com/v1/search",
                                    "spicedify.herokuapp.com/spotify"
                                );
                            checkScrollPosition();
                        }
                    },
                });
            } else {
                setTimeout(checkScrollPosition, 500);
            }
        }
        //
    });
    moreButton.on("click", function (e) {
        $.ajax({
            method: "get",
            url: nextUrl,
            success: function (response) {
                response = response.artists || response.albums;
                var resultsHtml = "";
                for (var i = 0; i < response.items.length; i++) {
                    var defaultImage = "media/brokenIcon.jpg";
                    if (response.items[i].images.length === 0) {
                        // console.log("no image");
                    } else {
                        defaultImage = response.items[i].images[0].url;
                        var link = response.items[i].external_urls.spotify;
                    }

                    resultsHtml +=
                        '<div class="results">' +
                        "<img src=" +
                        defaultImage +
                        ' alt="Artist or album image" width="100px" height="100px">' +
                        "<div>" +
                        '<a href="' +
                        link +
                        '">' +
                        response.items[i].name +
                        "</a>" +
                        "</div>" +
                        "</div>";
                }
                $(".results-container").append(resultsHtml);
                var more = response.next;

                if (more === null) {
                    console.log("no more links");
                } else {
                    $(".more").html("More");
                    nextUrl =
                        response.next &&
                        response.next.replace(
                            "api.spotify.com/v1/search",
                            "spicedify.herokuapp.com/spotify"
                        );
                }
            },
        });
    });
})();

// Page height:
$(document).height();

// Window height:
$(window).height();

// Scroll position:
$(document).scrollTop();

//if the user has scrolled to the bottom this line of code will return true
$(document).height() == $(window).height() + $(document).scrollTop();

//if the user has scrolled to with 100px of the bottom this line of code will return true
$(document).height() - 100 <= $(window).height() + $(document).scrollTop();
