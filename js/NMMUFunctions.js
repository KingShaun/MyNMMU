////Below is classic Jquery doc ready, use JQuery Mobile (JQM) page wide pageinit instead (or per page inits):
////$(document).ready() { 

////});
////Pageinit event will be executed every time page is about be be loaded and shown for the first time. 
////It will not trigger again unless page is manually refreshed or ajax page loading is turned off. 
////In case you want code to execute every time you visit a page it is better to use pagebeforeshow event. pageinit fire BEFORE pagebeforeshow JQM:

////Page events transition order

////First all events can be found here: http://api.jquerymobile.com/category/events/

////    Lets say we have a page A and a page B, this is a unload/load order:

////page B - event pagebeforecreate

////page B - event pagecreate

////page B - event pageinit

////page A - event pagebeforehide

////page B - event pagebeforeshow

////page A - event pageremove

////page A - event pagehide

////page B - event pagebeforeshow

////page B - event pageshow

////Page wide variables:

//Stores news entries
var NewsEntries = [];
var SelectedNewsEntry = "";

//Stores events entries
var EventsEntries = [];
var SelectedEventsEntry = "";

// ############################## News ############################ 
//NMMU LOGIC: On pageinit, run the RSS get and build the listview
$(document).on('pageinit', '#PageNews', function () {

    showLoader();

    $.get("http://news.nmmu.ac.za/home?rss=nmmu-news", {}, function (res, code) {
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
            //s += '<li><a href="#PageNewsContent" class="NewsContentLink" data-entryid="' + i + '">' + v.title + '</a></li>';
            s += '<li>';
            s += '<a href="#PageNewsContent" class="NewsContentLink" data-entryid="' + i + '">';
            s += '<h3>' + v.title + '</h3>';
            s += '<p>' + v.description + '</p>';
            s += '</a>';
            s += '</li>';
        });
        $("#NewsLinksList").append(s);
        $("#NewsLinksList").listview("refresh");
    });
});

//NMMU LOGIC: List <li>s with the class NewsContentLink have been created in the PageNews pageinit which fires before the pagebeforeshow event, so now we set the click event for them. 
//Reason for .off and then .on (used when going through multiple page in one .html fiel using AJAX:
//jQuery Mobile works in a different way then classic web applications. Depending on how you managed to bind your events each time you visit some page it will bind events over and over. 
//This is not an error, it is simply how jQuery Mobile handles its pages.
$(document).on('pagebeforeshow', '#PageNews', function () {
    $(document).off('click', '.NewsContentLink').on('click', '.NewsContentLink', function (e) {
        SelectedNewsEntry = $(this).data("entryid");
    });
});

//NMMU LOGIC: To ensure the event fire everytime we hit the PageNewsContent page, use pagebeforeshow
$(document).on('pagebeforeshow', '#PageNewsContent', function () {
        var contentHTML = "";
        contentHTML += '<h3>' + NewsEntries[SelectedNewsEntry].title + '</h3>';
        contentHTML += NewsEntries[SelectedNewsEntry].description;
        contentHTML += '<p><a href="#" class="ReadEntry">Read Entry on Site</a></p>';
        $("#NewsEntryText", this).html(contentHTML);
});

//NMMU LOGIC: PageNewsContent page pagebeforeshow created the links with the class ReadEntry, no use pageshow to assign the onclick event to fire InAppBrowser 
$(document).on('pageshow', '#PageNewsContent', function () {
    $(document).off('click', '.ReadEntry').on('click', '.ReadEntry', function (e) {
        window.open(NewsEntries[SelectedNewsEntry].link, '_blank', 'location=yes');
    });
});
// ########################## End News ############################ 

// ############################## Events ############################ 
//NMMU LOGIC: See news
$(document).on('pageinit', '#PageEvents', function () {

    showLoader();

    $.get("http://news.nmmu.ac.za/Home?rss=NMMU-events", {}, function (res, code) {
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
            s += '<li>';
            s += '<a href="#PageEventsContent" class="EventsContentLink" data-entryid="' + i + '">';
            s += '<h3>' + v.title + '</h3>';
            s += '<p>' + v.description + '</p>';
            s += '</a>';
            s += '</li>';
        });
        $("#EventsLinksList").append(s);
        $("#EventsLinksList").listview("refresh");
    });
});

$(document).on('pagebeforeshow', '#PageEvents', function () {
    $(document).off('click', '.EventsContentLink').on('click', '.EventsContentLink', function (e) {
        SelectedEventsEntry = $(this).data("entryid");
    });
});

