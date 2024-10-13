console.log("working yo");

var Airtable = require('airtable');
var base = new Airtable({ apiKey: 'patxeF8i4nhZP07q7.c5859ae986f18ab5b26786adee657598d3110ae493d921a44062fcc628e873c7' }).base('appkKVYgOCUz8gC1H');

//used for sightings
var reverseGeocoder = new BDCReverseGeocode();

//start building the page
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

  let container = document.querySelector("#info-wrapper");

  let title = document.createElement("h2");
  title.classList.add("callout");
  title.innerHTML = record.fields.name;
  container.append(title);

  //get recent sightings, async
  getRecentSightings(record.fields.slug);

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

function getRecentSightings(slug){
  console.log("slug", slug);
  let sightings = [];
  base('sightings').select({
    // Selecting the first 3 records in Grid view:
    maxRecords: 3,
    view: "Grid view",
    filterByFormula: `{species} = "${slug}"`,

  }).eachPage(function page(records, fetchNextPage) {
    // This function (`page`) will get called for each page of records.

    records.forEach(function(record) {
      sightings.push(record);
      console.log('Retrieved', record.get('timestamp'));
    });

    // To fetch the next page of records, call `fetchNextPage`.
    // If there are more records, `page` will get called again.
    // If there are no more records, `done` will get called.
    fetchNextPage();

  }, function done(err) {
    if (err) { console.error(err); return; }
    // var geocoder = require('geocoder');
    let sightingsWrapper = document.querySelector("#recent-sightings");

    for(let s of sightings){
      let card = document.createElement("div");
      card.classList.add("card");

      let img = document.createElement("img");
      img.src = s.get("base64");
      card.append(img);

      let info = document.createElement("div");
      info.classList.add("sighting-info");
       
      let location = document.createElement("p");
      getLocation(location, s.get("latitude"), s.get("longitude"));
      location.classList.add("location", "callout");
      info.append(location);
    

      let date = document.createElement("p");
      console.log(s.get("timestamp"));
      date.innerHTML = convertTimestamp(s.get("timestamp"));
      info.append(date);

      card.append(info);

      sightingsWrapper.append(card);
    }
    console.log(sightings);
  });
}

function getLocation(el, lat, long){
  reverseGeocoder.getClientLocation({
    latitude: Number(lat),
    longitude: Number(long),
  },function(result) {
    console.log(result);
    // debugger;
    let loc = `${result.city}, ${result.countryCode}`
    el.innerHTML = loc; //set the html to the lcoation 
  });
}


function convertTimestamp(t){
  // console.log(Number(t));
  let timestamp = Number(t);
  let date = new Date(timestamp);
  return date.toLocaleString();
}
