console.log("working yo");

var Airtable = require('airtable');
var base = new Airtable({ apiKey: 'patxeF8i4nhZP07q7.c5859ae986f18ab5b26786adee657598d3110ae493d921a44062fcc628e873c7' }).base('appkKVYgOCUz8gC1H');

// Get the query string from the URL (the part after ?)
let queryString = window.location.search;
// Create a URLSearchParams object
let urlParams = new URLSearchParams(queryString);

// Get individual parameters by name
let id = urlParams.get('id');

// console.log(species);  // Output: "johnDoe"

// let title = document.querySelector(".species-name");
// title.innerHTML = species

//get data from airtable
base('species').find(id, function(err, record) {
  if (err) { console.error(err); return; }

  // console.log('Retrieved', record.id);
  // debugger;

  let container = document.querySelector("#species-wrapper");



  let title = document.createElement("h2");
  title.classList.add("callout");
  title.innerHTML = record.fields.name;
  container.append(title);
  //make a title
  //put the photo in
  //put the desc in

  let img = document.createElement("img");
  img.src = record.fields.canonical_img[0].url;
  container.append(img);

  let desc = document.createElement("p");
  desc.innerHTML = record.fields.description;
  container.append(desc);
});
