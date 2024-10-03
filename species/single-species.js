console.log("working yo");

// Get the query string from the URL (the part after ?)
let queryString = window.location.search;

// Create a URLSearchParams object
let urlParams = new URLSearchParams(queryString);

// Get individual parameters by name
let species = urlParams.get('id'); 

console.log(species);  // Output: "johnDoe"

let title = document.querySelector(".species-name");

title.innerHTML = species
