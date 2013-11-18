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

////Change comment

// PhoneGap is ready
//
function onDeviceReady() {

    //Stores news entries
    var NewsEntries = [];
    var SelectedNewsEntry = "";

    //Stores events entries
    var EventsEntries = [];
    var SelectedEventsEntry = "";

    // ############################## News ############################ 
    //NMMU LOGIC: On pageinit, run the RSS get and build the listview
    $(document).on('pageinit', '#PageNews', function () {

        $.mobile.loading('show');

        $.get("http://news.nmmu.ac.za/?rss=nmmu-news", {}, function (res, code) {
            var xml = $(res);
            var items = xml.find("item");
            $.each(items, function (i, v) {
                entry = {
                    title: $(v).find("title").text(),
                    link: $(v).find("link").text(),
                    description: $.trim($(v).find("description").text())
                };
                NewsEntries.push(entry);

                $.mobile.loading('hide');
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
        contentHTML += '<li data-role="list-divider">' + NewsEntries[SelectedNewsEntry].title + '</li>';
        contentHTML += '<li>'
        contentHTML += '<p>' + NewsEntries[SelectedNewsEntry].description + '</p>';
        contentHTML += '</li>'
        $("#NewsEntryText").html(contentHTML);
        $("#NewsEntryText").listview("refresh");

        //Add read story button
        $('#NewsEntryText').append('<a href="#" data-role="button" data-theme="b" class="ReadEntry" data-mini="true">Read entry on site</a>');
        // Enhance new button element
        $('[data-role="button"]').button();

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

        $.mobile.loading('show');

        $.get("http://news.nmmu.ac.za/?rss=NMMU-events", {}, function (res, code) {
            var xml = $(res);
            var items = xml.find("item");
            $.each(items, function (i, v) {
                entry = {
                    title: $(v).find("title").text(),
                    link: $(v).find("link").text(),
                    description: $.trim($(v).find("description").text()),
                    eventdate: $(v).find("pubDate").text()
                };
                EventsEntries.push(entry);

                $.mobile.loading('hide');
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
        contentHTML += '<li data-role="list-divider">' + EventsEntries[SelectedEventsEntry].title + '</li>';
        contentHTML += '<li>'
        contentHTML += '<h2>' + EventsEntries[SelectedEventsEntry].description + '</h2>';
        contentHTML += '<p><strong>Event date:</strong> ' + EventsEntries[SelectedEventsEntry].eventdate + '</p>';
        //contentHTML += '<p><a href="#" class="ReadEntry">Read Entry on Site</a></p>';
        contentHTML += '</li>'
        $("#EventsEntryText").html(contentHTML);
        $("#EventsEntryText").listview("refresh");

        //Add read story button
        $('#EventsEntryText').append('<a href="#" data-role="button" data-theme="b" class="ReadEntry" data-mini="true">Read entry on site</a>');
        // Enhance new button element
        $('[data-role="button"]').button();

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

    // Determine whether to show staff or student menu
    $(document).on('pagebeforeshow', '#PageLoggedInHome', function () {
        //Show student list items
        if (window.localStorage["isStudent"] == "true") {
            $("#ListviewStaff").css('display', 'none');
            $("#ListviewStudents").css('display', 'block');
        }
        else {
            $("#ListviewStaff").css('display', 'block');
            $("#ListviewStudents").css('display', 'none');
        }
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

    // My Module Page
    //NMMU LOGIC: Run the GetMyModules function.
    //We want this running everytime we hit the login page, so pagebeforeshow

    var SelectedModulesEntry = "";

    $(document).on('pageinit', '#PageMyModules', function () {

        var storage = window.localStorage;
        var username = storage["username"];
        var password = storage["password"];
        var isStudent = storage["isStudent"];

        GetMyModules(username, password);
    });

    $(document).on('pagebeforeshow', '#PageMyModules', function () {
        $(document).off('click', '.ModuleContentLink').on('click', '.ModuleContentLink', function (e) {
            SelectedModulesEntry = $(this).data("entryid");
        });
    });

    $(document).on('pagebeforeshow', '#PageMyModulesContent', function () {
        var contentHTML = "";
        var marksHTML = '';

        contentHTML += '<li data-role="list-divider" role="heading">' + MyModulesEntries[SelectedModulesEntry].modulename + '<br />(' + MyModulesEntries[SelectedModulesEntry].modulecode + ')</li>';
        contentHTML += '<li>';
        contentHTML += '<a href="#" class="SharePointLink">SharePoint/Collaboration Site</a>';
        contentHTML += '</li>';

        //Show moodle link if it exists
        if (MyModulesEntries[SelectedModulesEntry].modulemoodle != "0") {
            contentHTML += '<li>';
            contentHTML += '<a href="#" class="MoodleLink">Moodle/Learn Site Site</a>';
            contentHTML += '</li>';
        }

        //Show marks if it exists to students
        if (window.localStorage["isStudent"] == "true") {
            if (MyModulesEntries[SelectedModulesEntry].modulemarks != "0") {
                marksHTML += MyModulesEntries[SelectedModulesEntry].modulemarks;
            }
            //else {
            //    marksHTML += '<li>';
            //    marksHTML += '<p>No marks returned.</p>';
            //    marksHTML += '</li>';
            //}
        }

        //Show staff the email class link
        if (window.localStorage["isStudent"] != "true") {
            contentHTML += '<li>';
            contentHTML += '<a href="mailto:' + MyModulesEntries[SelectedModulesEntry].modulecode + '@nmmu.ac.za">Email class</a>';
            contentHTML += '</li>';
        }

        //Show staff the class list link
        if (window.localStorage["isStudent"] != "true") {
            contentHTML += '<li>';
            //contentHTML += '<a href="#" class="ClassListLink">Class list</a>';
            contentHTML += '<a href="#PageClassList">Class list</a>';
            contentHTML += '</li>';
        }

        $("#ModuleEntryTextListView", this).html(contentHTML);
        $("#ModuleEntryTextListView").listview("refresh");

        $("#UlModuleMarks", this).html(marksHTML);
        $("#UlModuleMarks").listview("refresh");
    });

    $(document).on('pageshow', '#PageMyModulesContent', function () {
        $(document).off('click', '.SharePointLink').on('click', '.SharePointLink', function (e) {
            window.open(MyModulesEntries[SelectedModulesEntry].modulesharepoint, '_blank', 'location=yes');
        });

        if (MyModulesEntries[SelectedModulesEntry].modulemoodle != "0") {
            $(document).off('click', '.MoodleLink').on('click', '.MoodleLink', function (e) {
                window.open(MyModulesEntries[SelectedModulesEntry].modulemoodle, '_blank', 'location=yes');
            });
        }

        //$(document).off('click', '.ClassListLink').on('click', '.ClassListLink', function (e) {
        //    GetClassList(MyModulesEntries[SelectedModulesEntry].modulecode);
        //});
    });

    $(document).on('pagebeforeshow', '#PageClassList', function () {
        GetClassList(MyModulesEntries[SelectedModulesEntry].modulecode);
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

    // ########################## Maps ################################ 
    //NMMU LOGIC: Set campus maps using Google Maps API. 

    $(document).on('pageshow', '#PageNCMap', function (e, data) {
        $('.NMMUMapContent').height(getRealContentHeight());

        var latlngPos = new google.maps.LatLng(-33.998578, 25.672194);
        // Set up options for the Google map
        var myOptions = {
            zoom: 15,
            center: latlngPos,
            mapTypeId: google.maps.MapTypeId.ROADMAP

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
            '<h2 id="firstHeading" class="firstHeading">North Campus</h2>' +
            '<div id="bodyContent">' +
            '<p>NMMU is the largest higher education institution in the Eastern and Southern Cape. ' +
            '</p>' +
            //'<p><a href="http://www.nmmu.ac.za">' +
            //'Visit our web site.</p>' +
            '</div>' +
            '</div>';

        var infowindow = new google.maps.InfoWindow({
            content: contentString,
            maxWidth: 170
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
        $('.NMMUMapContent').height(getRealContentHeight());

        var latlngPos = new google.maps.LatLng(-34.005325, 25.669783);
        // Set up options for the Google map
        var myOptions = {
            zoom: 15,
            center: latlngPos,
            mapTypeId: google.maps.MapTypeId.ROADMAP
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

    $(document).on('pageshow', '#Page2NDMap', function (e, data) {
        $('.NMMUMapContent').height(getRealContentHeight());

        var latlngPos = new google.maps.LatLng(-33.987003, 25.658269);
        // Set up options for the Google map
        var myOptions = {
            zoom: 15,
            center: latlngPos,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        // Define the map
        map = new google.maps.Map(document.getElementById("2nd_map_canvas"), myOptions);
        // Add the marker
        var marker = new google.maps.Marker({
            position: latlngPos,
            map: map,
            title: "NMMU 2nd Avenue Campus"
        });
    });

    $(document).on('pageshow', '#PageBSMap', function (e, data) {
        $('.NMMUMapContent').height(getRealContentHeight());

        var latlngPos = new google.maps.LatLng(-33.964867, 25.617111);
        // Set up options for the Google map
        var myOptions = {
            zoom: 15,
            center: latlngPos,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        // Define the map
        map = new google.maps.Map(document.getElementById("bs_map_canvas"), myOptions);
        // Add the marker
        var marker = new google.maps.Marker({
            position: latlngPos,
            map: map,
            title: "NMMU Bird Street Campus"
        });
    });

    $(document).on('pageshow', '#PageGCMap', function (e, data) {
        $('.NMMUMapContent').height(getRealContentHeight());

        var latlngPos = new google.maps.LatLng(-33.970492, 22.534097);
        // Set up options for the Google map
        var myOptions = {
            zoom: 15,
            center: latlngPos,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        // Define the map
        map = new google.maps.Map(document.getElementById("gc_map_canvas"), myOptions);
        // Add the marker
        var marker = new google.maps.Marker({
            position: latlngPos,
            map: map,
            title: "NMMU George Campus"
        });
    });

    $(document).on('pageshow', '#PageMVMap', function (e, data) {
        $('.NMMUMapContent').height(getRealContentHeight());

        var latlngPos = new google.maps.LatLng(-33.870628, 25.550636);
        // Set up options for the Google map
        var myOptions = {
            zoom: 15,
            center: latlngPos,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        // Define the map
        map = new google.maps.Map(document.getElementById("mv_map_canvas"), myOptions);
        // Add the marker
        var marker = new google.maps.Marker({
            position: latlngPos,
            map: map,
            title: "NMMU Missionvale Campus"
        });
    });

    // ########################## End Maps ############################ 

    // ################### Navigation (Get Directions) #################################

    var map,
        currentPosition,
        directionsDisplay,
        directionsService;

    function initialize(lat, lon) {

        $.mobile.loading('show');

        directionsDisplay = new google.maps.DirectionsRenderer();
        directionsService = new google.maps.DirectionsService();

        currentPosition = new google.maps.LatLng(lat, lon);

        map = new google.maps.Map(document.getElementById('map_canvas'), {
            zoom: 15,
            center: currentPosition,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        });

        directionsDisplay.setMap(map);

        var currentPositionMarker = new google.maps.Marker({
            position: currentPosition,
            map: map,
            title: "Current position"
        });

        var infowindow = new google.maps.InfoWindow();
        google.maps.event.addListener(currentPositionMarker, 'click', function () {
            infowindow.setContent("Current position: latitude: " + lat + " longitude: " + lon);
            infowindow.open(map, currentPositionMarker);
        });

        $.mobile.loading('hide');
    }

    function locError(error) {
        // initialize map with a static predefined latitude, longitude
        alert('code: ' + error.code + '\n' +
                      'message: ' + error.message + '\n');
        initialize(59.3426606750, 18.0736160278);
    }

    function locSuccess(position) {
        initialize(position.coords.latitude, position.coords.longitude);
    }

    function calculateRoute() {

        $.mobile.loading('show');

        //Clear directions
        $('#directions').html('');

        var targetDestination = $("#target-dest").val();
        if (currentPosition && currentPosition != '' && targetDestination && targetDestination != '') {
            var request = {
                origin: currentPosition,
                destination: targetDestination,
                travelMode: google.maps.DirectionsTravelMode["DRIVING"]
            };

            directionsService.route(request, function (response, status) {
                if (status == google.maps.DirectionsStatus.OK) {
                    directionsDisplay.setPanel(document.getElementById("directions"));
                    directionsDisplay.setDirections(response);

                    /*
                        var myRoute = response.routes[0].legs[0];
                        for (var i = 0; i < myRoute.steps.length; i++) {
                            alert(myRoute.steps[i].instructions);
                        }
                    */
                    $("#results").show();
                }
                else {
                    $("#results").hide();
                }
            });
        }
        else {
            $("#results").hide();
        }

        $.mobile.loading('hide');
    }

    $(document).on("pagebeforeshow", "#PageGetDirections", function () {
        //Clear directions
        $('#directions').html('');
        //Get user's location
        navigator.geolocation.getCurrentPosition(locSuccess, locError);
    });

    $(document).on('pageinit', '#PageGetDirections', function () {
        $(document).on('click', '#directions-button', function (e) {
            e.preventDefault();
            calculateRoute();
        });
    });

    //####################### End Navigation (Get Directions) #########################


    //Reverse Geolocate
    function codeLatLng(lat, lon) {

        $.mobile.loading('show');

        var geocoder = new google.maps.Geocoder();

        var input = lat + "," + lon;
        var latlngStr = input.split(',', 2);
        var lat = parseFloat(latlngStr[0]);
        var lng = parseFloat(latlngStr[1]);
        var latlng = new google.maps.LatLng(lat, lng);
        geocoder.geocode({ 'latLng': latlng }, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                if (results[0]) {
                    //$('#DivEmergency').html(results[1].formatted_address);
                    $('#LiWhereAmI').html(results[0].formatted_address);
                } else {
                    alert('No results found');
                }
            } else {
                alert('Geocoder failed due to: ' + status);
            }
        });

        $.mobile.loading('hide');
    }

    function locwhereamiError(error) {
        // initialize map with a static predefined latitude, longitude
        //alert('code: ' + error.code + '\n' +
        //              'message: ' + error.message + '\n');
        //initialize('', '');
        switch (error.code) {
            case error.PERMISSION_DENIED: alert("User denied the request for Geolocation.");
                break;
            case error.POSITION_UNAVAILABLE: alert("Location information is unavailable.");
                break;
            case error.TIMEOUT: alert("The request to get user location timed out.");
                break;
            default: alert("An unknown error occurred.");
                break;
        }
    }

    function locwhereamiSuccess(position) {
        codeLatLng(position.coords.latitude, position.coords.longitude);
    }

    // Emergency Page
    $(document).on('pageinit', '#PageEmergency', function () {
        var IsPhone = $.mobile.media("screen and (min-width: 320px) and (max-device-width : 480px)");
        if (IsPhone) {
            $('.NMMUPhoneNumberTablet').css('display', 'none');
            $('.NMMUPhoneNumber').css('display', 'block');
        }
    });

    $(document).on("pagebeforeshow", "#PageEmergency", function () {
        //Get user's location
        navigator.geolocation.getCurrentPosition(locwhereamiSuccess, locwhereamiError);
    });

    // Adverts List Page


    var SelectedAdvertsEntry = "";

    //NMMU LOGIC: Run the GetTop10Adverts function.
    //We want this running everytime we hit the page, so pagebeforeshow
    $(document).on('pagebeforeshow', '#PageAdverts', function () {
        handleGetAdverts();
    });

    $(document).on('pageshow', '#PageAdverts', function () {
        $(document).off('click', '.AdvertContentLink').on('click', '.AdvertContentLink', function (e) {
            SelectedAdvertsEntry = $(this).data("entryid");
        });
    });

    $(document).on('pagebeforeshow', '#PageAdvertContent', function () {
        var contentHTML = "";
        //contentHTML += '<h3>' + AdvertsEntries[SelectedAdvertsEntry].adsubject + '</h3>';
        //contentHTML += '<p>';
        //contentHTML += '<strong>Submitted by:</strong> ' + AdvertsEntries[SelectedAdvertsEntry].adsubmittedby + '<br />';
        //contentHTML += '<strong>Email:</strong> <a href="mailto:' + AdvertsEntries[SelectedAdvertsEntry].ademail + '?subject=' + AdvertsEntries[SelectedAdvertsEntry].adsubject + '">' + AdvertsEntries[SelectedAdvertsEntry].ademail + '</a><br />';
        //contentHTML += '<strong>Mobile:</strong> <a href="tel:' + AdvertsEntries[SelectedAdvertsEntry].admobile + '">' + AdvertsEntries[SelectedAdvertsEntry].admobile + '</a><br />';
        //contentHTML += '<strong>Date submitted:</strong> ' + AdvertsEntries[SelectedAdvertsEntry].addatecreated + '<br />';
        ////contentHTML += '<strong>Picture ID:</strong> ' + AdvertsEntries[SelectedAdvertsEntry].adpictureid + '<br />';
        //contentHTML += '</p>';
        //contentHTML += '<p>' + AdvertsEntries[SelectedAdvertsEntry].addescription + '</p>';

        ////Show image if it exists
        //if (AdvertsEntries[SelectedAdvertsEntry].adpictureid != -1) {
        //    //contentHTML += '<img style="width:256px; box-shadow: 5px 5px 2px #8d8787; -moz-border-radius: 5px; border-radius: 5px;" alt="Advert Image" src="http://webservices.nmmu.ac.za/mobileapp/GetAdvertImage.ashx?id=' + AdvertsEntries[SelectedAdvertsEntry].adpictureid + '" />';
        //    contentHTML += '<div style="text-align:center">';
        //    contentHTML += '<img class="AdvertImage" alt="Advert Image" src="http://webservices.nmmu.ac.za/mobileapp/GetAdvertImage.ashx?id=' + AdvertsEntries[SelectedAdvertsEntry].adpictureid + '" />';
        //    contentHTML += '</div>';
        //}

        //contentHTML += '<ul data-role="listview" data-inset="true">';
        contentHTML += '<li data-role="list-divider">' + AdvertsEntries[SelectedAdvertsEntry].adsubject + '</li>';
        contentHTML += '<li>';
        contentHTML += '<h2>' + AdvertsEntries[SelectedAdvertsEntry].adsubmittedby + '</h2>';
        contentHTML += '<p><strong>Email:</strong> <a href="mailto:' + AdvertsEntries[SelectedAdvertsEntry].ademail + '?subject=' + AdvertsEntries[SelectedAdvertsEntry].adsubject + '">' + AdvertsEntries[SelectedAdvertsEntry].ademail + '</a></p>';
        contentHTML += '<p><strong>Mobile:</strong> <a href="tel:' + AdvertsEntries[SelectedAdvertsEntry].admobile + '">' + AdvertsEntries[SelectedAdvertsEntry].admobile + '</a></p>';
        contentHTML += '<p><strong>Date submitted:</strong> ' + AdvertsEntries[SelectedAdvertsEntry].addatecreated + '</p><br />';
        contentHTML += '<p>' + AdvertsEntries[SelectedAdvertsEntry].addescription + '</p><br />';

        //Show image if it exists
        if (AdvertsEntries[SelectedAdvertsEntry].adpictureid != -1) {
            //contentHTML += '<img style="width:256px; box-shadow: 5px 5px 2px #8d8787; -moz-border-radius: 5px; border-radius: 5px;" alt="Advert Image" src="http://webservices.nmmu.ac.za/mobileapp/GetAdvertImage.ashx?id=' + AdvertsEntries[SelectedAdvertsEntry].adpictureid + '" />';
            contentHTML += '<p style="text-align:center">';
            contentHTML += '<img class="AdvertImage" alt="Advert Image" src="http://webservices.nmmu.ac.za/mobileapp/GetAdvertImage.ashx?id=' + AdvertsEntries[SelectedAdvertsEntry].adpictureid + '" /><br /><br />';
            contentHTML += '</p>';
        }

        contentHTML += '</li>';
        //contentHTML += '</ul>';


        //contentHTML += AdvertsEntries[SelectedAdvertsEntry].description;
        //$("#AdvertEntryText", this).html(contentHTML);
        $("#AdvertEntryText").html(contentHTML);
        $("#AdvertEntryText").listview("refresh");
    });

    //Advert post
    $(document).on('pageinit', '#PageAdvertPost', function () {
        //$("#FormPostAdvert").on("submit", uploadPhoto);

        // validate signup form on keyup and submit
        $("#FormPostAdvert").validate({

            rules: {
                YourName: "required",
                YourSubject: "required",
                YourDescription: "required",
                YourMobile: {
                    required: true,
                    minlength: 10,
                    maxlength: 13
                },
                YourEmail: {
                    required: true,
                    email: true
                }
            },
            messages: {
                YourName: "Please enter your name",
                YourSubject: "Please enter a subject",
                YourDescription: "Please enter a description",
                YourMobile: {
                    required: "Please enter a phone number",
                    minlength: "Your phone number must consist of at least 10 characters",
                    maxlength: "Your phone number must consist of a maximum of 13 characters"
                },
                YourEmail: "Please enter a valid email address"
            },
            submitHandler: function (form) {
                uploadPicture();
                return false;
            }
        });
    });

    $(document).on('pagebeforeshow', '#PageAdvertPost', function () {

        //Clear all the inputs.
        $("#FormPostAdvert").each(function () {
            this.reset();
        });

        var img = document.getElementById('camera_image');
        img.style.visibility = "hidden";
        img.style.display = "none";

        document.getElementById('camera_status').innerHTML = "";

        GetADDetailsForAdvertPost(window.localStorage["username"], window.localStorage["password"]);
    });

    //Advert search
    //NMMU LOGIC: Set the advert search form's submit to fire the handleAdvertSearch function. 
    $(document).on('pageinit', '#PageAdvertSearch', function () {
        $("#advertSearchForm").on("submit", handleAdvertSearch);

    });

    //Array to store results in
    var SelectedSearchAdvertsEntry = "";

    $(document).on('pagebeforeshow', '#PageAdvertSearch', function () {
        $(document).off('click', '.SearchAdvertContentLink').on('click', '.SearchAdvertContentLink', function (e) {
            SelectedSearchAdvertsEntry = $(this).data("entryid");
        });
    });

    $(document).on('pagebeforeshow', '#PageSearchAdvertContent', function () {
        var contentHTML = "";
        //contentHTML += '<h3>' + SearchAdvertsEntries[SelectedSearchAdvertsEntry].adsubject + '</h3>';
        //contentHTML += '<p>';
        //contentHTML += '<strong>Submitted by:</strong> ' + SearchAdvertsEntries[SelectedSearchAdvertsEntry].adsubmittedby + '<br />';
        //contentHTML += '<strong>Email:</strong> <a href="mailto:' + SearchAdvertsEntries[SelectedSearchAdvertsEntry].ademail + '?subject=' + SearchAdvertsEntries[SelectedSearchAdvertsEntry].adsubject + '">' + SearchAdvertsEntries[SelectedSearchAdvertsEntry].ademail + '</a><br />';
        //contentHTML += '<strong>Mobile:</strong> <a href="tel:' + SearchAdvertsEntries[SelectedSearchAdvertsEntry].admobile + '">' + SearchAdvertsEntries[SelectedSearchAdvertsEntry].admobile + '</a><br />'
        //contentHTML += '<strong>Date submitted:</strong> ' + SearchAdvertsEntries[SelectedSearchAdvertsEntry].addatecreated + '<br />';
        //contentHTML += '</p>';
        //contentHTML += '<p>' + SearchAdvertsEntries[SelectedSearchAdvertsEntry].addescription + '</p>';

        ////Show image if it exists.
        //if (SearchAdvertsEntries[SelectedSearchAdvertsEntry].adpictureid != -1) {
        //    contentHTML += '<div style="text-align:center">';
        //    contentHTML += '<img class="AdvertImage" alt="Advert Image" src="http://webservices.nmmu.ac.za/mobileapp/GetAdvertImage.ashx?id=' + SearchAdvertsEntries[SelectedSearchAdvertsEntry].adpictureid + '" />';
        //    contentHTML += '</div>';
        //}

        //$("#SearchAdvertEntryText", this).html(contentHTML);

        contentHTML += '<li data-role="list-divider">' + SearchAdvertsEntries[SelectedSearchAdvertsEntry].adsubject + '</li>';
        contentHTML += '<li>';
        contentHTML += '<h2>' + SearchAdvertsEntries[SelectedSearchAdvertsEntry].adsubmittedby + '</h2>';
        contentHTML += '<p><strong>Email:</strong> <a href="mailto:' + SearchAdvertsEntries[SelectedSearchAdvertsEntry].ademail + '?subject=' + SearchAdvertsEntries[SelectedSearchAdvertsEntry].adsubject + '">' + SearchAdvertsEntries[SelectedSearchAdvertsEntry].ademail + '</a></p>';
        contentHTML += '<p><strong>Mobile:</strong> <a href="tel:' + SearchAdvertsEntries[SelectedSearchAdvertsEntry].admobile + '">' + SearchAdvertsEntries[SelectedSearchAdvertsEntry].admobile + '</a></p>';
        contentHTML += '<p><strong>Date submitted:</strong> ' + SearchAdvertsEntries[SelectedSearchAdvertsEntry].addatecreated + '</p><br />';
        contentHTML += '<p>' + SearchAdvertsEntries[SelectedSearchAdvertsEntry].addescription + '</p><br />';

        //Show image if it exists
        if (SearchAdvertsEntries[SelectedSearchAdvertsEntry].adpictureid != -1) {
            contentHTML += '<p style="text-align:center">';
            contentHTML += '<img class="AdvertImage" alt="Advert Image" src="http://webservices.nmmu.ac.za/mobileapp/GetAdvertImage.ashx?id=' + SearchAdvertsEntries[SelectedSearchAdvertsEntry].adpictureid + '" /><br /><br />';
            contentHTML += '</p>';
        }

        contentHTML += '</li>';

        $("#SearchAdvertEntryText").html(contentHTML);
        $("#SearchAdvertEntryText").listview("refresh");
    });

    //Array to store results in
    var SelectedEditAdvertsEntry = "";

    //NMMU LOGIC: Run the GetMyAdverts function.
    //We want this running everytime we hit the page, so pagebeforeshow
    $(document).on('pagebeforeshow', '#PageAdvertEdit', function () {
        handleGetMyAdverts();
    });

    $(document).on('pageshow', '#PageAdvertEdit', function () {
        $(document).off('click', '.EditAdvertContentLink').on('click', '.EditAdvertContentLink', function (e) {
            SelectedEditAdvertsEntry = $(this).data("entryid");
        });
    });

    //$(document).on('pagecreate', '#PageEditAdvertContent', function () {
    $(document).on('pagebeforeshow', '#PageEditAdvertContent', function () {
        var contentHTML = "";
        //contentHTML += '<h3>' + EditAdvertsEntries[SelectedEditAdvertsEntry].adsubject + '</h3>';
        //contentHTML += '<p>';
        //contentHTML += '<strong>Submitted by:</strong> ' + EditAdvertsEntries[SelectedEditAdvertsEntry].adsubmittedby + '<br />';
        //contentHTML += '<strong>Email:</strong> <a href="mailto:' + EditAdvertsEntries[SelectedEditAdvertsEntry].ademail + '?subject=' + EditAdvertsEntries[SelectedEditAdvertsEntry].adsubject + '">' + EditAdvertsEntries[SelectedEditAdvertsEntry].ademail + '</a><br />';
        //contentHTML += '<strong>Mobile:</strong> <a href="tel:' + EditAdvertsEntries[SelectedEditAdvertsEntry].admobile + '">' + EditAdvertsEntries[SelectedEditAdvertsEntry].admobile + '</a><br />';
        //contentHTML += '<strong>Date submitted:</strong> ' + EditAdvertsEntries[SelectedEditAdvertsEntry].addatecreated + '<br />';
        //contentHTML += '</p>';
        //contentHTML += '<p>' + EditAdvertsEntries[SelectedEditAdvertsEntry].addescription + '</p>';

        ////Show image if it exists
        //if (EditAdvertsEntries[SelectedEditAdvertsEntry].adpictureid != -1) {
        //    contentHTML += '<div style="text-align:center">';
        //    contentHTML += '<img class="AdvertImage" alt="Advert Image" src="http://webservices.nmmu.ac.za/mobileapp/GetAdvertImage.ashx?id=' + EditAdvertsEntries[SelectedEditAdvertsEntry].adpictureid + '" />';
        //    contentHTML += '</div>';
        //}

        contentHTML += '<li data-role="list-divider">' + EditAdvertsEntries[SelectedEditAdvertsEntry].adsubject + '</li>';
        contentHTML += '<li>';
        contentHTML += '<h2>' + EditAdvertsEntries[SelectedEditAdvertsEntry].adsubmittedby + '</h2>';
        contentHTML += '<p><strong>Email:</strong> <a href="mailto:' + EditAdvertsEntries[SelectedEditAdvertsEntry].ademail + '?subject=' + EditAdvertsEntries[SelectedEditAdvertsEntry].adsubject + '">' + EditAdvertsEntries[SelectedEditAdvertsEntry].ademail + '</a></p>';
        contentHTML += '<p><strong>Mobile:</strong> <a href="tel:' + EditAdvertsEntries[SelectedEditAdvertsEntry].admobile + '">' + EditAdvertsEntries[SelectedEditAdvertsEntry].admobile + '</a></p>';
        contentHTML += '<p><strong>Date submitted:</strong> ' + EditAdvertsEntries[SelectedEditAdvertsEntry].addatecreated + '</p><br />';
        contentHTML += '<p>' + EditAdvertsEntries[SelectedEditAdvertsEntry].addescription + '</p><br />';

        //Show image if it exists
        if (EditAdvertsEntries[SelectedEditAdvertsEntry].adpictureid != -1) {
            contentHTML += '<p style="text-align:center">';
            contentHTML += '<img class="AdvertImage" alt="Advert Image" src="http://webservices.nmmu.ac.za/mobileapp/GetAdvertImage.ashx?id=' + EditAdvertsEntries[SelectedEditAdvertsEntry].adpictureid + '" /><br /><br />';
            contentHTML += '</p>';
        }
        contentHTML += '</li>';

        //$("#EditAdvertEntryText", this).html(contentHTML);

        $("#EditAdvertEntryText").html(contentHTML);
        $("#EditAdvertEntryText").listview("refresh");

        //contentHTML += '<a href="#" data-role="button" data-theme="b" data-icon="delete" onclick="deleteGetMyAdvert(' + EditAdvertsEntries[SelectedEditAdvertsEntry].adid + ', ' + EditAdvertsEntries[SelectedEditAdvertsEntry].adpictureid + ')">Delete this advert</a>';

        // Add a delete button element
        $('#EditAdvertEntryText').append('<a href="#" data-role="button" data-theme="b" data-icon="delete" onclick="deleteGetMyAdvert(' + EditAdvertsEntries[SelectedEditAdvertsEntry].adid + ', ' + EditAdvertsEntries[SelectedEditAdvertsEntry].adpictureid + ')">Delete this advert</a>');
        // Enhance new button element
        $('[data-role="button"]').button();
    });

    //Feedback form
    //NMMU LOGIC: Set the feedback form's submit to fire the handleFeedback function. 
    $(document).on('pageinit', '#PageFeedback', function () {
        //$("#FormFeedback").on("submit", handleFeedback);

        // validate signup form on keyup and submit
        $("#FormFeedback").validate({
        rules: {
                textareaFeedback: "required"
        },
        messages: {
            textareaFeedback: "Please provide your feedback."
        },
        submitHandler: function (form) {
            handleFeedback();
            return false;
        }
    });

    });

    $(document).on('pagebeforeshow', '#PageFeedback', function () {

        //Clear all the inputs.
        $("#FormFeedback").each(function () {
            this.reset();
        });

        GetADDetailsForFeedback(window.localStorage["username"], window.localStorage["password"]);
    });

    //Email Profile Details form
    $(document).on('pageinit', '#PageEmailProfile', function () {

        // validate signup form on keyup and submit
        $("#FormEmailProfile").validate({
            rules: {
                RecipientEmail: "required"
            },
            messages: {
                RecipientEmail: "Please a valid email address."
            },
            submitHandler: function (form) {
                handleSendProfileDetails(window.localStorage["username"]);
                return false;
            }
        });

    });

    $(document).on('pagebeforeshow', '#PageEmailProfile', function () {
        //Clear all the inputs.
        $("#FormEmailProfile").each(function () {
            this.reset();
        });
    });

    //Almanac
    $(document).on('pagebeforeshow', '#PageAlmanac', function () {
        GetAlmanac();
    });

    //Registered assests
    $(document).on('pageinit', '#PageRegisteredAssets', function () {
        GetRegisteredADAssets(window.localStorage["username"]);
    });

    //NMMU Profile
    $(document).on('pageinit', '#PageNMMUID', function () {


        $(".SendContactDetailsLink").on('click', function (event) {
            $.mobile.changePage("#PageEmailProfile");
        });

        if (window.localStorage["isStudent"] == "true") {

            //Hide button
            var sendButton = document.getElementById('SendContactDetailsLink');
            sendButton.style.visibility = "hidden";
            sendButton.style.display = "none";

            GetStudentProfile(window.localStorage["username"], window.localStorage["password"]);
        }
        else {
            GetStaffProfile(window.localStorage["username"]);
        }
    });

    //Leave
    $(document).on('pageinit', '#PageLeaveBalance', function () {
        GetLeaveBalance(window.localStorage["username"]);
    });

    //Resources usage
    $(document).on('pagebeforeshow', '#PageUsage', function () {
        GetUsage(window.localStorage["username"], window.localStorage["isStudent"]);
    });

    //Main page init
    $(document).on('pageinit', function () {

    });

}
//NMMU Written functions:


function init() {
    // Wait for PhoneGap to load
    //
    document.addEventListener("deviceready", onDeviceReady, false);

    delete init;
}

//show loader
var showLoader = function () {
    $('.spinner').css('display', 'block');
}

//hide loader
var hideLoader = function () {
    $('.spinner').css('display', 'none');
}

function refreshPage() {
    $.mobile.changePage('#PageAdverts', {
        allowSamePageTransition: true,
        transition: 'none',
        reloadPage: true
    });
}

//Stores adverts entries
var AdvertsEntries = [];

function handleGetAdverts() {

    $.mobile.loading('show');

    $.ajax({
        type: "POST",
        url: "http://webservices.nmmu.ac.za/mobileapp/Adverts.asmx/GetTop10Adverts",
        contentType: 'application/json',
        //data: '{ Category: "' + category + '" }',
        dataType: "json"
    }).done(function (msg) {

        //Clear the array
        AdvertsEntries.length = 0;

        $.each(msg.d, function (i, v) {

            entry = {
                adsubject: v.Subject,
                adsubmittedby: v.Name,
                ademail: v.EmailAddress,
                admobile: v.Mobile,
                addescription: v.Description,
                addatecreated: v.DateCreated,
                adpictureid: v.PictureID
            };
            AdvertsEntries.push(entry);

            $.mobile.loading('hide');

        });
        //now draw the list
        var s = '';
        s += '<li data-role="list-divider" role="heading">Latest</li>';

        $.each(AdvertsEntries, function (i, v) {
            s += '<li>';
            s += '<a href="#PageAdvertContent" class="AdvertContentLink" data-transition="slide" data-entryid="' + i + '"><p>';
            s += v.adsubject;
            s += '</p></a>';
            s += '</li>';
        });

        $("#AdvertsLatest10ListView").html(s);
        $("#AdvertsLatest10ListView").listview("refresh");

    }).fail(function (msg) {
        navigator.notification.alert("An error has occurred.", function () { });
        //alert("fail:" + msg.d);
    }).always(function () {

    });
}

//Stores adverts entries
var SearchAdvertsEntries = [];

function handleAdvertSearch() {

    var form = $("#advertSearchForm");

    //SearchText
    var st = $("#advertsearchtext", form).val();
    if (st != '') {
        $.mobile.loading('show');
        $.ajax({
            type: "POST",
            url: "http://webservices.nmmu.ac.za/mobileapp/Adverts.asmx/SearchAdverts",
            contentType: 'application/json',
            data: '{ SearchText: "' + st + '" }',
            dataType: "json"
        }).done(function (msg) {

            //Clear the array
            SearchAdvertsEntries.length = 0;

            $.each(msg.d, function (i, v) {

                alert

                entry = {
                    adsubject: v.Subject,
                    adsubmittedby: v.Name,
                    ademail: v.EmailAddress,
                    admobile: v.Mobile,
                    addescription: v.Description,
                    addatecreated: v.DateCreated,
                    adpictureid: v.PictureID
                };
                SearchAdvertsEntries.push(entry);

                $.mobile.loading('hide');

            });
            var s = '';
            s += '<li data-role="list-divider" role="heading">Search results</li>';


            //The webservice will return one record into the array, saying no results found.
            if (SearchAdvertsEntries.length == 1 && SearchAdvertsEntries[0].adsubject == "No results found.") {
                s += '<li>';
                s += '<p>No results returned.</p>';
                s += '</li>';
            }
            else {
                //now draw the list
                $.each(SearchAdvertsEntries, function (i, v) {
                    s += '<li>';
                    s += '<a href="#PageSearchAdvertContent" class="SearchAdvertContentLink" data-transition="slide" data-entryid="' + i + '">';
                    s += '<p>' + v.adsubject + '</p>';
                    s += '</a>';
                    s += '</li>';
                });
            }

            $("#AdvertSearchResultsListView").html(s);
            $("#AdvertSearchResultsListView").listview("refresh");

            //Make results visible
            //$('#DivAdvertsSearchResults').css('display', 'block');
        }).fail(function (msg) {
            navigator.notification.alert("An error has occurred.", function () { });
            //alert("fail:" + msg);
        }).always(function () {

        });

    } else {
        //Thanks Igor!
        //navigator.notification.alert("You must enter a username and password", function () { });
        $.mobile.changePage("#FieldsMessageDialog", { role: "dialog" });
        $("#submitAdvertSearch").removeAttr("disabled");
    }
    return false;
}

//Stores adverts entries
var EditAdvertsEntries = [];

function handleGetMyAdverts() {

    $.mobile.loading('show');

    $.ajax({
        type: "POST",
        url: "http://webservices.nmmu.ac.za/mobileapp/Adverts.asmx/GetMyAdverts",
        contentType: 'application/json',
        data: '{ ADUserName: "' + window.localStorage["username"] + '" }',
        dataType: "json"
    }).done(function (msg) {

        //Clear the array
        EditAdvertsEntries.length = 0;

        $.each(msg.d, function (i, v) {

            entry = {
                adsubject: v.Subject,
                adsubmittedby: v.Name,
                ademail: v.EmailAddress,
                admobile: v.Mobile,
                addescription: v.Description,
                addatecreated: v.DateCreated,
                adpictureid: v.PictureID,
                adid: v.ID
            };
            EditAdvertsEntries.push(entry);

            $.mobile.loading('hide');

        });
        //Store the html in s
        var s = '';
        s += '<li data-role="list-divider" role="heading">My adverts</li>';

        //The webservice will return one record into the array, saying no results found.
        if (EditAdvertsEntries.length == 1 && EditAdvertsEntries[0].adsubject == "No results found.") {
            s += '<li>';
            s += '<p>No adverts were found for your username.</p>';
            s += '</li>';
        }
        else {
            //now draw the list
            $.each(EditAdvertsEntries, function (i, v) {
                s += '<li>';
                s += '<a href="#PageEditAdvertContent" class="EditAdvertContentLink" data-transition="slide" data-entryid="' + i + '">';
                s += '<p>' + v.adsubject + '</p>';
                s += '</a>';
                s += '</li>';
            });
        }

        $("#MyAdvertsListView").html(s);
        $("#MyAdvertsListView").listview("refresh");

    }).fail(function (msg) {
        navigator.notification.alert("An error has occurred.", function () { });
        //alert("fail:" + msg.d);
    }).always(function () {

    });
}

function areYouSure(callback) {
    //Prevent the delete action to fire twice, add unbind
    $("#DeleteConfirmation .sure-do").unbind("click.DeleteConfirmation").on("click.DeleteConfirmation", function () {
        callback();
        $(this).off("click.DeleteConfirmation");
    });
    $.mobile.changePage("#DeleteConfirmation", {reverse: false, changeHash: false});
}

function deleteGetMyAdvert(ID, PictureID) {

    //$.mobile.changePage("#DeleteConfirmation", { role: "dialog" });
    areYouSure(function () {

        //User confirmed, go!

        $.mobile.loading('show'); 

        $.ajax({
            type: "POST",
            url: "http://webservices.nmmu.ac.za/mobileapp/Adverts.asmx/DeleteAdvert",
            contentType: 'application/json',
            data: '{ ID: "' + ID + '", PictureID: "' + PictureID + '" }',
            dataType: "json",
            success: function (result) {
                if (result.d == "Success") {
                    //alert("delete Success");
                    //$("#submitAdvert").removeAttr("disabled");
                    $.mobile.loading('hide');
                    $.mobile.changePage("#PageAdvertEdit", {
                        role: "dialog"
                    });
                }
                else {
                    //alert("delete Error");
                    $.mobile.changePage("#PageError", { role: "dialog" });
                }
            }
        });

        return false;
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
        $.mobile.loading('show');
        $.ajax({
            type: "POST",
            url: "https://webservices.nmmu.ac.za/mobileapp/adauthentication.asmx/IsAuthenticated",
            contentType: 'application/json',
            data: '{ username: "' + u + '", password: "' + p + '" }',
            dataType: "json"
        }).done(function (msg) {



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

            $.mobile.loading('hide');

        }).fail(function (msg) {
            navigator.notification.alert("An error has occurred.", function () { });
            //alert("fail:" + msg);
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

function handleFeedback() {
    var form = $("#FormFeedback");
    //disable the button so we can't resubmit while we wait
    $("#submitFeedback", form).attr("disabled", "disabled");
    var user = $("#NameFeedback", form).val();
    var useremail = $("#EmailFeedback", form).val();
    var feedback = $("#textareaFeedback", form).val();

    $.mobile.loading('show');
    $.ajax({
        type: "POST",
        url: "http://webservices.nmmu.ac.za/mobileapp/Feedback.asmx/SendFeedback",
        contentType: 'application/json',
        data: '{ yourName: "' + user + '", yourEmail: "' + useremail + '", feedback: "' + feedback + '" }',
        dataType: "json",
        success: function (result) {
        if (result.d == "Success") {
            //alert("Success");
            $("#submitFeedback").removeAttr("disabled");
            $.mobile.loading('hide');
            $.mobile.changePage("#FeedbackPostSuccess", {
                role: "dialog"
            });
        }
        else {
            //alert("Error");
            $.mobile.changePage("#PageError", { role: "dialog" });
        }
    }

    });
    return false;
}

function handleSendProfileDetails(username) {
    var form = $("#FormEmailProfile");
    //disable the button so we can't resubmit while we wait
    $("#submitContactDetails", form).attr("disabled", "disabled");

    var recipientEmail = $("#RecipientEmail", form).val();

    $.mobile.loading('show');
    $.ajax({
        type: "POST",
        url: "http://webservices.nmmu.ac.za/mobileapp/EmailContactDetails.asmx/SendEmailContactDetails",
        contentType: 'application/json',
        data: '{ username: "' + username + '", recipientEmail: "' + recipientEmail + '" }',
        dataType: "json",
        success: function (result) {
            if (result.d == "Success") {
                //alert("Success");
                $("#submitContactDetails").removeAttr("disabled");
                $.mobile.loading('hide');
                $.mobile.changePage("#ContactDetailsSentSuccess", {
                    role: "dialog"
                });
            }
            else {
                //alert("Error");
                $.mobile.changePage("#PageError", { role: "dialog" });
            }
        }

    });
    return false;
}

function checkPreAuth() {
    $.mobile.loading('show');
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
    $.mobile.loading('hide');
}

function GetAccountStatus(username, password) {
    $.ajax({
        type: "POST",
        url: "https://webservices.nmmu.ac.za/mobileapp/AccountStatus.asmx/GetAccountStatus",
        contentType: 'application/json',
        data: '{ username: "' + username + '", password: "' + password + '" }',
        dataType: "json"
    }).done(function (msg) {
        $("#DivAccountStatus").html(msg.d.StatusMessage);

    }).fail(function (msg) {
        navigator.notification.alert("An error has occurred.", function () { });
        //alert("fail:" + msg.d);
    }).always(function () {

    });
}

function GetExamResults(username, password) {
    $.ajax({
        type: "POST",
        url: "https://webservices.nmmu.ac.za/mobileapp/ExamResults.asmx/GetExamResults",
        contentType: 'application/json',
        //data: '{ StudentNumber: "' + username + '" }',
        data: '{ username: "' + username + '", password: "' + password + '" }',
        dataType: "json"
    }).done(function (msg) {
        var tablerowsHTML;
        $.each(msg.d, function (i, v) {
            if (v.Subject == "No records returned.") {
                var noResults = document.getElementById('DivNoExamResults');
                noResults.style.visibility = "visible";
                noResults.style.display = "block";
                noResults.innerHTML = "No exam results returned.";
            }
            else if (v.Subject == "Exam results are not currently available.") {
                var noResults = document.getElementById('DivNoExamResults');
                noResults.style.visibility = "visible";
                noResults.style.display = "block";
                noResults.innerHTML = "Exam results are currently unavailable.";
            }
            else {
                tablerowsHTML += "<tr><td>" + v.Subject + "</td><td>" + v.Mark + "</td><td>" + v.Outcome + "</td></tr>";
            }
        });

        $("#ExamResultsRows").html(tablerowsHTML);
        $("#ExamResultsTable").table("refresh");

    }).fail(function (msg) {
        navigator.notification.alert("An error has occurred.", function () { });
        //alert("fail:" + msg);
    }).always(function () {

    });
}

function GetExamTimetable(username, password) {
    $.ajax({
        type: "POST",
        url: "https://webservices.nmmu.ac.za/mobileapp/ExamTimetable.asmx/GetExamTimetable",
        contentType: 'application/json',
        data: '{ username: "' + username + '", password: "' + password + '" }',
        dataType: "json"
    }).done(function (msg) {
        var tablerowsHTML;
        $.each(msg.d, function (i, v) {
            if (v.Subject == "No records returned.") {
                var noResults = document.getElementById('DivNoExamTTResults');
                noResults.style.visibility = "visible";
                noResults.style.display = "block";
                noResults.innerHTML = "No exam timetable returned.";
            }
            else {
                tablerowsHTML += "<tr><td>" + v.Subject + "</td><td>" + v.Subject_Description + "</td><td>" + v.Exam_Date + "</td><td>" + v.Start_Time + "</td></tr>";
            }
        });

        $("#ExamTimetableRows").html(tablerowsHTML);
        $("#ExamTimetableTable").table("refresh");

    }).fail(function (msg) {
        navigator.notification.alert("An error has occurred.", function () { });
        //alert("fail:" + msg);
    }).always(function () {

    });
}

function GetGraduationDetails(username, password) {
    $.ajax({
        type: "POST",
        url: "https://webservices.nmmu.ac.za/mobileapp/GraduationDetails.asmx/GetGraduationDetails",
        contentType: 'application/json',
        data: '{ username: "' + username + '", password: "' + password + '" }',
        dataType: "json"
    }).done(function (msg) {
        $("#DivGraduationDetails").html(msg.d.GraduationMessage);

    }).fail(function (msg) {
        navigator.notification.alert("An error has occurred.", function () { });
        //alert("fail:" + msg);
    }).always(function () {

    });
}

function GetADDetailsForAdvertPost(username, password) {
    var formAdvertPost = $("#FormPostAdvert");
    $.ajax({
        type: "POST",
        url: "https://webservices.nmmu.ac.za/mobileapp/adauthentication.asmx/IsAuthenticated",
        contentType: 'application/json',
        data: '{ username: "' + username + '", password: "' + password + '" }',
        dataType: "json"
    }).done(function (msg) {
        $("#YourName", formAdvertPost).val(msg.d.FullName);
        $("#YourEmail", formAdvertPost).val(msg.d.Email);

    }).fail(function (msg) {
        navigator.notification.alert("An error has occurred.", function () { });
        //alert("fail:" + msg);
    }).always(function () {

    });
}

function GetADDetailsForFeedback(username, password) {
    var formFeedback = $("#FormFeedback");
    $.ajax({
        type: "POST",
        url: "https://webservices.nmmu.ac.za/mobileapp/adauthentication.asmx/IsAuthenticated",
        contentType: 'application/json',
        data: '{ username: "' + username + '", password: "' + password + '" }',
        dataType: "json"
    }).done(function (msg) {
        $("#NameFeedback", formFeedback).val(msg.d.FullName);
        $("#EmailFeedback", formFeedback).val(msg.d.Email);

    }).fail(function (msg) {
        navigator.notification.alert("An error has occurred.", function () { });
        //alert("fail:" + msg);
    }).always(function () {

    });
}

//Stores adverts entries
var MyModulesEntries = [];

function GetMyModules(username, password) {

    $.mobile.loading('show');

    var url = '';

    if (window.localStorage["isStudent"] != "true") {
        url = "https://webservices.nmmu.ac.za/mobileapp/MyModules.asmx/GetStaffModules";
    }
    else {
        url = "https://webservices.nmmu.ac.za/mobileapp/MyModules.asmx/GetMyModules";
    }

    $.ajax({
        type: "POST",
        url: url,
        contentType: 'application/json',
        data: '{ username: "' + username + '", password: "' + password + '" }',
        dataType: "json"
    }).done(function (msg) {
        //Clear the array
        MyModulesEntries.length = 0;

        $.each(msg.d, function (i, v) {

            entry = {
                modulecode: v.SubjectCode,
                modulename: v.SubjectName,
                modulesharepoint: v.LinkSharePoint,
                modulemoodle: v.LinkMoodle,
                modulemarks: v.MarkString
            };
            MyModulesEntries.push(entry);

            $.mobile.loading('hide');

        });
        //now draw the list
        var s = '';
        s += '<li data-role="list-divider" role="heading">Modules</li>';

        //The webservice will return one record into the array, saying no results found.
        if (MyModulesEntries.length == 1 && MyModulesEntries[0].modulename == "No results found.") {
            s += '<li>';
            s += '<p>No modules returned.</p>';
            s += '</li>';
        }
        else {
            //now draw the list
            $.each(MyModulesEntries, function (i, v) {
                s += '<li>';
                s += '<a href="#PageMyModulesContent" class="ModuleContentLink" data-transition="slide" data-entryid="' + i + '">';
                //s += '<p>' + v.modulename + '</p>';
                s += v.modulename;
                s += '</a>';
                s += '</li>';
            });
        }

        $("#MyModulesListView").html(s);
        $("#MyModulesListView").listview("refresh");

    }).fail(function (msg) {
        navigator.notification.alert("An error has occurred.", function () { });
        //alert("fail:" + msg.d);
    }).always(function () {

    });
}

function GetClassList(modulecode) {

    $.ajax({
        type: "POST",
        url: "http://webservices.nmmu.ac.za/mobileapp/MyModules.asmx/GetClassList",
        contentType: 'application/json',
        data: '{ modulecode: "' + modulecode + '" }',
        dataType: "json",
        beforeSend: function () {
            // Here we show the loader
            $.mobile.loading('show');
        },
        //success: function (json) {
        //        //Clear results
        //        $("#DivClassList").html('');
        //        $("#DivClassList").html(json.d);

        //},
        //complete: function () {
        //    // Here we hide the loader because this handler always fires on any failed/success request 
        //    $.mobile.loading('show');
        //}
    //});
    }).done(function (msg) {
        //Clear results
        $("#DivClassList").html('');
        $("#DivClassList").html(msg.d);
    }).fail(function (msg) {
        navigator.notification.alert("An error has occurred.", function () { });
        //alert("fail:" + msg);
    }).always(function () {
        $.mobile.loading('hide');
    });
}

function GetAlmanac() {

    $.ajax({
        type: "POST",
        url: "http://webservices.nmmu.ac.za/mobileapp/Almanac.asmx/GetAlmanac",
        contentType: 'application/json',
        //data: '{ modulecode: "' + modulecode + '" }',
        dataType: "json",
        beforeSend: function () {
            // Here we show the loader
            $.mobile.loading('show');
        },
    }).done(function (msg) {
        //Clear results
        $("#DivAlmanac").html('');
        $("#DivAlmanac").html(msg.d);

        $("#DivAlmanac").listview("refresh");
    }).fail(function (msg) {
        navigator.notification.alert("An error has occurred.", function () { });
        //alert("fail:" + msg);
    }).always(function () {
        $.mobile.loading('hide');
    });
}

function GetRegisteredAssets(username) {

    $.ajax({
        type: "POST",
        url: "http://webservices.nmmu.ac.za/mobileapp/Assets.asmx/GetUserAssets",
        contentType: 'application/json',
        data: '{ username: "' + username + '" }',
        dataType: "json",
        beforeSend: function () {
            // Here we show the loader
            $.mobile.loading('show');
        },
    }).done(function (msg) {
        //Clear results
        $("#UlRegisteredAssets").html('');
        $("#UlRegisteredAssets").html(msg.d);

        $("#UlRegisteredAssets").listview("refresh");
    }).fail(function (msg) {
        navigator.notification.alert("An error has occurred.", function () { });
        //alert("fail:" + msg);
    }).always(function () {
        $.mobile.loading('hide');
    });
}

function GetLeaveBalance(username) {

    $.ajax({
        type: "POST",
        url: "http://webservices.nmmu.ac.za/mobileapp/LeaveBalance.asmx/GetLeaveBalance",
        contentType: 'application/json',
        data: '{ username: "' + username + '" }',
        dataType: "json",
        beforeSend: function () {
            // Here we show the loader
            $.mobile.loading('show');
        },
    }).done(function (msg) {
        //Clear results
        $("#UlLeaveBalance").html('');
        $("#UlLeaveBalance").html(msg.d);

        $("#UlLeaveBalance").listview("refresh");
    }).fail(function (msg) {
        navigator.notification.alert("An error has occurred.", function () { });
        //alert("fail:" + msg);
    }).always(function () {
        $.mobile.loading('hide');
    });
}

function GetUsage(username, isStudent) {

    $.ajax({
        type: "POST",
        url: "http://webservices.nmmu.ac.za/mobileapp/Usage.asmx/GetUsage",
        contentType: 'application/json',
        data: '{ username: "' + username + '", isStudent: "' + isStudent + '" }',
        dataType: "json",
        beforeSend: function () {
            // Here we show the loader
            $.mobile.loading('show');
        },
    }).done(function (msg) {
        //Clear results
        $("#UlUsage").html('');
        $("#UlUsage").html(msg.d);

        $("#UlUsage").listview("refresh");
    }).fail(function (msg) {
        navigator.notification.alert("An error has occurred.", function () { });
        //alert("fail:" + msg);
    }).always(function () {
        $.mobile.loading('hide');
    });
}

//Stores adverts entries
var AssetEntries = [];

function GetRegisteredADAssets(username) {
    //Store the html in s
    var s = '';
    $.ajax({
        type: "POST",
        url: "http://webservices.nmmu.ac.za/mobileapp/Assets.asmx/GetUserADAssets",
        contentType: 'application/json',
        data: '{ username: "' + username + '" }',
        dataType: "json",
        beforeSend: function () {
            // Here we show the loader
            $.mobile.loading('show');
        },
    }).done(function (msg) {

        //Clear the array
        AssetEntries.length = 0;

        $.each(msg.d, function (i, v) {

            entry = {
                assFullName: v.FullName,
                assStaffNumber: v.StaffNumber,
                assAssetDescription: v.AssetDescription,
                assAssetBarcode: v.AssetBarcode
            };
            AssetEntries.push(entry);

            $.mobile.loading('hide');

            if (i == 0) {

                s += '<li style="height:100px;">';
                s += '<img  class="ADImage" alt="User Image" src="http://webservices.nmmu.ac.za/mobileapp/GetADImage.ashx?u=' + window.localStorage["username"] + '" />'
                s += '<h2>'
                s += v.FullName
                s += '</h2>'
                s += '<p>Staff number: ' + v.StaffNumber + '</p>';
            }

        });

        //now draw the list
        $.each(AssetEntries, function (i, v) {
            s += '<li data-role="list-divider">' + v.assAssetDescription + '</li>';
            s += '<li>';
            s += '<p><strong>Barcode:</strong> ' + v.assAssetBarcode + '</p>';
            s += '</li>';
        });

        $("#UlRegisteredAssets").html(s);
        $("#UlRegisteredAssets").listview("refresh");

    }).fail(function (msg) {
        navigator.notification.alert("An error has occurred.", function () { });
        //alert("fail:" + msg);
    }).always(function () {
        $.mobile.loading('hide');
    });
}

//Stores adverts entries
var NMMUIDEntries = [];

function GetStaffProfile(username) {
    //Store the html in s
    var s = '';
    $.ajax({
        type: "POST",
        url: "http://webservices.nmmu.ac.za/mobileapp/NMMUID.asmx/GetNMMUID",
        contentType: 'application/json',
        data: '{ username: "' + username + '" }',
        dataType: "json",
        beforeSend: function () {
            // Here we show the loader
            $.mobile.loading('show');
        },
    }).done(function (msg) {

        ////Clear the array
        //NMMUIDEntries.length = 0;

        $.each(msg.d, function (i, v) {

            entry = {
                assFullName: v.FullName,
                assStaffNumber: v.StaffNumber,
                assEmail: v.Email,
                assTelephone: v.Telephone,
                assOffice: v.Office,
                assJobTitle: v.JobTitle,
                assDepartment: v.Department,
                assManager: v.Manager
            };
            NMMUIDEntries.push(entry);


                s += '<li style="height:100px;">';
                s += '<img  class="ADImage" alt="User Image" src="http://webservices.nmmu.ac.za/mobileapp/GetADImage.ashx?u=' + window.localStorage["username"] + '" />'
                s += '<h2>'
                s += v.FullName
                s += '</h2>'
                s += '<p>Staff number: ' + v.StaffNumber + '</p>';
                s += '</li>'
                s += '<li data-role="list-divider">Details:</li>';
                s += '<li>'
                s += '<p><strong>Job title:</strong> ' + v.JobTitle + '</p>';
                s += '<p><strong>Department:</strong> ' + v.Department + '</p>';
                s += '<p><strong>Telephone:</strong> ' + v.Telephone + '</p>';
                s += '<p><strong>Office:</strong> ' + v.Office + '</p>';
                s += '<p><strong>Email:</strong> ' + v.Email + '</p>';
                s += '<p><strong>Manager:</strong> ' + v.Manager + '</p>';
                s += '</li>'

        });

        $("#UlNMMUID").html(s);
        $("#UlNMMUID").listview("refresh");

    }).fail(function (msg) {
        navigator.notification.alert("An error has occurred.", function () { });
        //alert("fail:" + msg);
    }).always(function () {
        $.mobile.loading('hide');
    });
}

function GetStudentProfile(username) {

    var s = '';
    $.ajax({
        type: "POST",
        url: "http://webservices.nmmu.ac.za/mobileapp/NMMUStudentID.asmx/GetNMMUStudentID",
        contentType: 'application/json',
        data: '{ username: "' + username + '" }',
        dataType: "json"
    }).done(function (msg) {

        $.each(msg.d, function (i, v) {
            s += '<li style="height:100px;">';
            s += '<img  class="ADImage" alt="User Image" src="http://webservices.nmmu.ac.za/mobileapp/GetADImage.ashx?u=' + window.localStorage["username"] + '" />';
            s += '<h2>';
            s += v.Title + ' ' + v.Firstnames + ' ' + v.Surname;
            s += '</h2>';
            s += '<p>Student number: ' + v.StudentNumber + '</p>';
            s += '</li>';
            s += '<li data-role="list-divider">Details:</li>';
            s += '<li>';
            s += '<p><strong>DOB:</strong> ' + v.DOB + '</p>';
            s += '<p><strong>Qualification:</strong> ' + v.Qual_Desc + '</p>';
            s += '<p><strong>Faculty:</strong> ' + v.Faculty_Desc + '</p>';
            s += '<p><strong>Campus:</strong> ' + v.Campus_Desc + '</p>';            
            s += '<p><strong>Academic year:</strong> ' + v.Academicyear + '</p>';
            s += '</li>';
        });

        $("#UlNMMUID").html(s);
        $("#UlNMMUID").listview("refresh");

    }).fail(function (msg) {
        navigator.notification.alert("An error has occurred.", function () { });
        //alert("fail:" + msg);
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

function GetPhotoOnDevice() {

}

//############### test zone ####################


//function win(r) {
//    alert("Sent = " + r.bytesSent);
//    //alert(r.response);
//    //alert(JSON.stringify(r));
//}

//function fail(error) {
//    switch (error.code) {
//        case FileTransferError.FILE_NOT_FOUND_ERR:
//            alert("Photo file not found");
//            break;
//        case FileTransferError.INVALID_URL_ERR:
//            alert("Bad Photo URL");
//            break;
//        case FileTransferError.CONNECTION_ERR:
//            alert("Connection error");
//            break;
//    }

//    alert("An error has occurred: Code = " + error.code);
//}


/**
 * Take picture with camera
 */
function takePicture() {
    navigator.camera.getPicture(
        function (uri) {
            var img = document.getElementById('camera_image');
            img.style.visibility = "visible";
            img.style.display = "block";
            img.src = uri;
            document.getElementById('camera_status').innerHTML = "Success";
        },
        function (e) {
            console.log("Error getting picture: " + e);
            document.getElementById('camera_status').innerHTML = "Error getting picture.";
        },
        { quality: 50, destinationType: navigator.camera.DestinationType.FILE_URI });
};

/**
 * Select picture from library
 */
function selectPicture() {
    $.mobile.loading('show');

    navigator.camera.getPicture(
        function (uri) {
            var img = document.getElementById('camera_image');
            img.style.visibility = "visible";
            img.style.display = "block";
            img.src = uri;
            document.getElementById('camera_status').innerHTML = "Success";
        },
        function (e) {
            //console.log("Error getting picture: " + e);
            //document.getElementById('camera_status').innerHTML = "Error getting picture.";
            var camStatus = document.getElementById('camera_status');
            camStatus.style.visibility = "visible";
            camStatus.style.display = "block";
            camStatus.innerHTML = "Error getting picture."
        },
        { quality: 50, destinationType: navigator.camera.DestinationType.FILE_URI, sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY });

    $.mobile.loading('hide');
};

/**
 * Upload current picture
 */
function uploadPicture() {

    $.mobile.loading('show');

    var form = $("#FormPostAdvert");
    //disable the button so we can't resubmit while we wait
    $("#submitAdvert", form).attr("disabled", "disabled");


    var yourUsername = window.localStorage["username"];
    var yourName = $("#YourName", form).val();
    var yourEmail = $("#YourEmail", form).val();
    var yourMobile = $("#YourMobile", form).val();
    var yourSubject = $("#YourSubject", form).val();
    var yourCategory = $("#AdCategory", form).val();
    var yourDescription = $("#textareaDescription", form).val();

    // Get URI of picture to upload
    var img = document.getElementById('camera_image');
    var imageURI = img.src;

    if (!imageURI || (img.style.display == "none")) {
        //document.getElementById('camera_status').innerHTML = "Take picture or select picture from library first.";
        //return;

        $.ajax({
            type: "POST",
            url: "http://webservices.nmmu.ac.za/mobileapp/FileUpload.ashx",
            // DO NOT SET CONTENT TYPE to json
            // contentType: "application/json; charset=utf-8", 
            // DataType needs to stay, otherwise the response object
            // will be treated as a single string
            //data: '{yourName: "' + yourName + '", yourEmail: "' + yourEmail + '", yourMobile: "' + yourMobile + '", yourSubject: "' + yourSubject + '", yourCategory: "' + yourCategory + '", yourDescription: "' + yourDescription + '" }',
            data: { yourUsername: yourUsername, yourName: yourName, yourEmail: yourEmail, yourMobile: yourMobile, yourSubject: yourSubject, yourCategory: yourCategory, yourDescription: yourDescription },
            dataType: "json",
            success: function (result) {
                if (result.message == "Success") {
                    $("#submitAdvert").removeAttr("disabled");
                    $.mobile.loading('hide');
                    $.mobile.changePage("#AdvertPostSuccess", {
                        role: "dialog", reverse: false,
                        changeHash: false
                    });
                }
                else {
                    $.mobile.changePage("#PageError", { role: "dialog" });
                }
            }
        });

        return false;
    }
        //picture to upload
    else {


        var myfileName;
        window.resolveLocalFileSystemURI(imageURI, function (fileEntry) {
            fileEntry.file(function (fileObj) {

                myfileName = fileObj.fullPath;
                myfileName = myfileName.substr(myfileName.lastIndexOf('/') + 1);

            });
        });

        // Specify transfer options
        var options = new FileUploadOptions();
        options.fileKey = "file";
        //options.fileName = imageURI.substr(imageURI.lastIndexOf('/') + 1);
        options.fileName = myfileName;
        options.mimeType = "image/jpeg";
        options.chunkedMode = false;

        //Rest of the form fields
        var params = new Object();
        params.yourUsername = window.localStorage["username"];
        params.yourName = yourName;
        params.yourEmail = yourEmail;
        params.yourMobile = yourMobile;
        params.yourSubject = yourSubject;
        params.yourCategory = yourCategory;
        params.yourDescription = yourDescription;

        options.params = params;

        // Transfer picture to server
        var ft = new FileTransfer();
        ft.upload(imageURI, encodeURI("http://webservices.nmmu.ac.za/mobileapp/FileUpload.ashx"), function (r) {
            document.getElementById('camera_status').innerHTML = "Upload successful: " + r.bytesSent + " bytes uploaded.";
            $("#submitAdvert").removeAttr("disabled");
            $.mobile.loading('hide');
            $.mobile.changePage("#AdvertPostSuccess", {
                role: "dialog", reverse: false,
                changeHash: false
            });
        }, function (error) {
            document.getElementById('camera_status').innerHTML = "Upload failed: Code = " + error.code;
            $.mobile.loading('hide');
            $.mobile.changePage("#PageError", {
                role: "dialog", reverse: false,
                changeHash: false
            });
        }, options);
    }
}
