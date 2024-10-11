var Airtable = require('airtable');
// Get a base ID for an instance of art gallery example
var base = new Airtable({ apiKey: 'patxeF8i4nhZP07q7.c5859ae986f18ab5b26786adee657598d3110ae493d921a44062fcc628e873c7' }).base('appkKVYgOCUz8gC1H');


base('species').select({
  // Selecting the first 3 records in Grid view:
  // maxRecords: 3,
  view: "Grid view"
}).eachPage(function page(records, fetchNextPage) {
  // This function (`page`) will get called for each page of records.
  
  let container = document.querySelector("#species-wrapper");

  records.forEach(function(record) {
    // console.log('Retrieved', record.get('slug'));
    // debugger;
    // console.log(record.fields.slug, record.id);
    let anchor = document.createElement("a");
    let baseUrl = window.location.origin;
    let param = record.id;
    let targetUrl =`${baseUrl}/species/single.html?id=${encodeURIComponent(param)}`;

    anchor.href = targetUrl;


    let card = document.createElement("section");
    card.classList.add("card");

    let title = document.createElement("h2");
    title.classList.add("callout");
    title.innerHTML = record.fields.name;
    card.append(title);

    let img = document.createElement("img");
    img.src = record.fields.canonical_img[0].url;
    card.append(img);


    anchor.append(card);
    container.append(anchor);
  });

  // To fetch the next page of records, call `fetchNextPage`.
  // If there are more records, `page` will get called again.
  // If there are no more records, `done` will get called.
  fetchNextPage();

}, function done(err) {
  if (err) { console.error(err); return; }
});


