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
    if (window.localStorage["username"] != undefined && window.localStorage["password"] != undefined) {

        //Don't show the login form as it will be pre-populated
        form.css('display', 'none');

        $("#username", form).val(window.localStorage["username"]);
        $("#password", form).val(window.localStorage["password"]);
        handleLogin();
    }
    else {
        form.css('display', 'block');
    }
}


$(document).ready(function () {

    //localStorage.clear("username");
    //localStorage.clear("password");
    //localStorage.clear("isStudent");

    $(".MyJourneyLink").bind('click', function (event) {
        var ref = window.open('http://myjourney.nmmu.ac.za', '_blank', 'location=yes');
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

        hideLoader();
        checkPreAuth();
    });

    //On the about us page hide the phone number link if it is not a phone
    $("#PageAboutUs").on("pageinit", function () {
        //test  a min-width media query
        var IsPhone = $.mobile.media("screen and (min-width: 320px) and (max-device-width : 480px)");
        if (IsPhone) {
            $('.NMMUPhoneNumberTablet').css('display', 'none');
            $('.NMMUPhoneNumber').css('display', 'block');
        }

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
    $("#PageExamResults").on("pageshow", function () {
        var storage = window.localStorage;
        var username = storage["username"];
        var password = storage["password"];
        var isStudent = storage["isStudent"];

        //alert("is student: " + isStudent);

        if (isStudent != "true") {
            //$.mobile.changePage("#NotStudentDialog", { role: "dialog" });

            //Display message on page
            $('.NotStudent').html('<p>This page is only available to current NMMU students.</p>');
            $('.NotStudent').css('display', 'block');

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

    //Listen for exam timetable page
    $("#PageExamTimetable").on("pageshow", function () {
        var storage = window.localStorage;
        var username = storage["username"];
        var password = storage["password"];
        var isStudent = storage["isStudent"];

        if (isStudent != "true") {

            //Display message on page
            $('.NotStudent').html('<p>This page is only available to current NMMU students.</p>');
            $('.NotStudent').css('display', 'block');

            return;
        }

        GetExamTimetable(username, password);
    });

    //Listen for account status page
    $("#PageAccountStatus").on("pageshow", function () {
        var storage = window.localStorage;
        var username = storage["username"];
        var password = storage["password"];
        var isStudent = storage["isStudent"];;

        if (isStudent != "true") {
            //$.mobile.changePage("#NotStudentDialog", { role: "dialog" });

            //Display message on page
            $('.NotStudent').html('<p>This page is only available to current NMMU students.</p>');
            $('.NotStudent').css('display', 'block');

            return;
        }

        GetAccountStatus(username, password);
    });

    //Listen for graduation details page
    $("#PageGraduationDetails").on("pageshow", function () {
        var storage = window.localStorage;
        var username = storage["username"];
        var password = storage["password"];
        var isStudent = storage["isStudent"];;

        if (isStudent != "true") {

            //Display message on page
            $('.NotStudent').html('<p>This page is only available to current NMMU students.</p>');
            $('.NotStudent').css('display', 'block');

            return;
        }

        GetGraduationDetails(username, password);
    });

    //Listen for news main page
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

    //Listen for events main page
    $("#PageEvents").live("pageinit", function () {

        $.get(RSSEvents, {}, function (res, code) {

            showLoader();

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

//});

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

function GetExamTimetable(username, password) {
    $.ajax({
        type: "POST",
        url: "http://webservices.nmmu.ac.za/mobileapp/ExamTimetable.asmx/GetExamTimetable",
        contentType: 'application/json',
        data: '{ username: "' + username + '", password: "' + password + '" }',
        dataType: "json"
    }).done(function (msg) {
        var tablerowsHTML;
        $.each(msg.d, function (i, v) {
            tablerowsHTML += "<tr><td>" + v.Subject + "</td><td>" + v.Subject_Description + "</td><td>" + v.Exam_Date + "</td></tr>";
        });

        $("#ExamTimetableRows").html(tablerowsHTML);
        $("#ExamTimetableTable").table("refresh");

    }).fail(function (msg) {
        alert("fail:" + msg);
    }).always(function () {

    });
}

function GetAccountStatus(username, password) {
    $.ajax({
        type: "POST",
        url: "http://webservices.nmmu.ac.za/mobileapp/AccountStatus.asmx/GetAccountStatus",
        contentType: 'application/json',
        data: '{ username: "' + username + '", password: "' + password + '" }',
        dataType: "json"
    }).done(function (msg) {
        $("#DivAccountStatus").html(msg.d.StatusMessage);

    }).fail(function (msg) {
        alert("fail:" + msg);
    }).always(function () {

    });
}

function GetGraduationDetails(username, password) {
    $.ajax({
        type: "POST",
        url: "http://webservices.nmmu.ac.za/mobileapp/GraduationDetails.asmx/GetGraduationDetails",
        contentType: 'application/json',
        data: '{ username: "' + username + '", password: "' + password + '" }',
        dataType: "json"
    }).done(function (msg) {
        $("#DivGraduationDetails").html(msg.d.GraduationMessage);

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
        //$.mobile.showPageLoadingMsg();
        showLoader();
        $.ajax({
            type: "POST",
            url: "http://webservices.nmmu.ac.za/mobileapp/adauthentication.asmx/IsAuthenticated",
            contentType: 'application/json',
            data: '{ username: "' + u + '", password: "' + p + '" }',
            dataType: "json"
        }).done(function (msg) {

            hideLoader();
            //$.mobile.hidePageLoadingMsg();

            if (msg.d.IsAuthenticated == true) {

                //store
                window.localStorage["username"] = u;
                window.localStorage["password"] = p;
                window.localStorage["isStudent"] = msg.d.IsStudent;

                //Go to My NMMU menu page
                $.mobile.changePage("#PageLoggedInHome");
            }
            else {
                //Login fail and local values exist = Password has changed. Clear local values
                if (window.localStorage["username"] != undefined && window.localStorage["password"] != undefined) {
                    localStorage.clear("username");
                    localStorage.clear("password");
                    localStorage.clear("isStudent");
                }
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