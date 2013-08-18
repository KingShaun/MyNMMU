//show loader
var showLoader = function () {
    $('.spinner').css('display', 'block');
}

//hide loader
var hideLoader = function () {
    $('.spinner').css('display', 'none');
}

function checkPreAuth() {
    var form = $("#loginForm");
    showLoader();
    if (window.localStorage["username"] != undefined && window.localStorage["password"] != undefined) {
        $("#username", form).val(window.localStorage["username"]);
        $("#password", form).val(window.localStorage["password"]);
        handleLogin();
    }
    hideLoader();
}


$(document).ready(function () {

    $(".MyJourneyLink").bind('click', function (event) {
        //var ref = window.open('myjourney.nmmu.ac.za', '_blank', 'location=yes')
        var ref = window.open('http://myjourney.nmmu.ac.za', '_blank', 'location=no');
        //ref.addEventListener('loadstart', function () { alert('start: ' + event.url); });
        //ref.addEventListener('loadstop', function () { alert('stop: ' + event.url); });
        //ref.addEventListener('exit', function () { alert(event.type); });
    });

    //Listen for login form submit
    //$("#loginForm").on("submit", handleLogin);

    //Listen for exam results page
    //$("#PageLogin").live("pageinit", function () {

    //}
    $("#PageLogin").on("pageshow", function () {
        $("#loginForm").each(function () {
            this.reset();
        });
        $("#submitButton").removeAttr("disabled");

        checkPreAuth();
    });

    $("#PageLogin").live("pageinit", function () {

        $("#loginForm").on("submit", handleLogin);
        checkPreAuth();

    });
    //$.mobile.changePage("#PageLogin");

    //listen for logout click
    $(".LogoutButton").live("click", function () {
        //$(".LogoutButton").on("click", function() {
        localStorage.clear("username");
        localStorage.clear("password");
        localStorage.clear("isStudent");

        $.mobile.changePage("#PageHome");
    });

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

    //Listen for exam results page
    $("#PageExamResults").live("pageinit", function () {
        var storage = window.localStorage;
        var username = storage["username"];
        var password = storage["password"];
        var isStudent = storage["isStudent"];


        //alert("is student: " + isStudent);

        if (isStudent != "true") {
            $.mobile.changePage("#NotStudentDialog", { role: "dialog" });

            //Display message on page
            $('#NotStudent').html('<p>This page is only available to valid NMMU students.</p>');
            $('#NotStudent').css('display', 'block');

            return;
        }

        GetExamResults(username, password);

        //if (!username) {
        //    //$.mobile.changePage("#LoginFailureDialog", { role: "dialog" });
        //    alert("No!");
        //    return;
        //}

        //GetExamResults(username, password);
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

function GetExamResults(username, password) {
    $.ajax({
        type: "POST",
        url: "http://webservices.nmmu.ac.za/mobileapp/ExamResults.asmx/GetExamResults",
        contentType: 'application/json',
        //data: '{ StudentNumber: "' + username + '" }',
        data: '{ username: "' + username + '", password: "' + password + '" }',
        dataType: "json"
    }).done(function (msg) {
        var tablerowsHTML;
        $.each(msg.d, function (i, v) {
            tablerowsHTML += "<tr><td>" + v.Subject + "</td><td>" + v.Mark + "</td><td>" + v.Outcome + "</td></tr>";
        });

        $("#ExamResultsRows").html(tablerowsHTML);
        $("#ExamResultsTable").table("refresh");

    }).fail(function (msg) {
        alert("fail:" + msg);
    }).always(function () {

    });
}

function handleLogin() {
    var form = $("#loginForm");
    //disable the button so we can't resubmit while we wait
    $("#submitButton", form).attr("disabled", "disabled");
    var u = $("#username", form).val();
    var p = $("#password", form).val();
    //console.log("click");
    if (u != '' && p != '') {
        $.ajax({
            type: "POST",
            url: "http://webservices.nmmu.ac.za/mobileapp/adauthentication.asmx/IsAuthenticated",
            contentType: 'application/json',
            data: '{ username: "' + u + '", password: "' + p + '" }',
            dataType: "json"
        }).done(function (msg) {
            if (msg.d.IsAuthenticated == true) {
                //$("#loginPage").hide();
                //alert("Welcome: " + msg.d.Email);
                //$.mobile.changePage("#PageExamResults");
                //store
                window.localStorage["username"] = u;
                window.localStorage["password"] = p;
                window.localStorage["isStudent"] = msg.d.IsStudent;

                //Go to My NMMU menu page
                $.mobile.changePage("#PageLoggedInHome");
            }
            else {
                ////Reset all the fields
                //$(form).each(function () {
                //    this.reset();
                //});
                $("#submitButton").removeAttr("disabled");
                $.mobile.changePage("#LoginFailureDialog", { role: "dialog" });
            }
        }).fail(function (msg) {
            alert("fail:" + msg);
        }).always(function () {

        });

    } else {
        //Thanks Igor!
        //navigator.notification.alert("You must enter a username and password", function () { });
        $.mobile.changePage("#FieldsMessageDialog", { role: "dialog" });
        $("#submitButton").removeAttr("disabled");
    }
    return false;
}