$(document).on('pagebeforeshow', '#PageEventsContent', function () {
    var contentHTML = "";
    contentHTML += '<h3>' + EventsEntries[SelectedEventsEntry].title + '</h3>';
    contentHTML += EventsEntries[SelectedEventsEntry].description;
    contentHTML += '<p><a href="#" class="ReadEntry">Read Entry on Site</a></p>';
    $("#EventsEntryText", this).html(contentHTML);
});

$(document).on('pageshow', '#PageEventsContent', function () {
    $(document).off('click', '.ReadEntry').on('click', '.ReadEntry', function (e) {
        window.open(EventsEntries[SelectedEventsEntry].link, '_blank', 'location=yes');
    });
});
// ########################## End Events ############################ 

// ########################## Login ################################ 
//NMMU LOGIC: Set the login form's submit to fire the handleLogin function. 
$(document).on('pageinit', '#PageLogin', function () {
    $("#loginForm").on("submit", handleLogin);
});

//NMMU LOGIC: Run the checkPreAuth function to determine whether the user is logged in and that the details are still correct. If so, auto login.
//We want this running everytime we hit the page, so pagebeforeshow
$(document).on('pagebeforeshow', '#PageLogin', function () {
    checkPreAuth();
});

//NMMU LOGIC: Set the  PageLoggedInHome's logout click to clear localStorage. 
$(document).on('pageinit', '#PageLoggedInHome', function () {
    $(".LogoutButton").on("click", function () {
        localStorage.clear("username");
        localStorage.clear("password");
        localStorage.clear("isStudent");

        $.mobile.changePage("#PageHome");
        //$.mobile.activePage.trigger("create");
    });
});
// ########################## End Login ############################ 

// My Account Status Page
//NMMU LOGIC: Run the GetAccountStatus function.
//We want this running everytime we hit the login page, so pagebeforeshow
$(document).on('pagebeforeshow', '#PageAccountStatus', function () {

    var storage = window.localStorage;
    var username = storage["username"];
    var password = storage["password"];
    var isStudent = storage["isStudent"];;

    
    if (isStudent != "true") {
        //Display message on page
        $('#DivAccountStatus').html('<p>This page is only available to current NMMU students.</p>');

        return;
    }

    GetAccountStatus(username, password);
});

// My Exam Results Page
//NMMU LOGIC: Run the GetExamResults function.
//We want this running everytime we hit the page, so pagebeforeshow
$(document).on('pagebeforeshow', '#PageExamResults', function () {

    var storage = window.localStorage;
    var username = storage["username"];
    var password = storage["password"];
    var isStudent = storage["isStudent"];;


    if (isStudent != "true") {
        //Display message on page
        $('#DivExamResults').html('<p>This page is only available to current NMMU students.</p>');

        return;
    }

    GetExamResults(username, password);
});

// My Exam Timetable Page
//NMMU LOGIC: Run the GetExamTimetable function.
//We want this running everytime we hit the page, so pagebeforeshow
$(document).on('pagebeforeshow', '#PageExamTimetable', function () {

    var storage = window.localStorage;
    var username = storage["username"];
    var password = storage["password"];
    var isStudent = storage["isStudent"];;


    if (isStudent != "true") {
        //Display message on page
        $('#DivExamTimetable').html('<p>This page is only available to current NMMU students.</p>');

        return;
    }

    GetExamTimetable(username, password);
});

// My Graduation Details Page
//NMMU LOGIC: Run the GetGraduationDetails function.
//We want this running everytime we hit the login page, so pagebeforeshow
$(document).on('pagebeforeshow', '#PageGraduationDetails', function () {

    var storage = window.localStorage;
    var username = storage["username"];
    var password = storage["password"];
    var isStudent = storage["isStudent"];;


    if (isStudent != "true") {
        //Display message on page
        $('#DivGraduationDetails').html('<p>This page is only available to current NMMU students.</p>');

        return;
    }

    GetGraduationDetails(username, password);
});

// My Journey Page
//NMMU LOGIC: Need to set the InAppBrowser on the link click. We only need to do that once, so we set the event on pageinit.
$(document).on('pageinit', '#PageMyJourney', function () {
    $(".MyJourneyLink").on('click', function (event) {
        var ref = window.open('http://myjourney.nmmu.ac.za', '_blank', 'location=yes');
        //ref.addEventListener('loadstart', function () { alert('start: ' + event.url); });
        //ref.addEventListener('loadstop', function () { alert('stop: ' + event.url); });
        //ref.addEventListener('exit', function () { alert(event.type); });
    });
});

// About us Page
//NMMU LOGIC: On the about us page hide the phone number link if it is not a phone.
$(document).on('pageinit', '#PageAboutUs', function () {
    var IsPhone = $.mobile.media("screen and (min-width: 320px) and (max-device-width : 480px)");
    if (IsPhone) {
        $('.NMMUPhoneNumberTablet').css('display', 'none');
        $('.NMMUPhoneNumber').css('display', 'block');
    }
});

