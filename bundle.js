"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// import "es6-promise/auto";
// import 'isomorphic-fetch';

//Common class to do API calls.
var FetchNewsData = function () {
    function FetchNewsData(apiKey) {
        _classCallCheck(this, FetchNewsData);

        this.apiKey = apiKey;
    }

    _createClass(FetchNewsData, [{
        key: "fetchData",
        value: function fetchData(url) {
            return fetch("https://newsapi.org/v2/" + url + "&apiKey=" + this.apiKey) //Used ES6 Fetch
            .then(function (resp) {
                return resp.json();
            }) //Used ES6 Template Strings
            .then(function (data) {
                return data;
            });
        }
    }]);

    return FetchNewsData;
}();

//To Load the page with News Data using News API with pure javascript


var DisplayNews = function () {
    function DisplayNews(apiKey) {
        _classCallCheck(this, DisplayNews);

        this.apiKey = apiKey;
        this.newsData = [];
    }

    _createClass(DisplayNews, [{
        key: "createNode",
        value: function createNode(element) {
            return document.createElement(element);
        }
    }, {
        key: "appendElement",
        value: function appendElement(parent, el) {
            return parent.appendChild(el);
        }
    }, {
        key: "displaySources",
        value: function displaySources(apikey) {
            var _this = this;

            var channelsDropdown = document.getElementById("ddlchannelslist");
            var fetchDataObj = new FetchNewsData(apikey);
            fetchDataObj.fetchData("sources?language=en").then(function (data) {
                _this.newsData = data.sources;
                data.sources.map(function (item) {
                    //Used map on arrays
                    var option = _this.createNode('option');
                    option.text = item.name;
                    option.id = option.value = item.id;
                    channelsDropdown.add(option);
                });
                _this.sourcesOnChange();
            });
        }
    }, {
        key: "sourcesOnChange",
        value: function sourcesOnChange() {
            var channelsDropdown = document.getElementById("ddlchannelslist");

            var selectedItemId = channelsDropdown.options[document.getElementById("ddlchannelslist").selectedIndex].value;

            var selectedSourceName = document.getElementById("selectedSourceName");
            var selectedSourceCountry = document.getElementById("selectedSourceCountry");
            var selectedSourcedescription = document.getElementById("selectedSourcedescription");
            var selectedSourceLanguage = document.getElementById("selectedSourceLanguage");
            var selectedSourceUrl = document.getElementById("selectedSourceUrl");
            var filteredItem = this.newsData.filter(function (item) {
                return selectedItemId == item.id;
            })[0];

            var name = filteredItem.name,
                country = filteredItem.country,
                description = filteredItem.description,
                language = filteredItem.language,
                url = filteredItem.url; //Used ES6 object destructuring

            selectedSourceName.innerText = name;
            selectedSourceCountry.innerText = country;
            selectedSourcedescription.innerText = description;
            selectedSourceLanguage.innerText = language;
            selectedSourceUrl.innerText = selectedSourceUrl.href = url;

            document.getElementById("topHeadlines").innerHTML = "";
        }
    }, {
        key: "getTopHeadLines",
        value: function getTopHeadLines(apiKey) {
            var _this2 = this;

            var channelsDropdown = document.getElementById("ddlchannelslist");
            var selectedItemId = channelsDropdown.options[document.getElementById("ddlchannelslist").selectedIndex].value;
            var fetchDataObj = new FetchNewsData(apiKey);
            fetchDataObj.fetchData("top-headlines?sources=" + selectedItemId).then(function (data) {
                data.articles.map(function (item, index) {
                    _this2.appendTopHeadlineNodes(selectedItemId + "-" + index, item);
                });
            });
        }
    }, {
        key: "appendTopHeadlineNodes",
        value: function appendTopHeadlineNodes(sourceID, item) {
            var topHeadlines = document.getElementById("topHeadlines");
            var headlineItem = this.createNode("div");
            headlineItem.setAttribute("Id", sourceID);
            var ItemDetails = "\n        <div><strong>Author :</strong> <label id=\"author-" + sourceID + "\">" + item.author + "</label></div>\n        <div><strong>Title :</strong> <label id=\"title-" + sourceID + "\">" + item.title + "</label></div>\n        <div><strong>Description :</strong> <label id=\"description-" + sourceID + "\">" + item.description + "</label></div>\n        <div><strong>Url :</strong> <a id=\"url-" + sourceID + "\" href=\"" + item.url + "\">" + item.url + "</a></div>\n        <div><strong>UrlToImage :</strong> <a id=\"urlToImage-" + sourceID + "\" href=\"" + item.urlToImage + "\">" + item.urlToImage + "</a></div>\n        <div><strong>Content :</strong> <label id=\"content-" + sourceID + "\">" + item.content + "</label></div>\n        <hr />\n        ";
            headlineItem.innerHTML = ItemDetails;
            topHeadlines.appendChild(headlineItem);
        }
    }]);

    return DisplayNews;
}();

/*Initiate the app */


var apiKey = "c132a5c4ae714d27bdcc6b99f32c3c47";
var newsFeed = document.getElementById('newsFeedData');

var obj = new DisplayNews();
obj.displaySources(apiKey);
var channelsOnchange = function channelsOnchange() {
    return obj.sourcesOnChange();
};
var getTopHeadLines = function getTopHeadLines() {
    return obj.getTopHeadLines(apiKey);
};
