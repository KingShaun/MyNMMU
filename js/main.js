//show loader
var showLoader = function () {
    $('#spinner').css('display', 'block');
}

//hide loader
var hideLoader = function () {
    $('#spinner').css('display', 'none');
}

$(document).ready(function() {
 
 //Title of the blog
 var TITLE = "NMMU News";
 //RSS url
 var RSS = "http://news.nmmu.ac.za/home?rss=nmmu-news";
 //Stores entries
 var entries = [];
 var selectedEntry = "";

 //listen for detail links
 $(".contentLink").live("click", function() {
 //$(".contentLink").on("click", function() {
 selectedEntry = $(this).data("entryid");
 });

 //Listen for main page
 $("#mainPage").live("pageinit", function() {
 //$("#mainPage").on("pageinit", function() {

showLoader();

 //Set the title
 $("h1", this).text(TITLE);

 $.get(RSS, {}, function(res, code) {
 var xml = $(res);
 var items = xml.find("item");
 $.each(items, function(i, v) {
 entry = { 
 title:$(v).find("title").text(), 
 link:$(v).find("link").text(), 
 description:$.trim($(v).find("description").text())
 };
 entries.push(entry); 
 
hideLoader();
 
 });

 //now draw the list
 var s = '';
 $.each(entries, function(i, v) {
 s += '<li><a href="#contentPage" class="contentLink" data-entryid="'+i+'">' + v.title + '</a></li>';
 });
 $("#linksList").append(s);
 $("#linksList").listview("refresh");
 });

 });

 //Listen for the content page to load
 $("#contentPage").live("pageshow", function(prepage) {
 //$("#contentPage").on("pageshow", function(prepage) {
 //Set the title
 $("h1", this).text(entries[selectedEntry].title);
 var contentHTML = "";
 contentHTML += entries[selectedEntry].description;
 contentHTML += '<p/><a href="'+entries[selectedEntry].link + '">Read Entry on Site</a>'; 
 $("#entryText",this).html(contentHTML);
 });

}); 