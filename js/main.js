//show loader
var showLoader = function () {
    $('.spinner').css('display', 'block');
}

//hide loader
var hideLoader = function () {
    $('.spinner').css('display', 'none');
}

$(document).ready(function () {

    //Listen for login form submit
    $("#loginForm").on("submit", handleLogin);

    //News RSS url
    var RSSNews = "http://news.nmmu.ac.za/home?rss=nmmu-news";

    //Events RSS url
    var RSSEvents = "http://news.nmmu.ac.za/Home?rss=NMMU-events";


    //Stores news entries
    var NewsEntries = [];
    var SelectedNewsEntry = "";

    //Stores events entries
    var EventsEntries = [];
    var SelectedEventsEntry = "";


    //listen for news detail links
    $(".NewsContentLink").live("click", function () {
        //$(".contentLink").on("click", function() {
        SelectedNewsEntry = $(this).data("entryid");
    });

    //listen for events detail links
    $(".EventsContentLink").live("click", function () {
        //$(".contentLink").on("click", function() {
        SelectedEventsEntry = $(this).data("entryid");
    });

    // ########## News main page ###############
    //Listen for main page
    $("#PageNews").live("pageinit", function () {
        //$("#mainPage").on("pageinit", function() {

        showLoader();

        //Set the title
        //$("h1", this).text(TITLE);

        $.get(RSSNews, {}, function (res, code) {
            var xml = $(res);
            var items = xml.find("item");
            $.each(items, function (i, v) {
                entry = {
                    title: $(v).find("title").text(),
                    link: $(v).find("link").text(),
                    description: $.trim($(v).find("description").text())
                };
                NewsEntries.push(entry);

                hideLoader();

            });

            //now draw the list
            var s = '';
            $.each(NewsEntries, function (i, v) {
                s += '<li><a href="#PageNewsContent" class="NewsContentLink" data-entryid="' + i + '">' + v.title + '</a></li>';
            });
            $("#NewsLinksList").append(s);
            $("#NewsLinksList").listview("refresh");
        });

    });

    // ########## End news main page ###############

    // ########## Events main page ###############
    //Listen for events main page
    $("#PageEvents").live("pageinit", function () {
        //$("#mainPage").on("pageinit", function() {

        showLoader();

        //Set the title
        //$("h1", this).text(TitleEvents);

        $.get(RSSEvents, {}, function (res, code) {
            var xml = $(res);
            var items = xml.find("item");
            $.each(items, function (i, v) {
                entry = {
                    title: $(v).find("title").text(),
                    link: $(v).find("link").text(),
                    description: $.trim($(v).find("description").text())
                };
                EventsEntries.push(entry);

                hideLoader();

            });

            //now draw the list
            var s = '';
            $.each(EventsEntries, function (i, v) {
                s += '<li><a href="#PageEventsContent" class="EventsContentLink" data-entryid="' + i + '">' + v.title + '</a></li>';
            });
            $("#EventsLinksList").append(s);
            $("#EventsLinksList").listview("refresh");
        });

    });
    // ########## End events main page ###############

    //Listen for the news content page to load
    $("#PageNewsContent").live("pageshow", function (prepage) {
        //$("#contentPage").on("pageshow", function(prepage) {
        //Set the title
        //$("h1", this).text(NewsEntries[SelectedNewsEntry].title);
        var contentHTML = "";
        contentHTML += '<p/>' + NewsEntries[SelectedNewsEntry].title + '</a>';
        contentHTML += NewsEntries[SelectedNewsEntry].description;
        contentHTML += '<p/><a href="' + NewsEntries[SelectedNewsEntry].link + '">Read Entry on Site</a>';
        $("#NewsEntryText", this).html(contentHTML);
    });

    //Listen for the events content page to load
    $("#PageEventsContent").live("pageshow", function (prepage) {
        //$("#PageEventsContent").on("pageshow", function(prepage) {
        //Set the title
        //$("h1", this).text(entries[selectedEntry].title);
        var contentHTML = "";
        contentHTML += '<p/>' + EventsEntries[SelectedEventsEntry].title + '</a>';
        contentHTML += EventsEntries[SelectedEventsEntry].description;
        contentHTML += '<p/><a href="' + EventsEntries[SelectedEventsEntry].link + '">Read Entry on Site</a>';
        $("#EventsEntryText", this).html(contentHTML);
    });

});

function handleLogin() {
    var form = $("#loginForm");
    //disable the button so we can't resubmit while we wait
    $("#submitButton", form).attr("disabled", "disabled");
    var u = $("#username", form).val();
    var p = $("#password", form).val();
    console.log("click");
    if (u != '' && p != '') {
        //alert("Username: " + u);
        //$.post("http://www.coldfusionjedi.com/demos/2011/nov/10/service.cfc?method=login&returnformat=json", { username: u, password: p }, function (res) {
        //    if (res == true) {
        //        //store
        //        window.localStorage["username"] = u;
        //        window.localStorage["password"] = p;
        //        $.mobile.changePage("some.html");
        //    } else {
        //        navigator.notification.alert("Your login failed", function () { });
        //    }
        //    $("#submitButton").removeAttr("disabled");
        //}, "json");

        $.ajax({
            type: "POST",
            url: "http://webservices.nmmu.ac.za/mobileapp/adauthentication.asmx/IsAuthenticated",
            //url: "http://nmmu.azurewebsites.net/Login.asmx/Auth",
            contentType: 'application/json',
            data: '{ username: "' + u + '", password: "' + p + '" }',
            dataType: "json"
        }).done(function (msg) {
            if (msg.d.IsAuthenticated == true) {
                //$("#loginPage").hide();
                //alert("Welcome: " + msg.d.FirstName);
                //$.mobile.changePage("#PageExamResults");
                //store
                window.localStorage["username"] = u;
                window.localStorage["password"] = p;

                //Go to My NMMU menu page
                $.mobile.changePage("#PageExamResults");
            }
            else {
                //alert("No!");
                // Dialog present in a multipage document
                $.mobile.changePage("#LoginFailureDialog", { role: "dialog" });
            }
        }).fail(function (msg) {
            alert("fail:" + msg);
        }).always(function () {
            $("#submitButton").removeAttr("disabled");
        });

    } else {
        //Thanks Igor!
        navigator.notification.alert("You must enter a username and password", function () { });
        $("#submitButton").removeAttr("disabled");
    }
    return false;
}