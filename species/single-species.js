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

  let subtitle = document.createElement("h2");
  subtitle.innerHTML = "Info";
  container.append(subtitle);

  let info = document.createElement("section");
  info.classList.add("info");


  let type = document.createElement("p");
  type.innerHTML = "<b>Type:</b> " + record.fields.type;
  info.append(type);


  let maker = document.createElement("p");
  maker.innerHTML = "<b>Manufacturers:</b> " + record.fields.manufacturers;
  info.append(maker);

  let adapt = document.createElement("p");
  adapt.innerHTML = "<b>Adaptations:</b> " + record.fields.adaptations;
  info.append(adapt);

  let relate = document.createElement("p");
  relate.innerHTML = "<b>Relationships:</b> " + record.fields.relationships;
  info.append(relate);

  container.append(info);

  let descriptionTitle = document.createElement("h2");
  descriptionTitle.innerHTML = "Description";
  container.append(descriptionTitle);

  let desc = document.createElement("p");
  desc.innerHTML = record.fields.description;
  container.append(desc);
});