$(document).on('pageshow', '#PageNCMap', function (e, data) {
    $('#DivNCMapContent').height(getRealContentHeight());

    var latlngPos = new google.maps.LatLng(-33.998578, 25.672194);
    // Set up options for the Google map
    var myOptions = {
        zoom: 15,
        center: latlngPos,
        mapTypeId: google.maps.MapTypeId.HYBRID

        //Options: 
        //MapTypeId.ROADMAP displays the default road map view
        //MapTypeId.SATELLITE displays Google Earth satellite images
        //MapTypeId.HYBRID displays a mixture of normal and satellite views
        //MapTypeId.TERRAIN displays a physical map based on terrain information

    };
    // Define the map
    map = new google.maps.Map(document.getElementById("nc_map_canvas"), myOptions);

    var contentString = '<div id="content">' +
        '<div id="siteNotice">' +
        '</div>' +
        '<h1 id="firstHeading" class="firstHeading">North Campus</h1>' +
        '<div id="bodyContent">' +
        '<p><b>Uluru</b>, also referred to as <b>Ayers Rock</b>, is a large ' +
        'sandstone rock formation in the southern part of the ' +
        'Northern Territory, central Australia. It lies 335&#160;km (208&#160;mi) ' +
        'south west of the nearest large town, Alice Springs; 450&#160;km ' +
        '(280&#160;mi) by road. Kata Tjuta and Uluru are the two major ' +
        'features of the Uluru - Kata Tjuta National Park. Uluru is ' +
        'sacred to the Pitjantjatjara and Yankunytjatjara, the ' +
        'Aboriginal people of the area. It has many springs, waterholes, ' +
        'rock caves and ancient paintings. Uluru is listed as a World ' +
        'Heritage Site.</p>' +
        '<p>Attribution: Uluru, <a href="http://en.wikipedia.org/w/index.php?title=Uluru&oldid=297882194">' +
        'http://en.wikipedia.org/w/index.php?title=Uluru</a> ' +
        '(last visited June 22, 2009).</p>' +
        '</div>' +
        '</div>';

    var infowindow = new google.maps.InfoWindow({
        content: contentString,
        maxWidth: 200
    });

    // Add the marker
    var marker = new google.maps.Marker({
        position: latlngPos,
        map: map,
        title: "NMMU North Campus"
    });

    google.maps.event.addListener(marker, 'click', function () {
        infowindow.open(map, marker);
    });
    // To add the marker to the map, call setMap();
    //marker.setMap(map);
});

$(document).on('pageshow', '#PageSCMap', function (e, data) {
    $('#DivSCMapContent').height(getRealContentHeight());

    var latlngPos = new google.maps.LatLng(-34.005325, 25.669783);
    // Set up options for the Google map
    var myOptions = {
        zoom: 15,
        center: latlngPos,
        mapTypeId: google.maps.MapTypeId.HYBRID
    };
    // Define the map
    map = new google.maps.Map(document.getElementById("sc_map_canvas"), myOptions);
    // Add the marker
    var marker = new google.maps.Marker({
        position: latlngPos,
        map: map,
        title: "NMMU South Campus"
    });
});

//Main page init
$(document).on('pageinit', function () {

});


//NMMU Written functions:

//show loader
var showLoader = function () {
    $('.spinner').css('display', 'block');
}

//hide loader
var hideLoader = function () {
    $('.spinner').css('display', 'none');
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

function checkPreAuth() {
    showLoader();
    var form = $("#loginForm");
    if (window.localStorage["username"] != undefined && window.localStorage["password"] != undefined) {

        //Don't show the login form as it will be pre-populated
        form.css('display', 'none');

        $("#username", form).val(window.localStorage["username"]);
        $("#password", form).val(window.localStorage["password"]);
        handleLogin();
    }
    else {
        //First login or logged out. Clear form.
        $("#loginForm").each(function () {
            this.reset();
        });
        $("#submitButton").removeAttr("disabled");

        form.css('display', 'block');
    }
    hideLoader();
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
        alert("fail:" + msg.d);
    }).always(function () {

    });
}

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

function getRealContentHeight() {
    var header = $.mobile.activePage.find("div[data-role='header']:visible");
    var footer = $.mobile.activePage.find("div[data-role='footer']:visible");
    var content = $.mobile.activePage.find("div[data-role='content']:visible:visible");
    var viewport_height = $(window).height();

    var content_height = viewport_height - header.outerHeight() - footer.outerHeight();
    if ((content.outerHeight() - header.outerHeight() - footer.outerHeight()) <= viewport_height) {
        content_height -= (content.outerHeight() - content.height());
    }
    return content_height;
}