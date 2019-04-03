
//Common class to do API calls.
class FetchNewsData {
    defaultUrl = 'https://newsapi.org/v2/';
    constructor(apiKey) {
        this.apiKey = apiKey;
    }

    fetchData(url) {
        return fetch(`${this.defaultUrl}/${url}&apiKey=${this.apiKey}`)  //Used ES6 Fetch
            .then((resp) => resp.json()) //Used ES6 Template Strings
            .then((data) => {
                return data;
            });
    }
}

//To Load the page with News Data using News API with pure javascript
class DisplayNews {

    constructor(apiKey) {
        this.apiKey = apiKey;
    }

    newsData = [];
    createNode(element) {
        return document.createElement(element);
    }

    appendElement(parent, el) {
        return parent.appendChild(el);
    }

    displaySources(apikey) {
        const channelsDropdown = document.getElementById("ddlchannelslist");
        const fetchDataObj = new FetchNewsData(apikey)
        fetchDataObj.fetchData("sources?language=en").then((data) => {
            this.newsData = data.sources;
            data.sources.map((item) => { //Used map on arrays
                let option = this.createNode('option');
                option.text = item.name;
                option.id = option.value = item.id;
                channelsDropdown.add(option);
            });
            this.sourcesOnChange();
        });
    }

    sourcesOnChange() {
        const channelsDropdown = document.getElementById("ddlchannelslist");

        const selectedItemId = channelsDropdown.options[document.getElementById("ddlchannelslist").selectedIndex].value;

        const selectedSourceName = document.getElementById("selectedSourceName");
        const selectedSourceCountry = document.getElementById("selectedSourceCountry");
        const selectedSourcedescription = document.getElementById("selectedSourcedescription");
        const selectedSourceLanguage = document.getElementById("selectedSourceLanguage");
        const selectedSourceUrl = document.getElementById("selectedSourceUrl");
        const filteredItem = this.newsData.filter(item => selectedItemId == item.id)[0];

        const { name, country, description, language, url } = filteredItem; //Used ES6 object destructuring

        selectedSourceName.innerText = name;
        selectedSourceCountry.innerText = country;
        selectedSourcedescription.innerText = description;
        selectedSourceLanguage.innerText = language;
        selectedSourceUrl.innerText = selectedSourceUrl.href = url;

        document.getElementById("topHeadlines").innerHTML = "";
    }

    getTopHeadLines(apiKey) {
        const channelsDropdown = document.getElementById("ddlchannelslist");
        const selectedItemId = channelsDropdown.options[document.getElementById("ddlchannelslist").selectedIndex].value;
        const fetchDataObj = new FetchNewsData(apiKey)
        fetchDataObj.fetchData(`top-headlines?sources=${selectedItemId}`).then((data) => {
            data.articles.map((item, index) => {
                this.appendTopHeadlineNodes(`${selectedItemId}-${index}`, item);
            });
        });
    }

    appendTopHeadlineNodes(sourceID, item) {
        const topHeadlines = document.getElementById("topHeadlines");
        const headlineItem = this.createNode("div")
        headlineItem.setAttribute("Id", sourceID);
        const ItemDetails = `
        <div><strong>Author :</strong> <label id="author-${sourceID}">${item.author}</label></div>
        <div><strong>Title :</strong> <label id="title-${sourceID}">${item.title}</label></div>
        <div><strong>Description :</strong> <label id="description-${sourceID}">${item.description}</label></div>
        <div><strong>Url :</strong> <a id="url-${sourceID}" href="${item.url}">${item.url}</a></div>
        <div><strong>UrlToImage :</strong> <a id="urlToImage-${sourceID}" href="${item.urlToImage}">${item.urlToImage}</a></div>
        <div><strong>Content :</strong> <label id="content-${sourceID}">${item.content}</label></div>
        <hr />
        `;
        headlineItem.innerHTML = ItemDetails;
        topHeadlines.appendChild(headlineItem);
    }
}


/*Initiate the app */
const apiKey = "c132a5c4ae714d27bdcc6b99f32c3c47";
const newsFeed = document.getElementById('newsFeedData');

let obj = new DisplayNews();
obj.displaySources(apiKey);
channelsOnchange = () => obj.sourcesOnChange();
getTopHeadLines = () => obj.getTopHeadLines(apiKey);
