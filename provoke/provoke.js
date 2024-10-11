console.log("working yo");

var Airtable = require('airtable');
var base = new Airtable({ apiKey: 'patxeF8i4nhZP07q7.c5859ae986f18ab5b26786adee657598d3110ae493d921a44062fcc628e873c7' }).base('appkKVYgOCUz8gC1H');

let provocations = [];

base('provocations').select({
  // Selecting the first 3 records in Grid view:
  view: "Grid view"
}).eachPage(function page(records, fetchNextPage) {
  // This function (`page`) will get called for each page of records.

  records.forEach(function(record) {
    console.log('Retrieved', record.get('provocation'));
    provocations.push(record.get('provocation'));
  });

  // To fetch the next page of records, call `fetchNextPage`.
  // If there are more records, `page` will get called again.
  // If there are no more records, `done` will get called.
  fetchNextPage();

}, function done(err) {
  //render a provocation
  show();
  if (err) { console.error(err); return; }
});

function show(){
  let text = document.querySelector("#provocation");
  text.innerHTML = ""; //clear out any old msg
  //select a random provocation
  let randomI = Math.floor(Math.random()*provocations.length);
  let statement = provocations[randomI];
  text.innerHTML = statement;
}

document.querySelector("#new-provoke").addEventListener("click", show);
