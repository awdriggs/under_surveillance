//event listeners
let captureBtn = document.querySelector("#identify");
captureBtn.addEventListener("click", capture);

// To display predictions, this app has:
// 1. A video that shows a feed from the user's webcam
// 2. A canvas that appears over the video and shows predictions
// When the page loads, a user is asked to give webcam permission.
// After this happens, the model initializes and starts to make predictions
// On the first prediction, an initialiation step happens in detectFrame()
// to prepare the canvas on which predictions are displayed.

//globals
let fm = 'environment';
//this isn't working and freezing the app on the phone

// let flip = document.querySelector('#flip');

// flip.addEventListener("click", () => {
//   console.log("flip");

//   fm = (fm == 'environment') ? 'user' : 'environment';
//   console.log(fm);
//   model = null;
//   canvas_painted = false;
//   webcamInference();
// });

//insert the colors you want, key pairs
var box_data = {
  "box": ["rec8UZJfhC8yCdPbB", "#ff7f11"],
  "bullet":["recxCtRV7ljIxXQ8n", "#ff3f00"],
  "dome": ["reczcJy0asZKXfCJB", "#7DDF64"],
  "doorbell": ["recEuO93A47OVxl46", "#2660A4"],
  "nest": ["recIXNdUhIjiSTLXS", "#0CA4A5"],
  "ptz": ["recLM2NLdaxYnyrB1", "#03CEA4"],
  "turret":["recNESaA2fKPfVrmy", "#FDE74C"],
};

//bump this up to make it  more exact
var user_confidence = 0.6;

// Update the colors in this list to set the bounding box colors
var color_choices = [
  "#C7FC00",
  "#FF00FF",
  "#8622FF",
  "#FE0056",
  "#00FFCE",
  "#FF8000",
  "#00B7EB",
  "#FFFF00",
  "#0E7AFE",
  "#FFABAB",
  "#0000FF",
  "#CCCCCC",
];

var canvas_painted = false;
var canvas = document.getElementById("video_canvas");
var ctx = canvas.getContext("2d");
let captureCoords = {}; //global updated with the capture coordinates
let uploadPause = false;

var model = null;

//this draws the bounding boxes on a canvas
function detectFrame() {
  // On first run, initialize a canvas
  // On all runs, run inference using a video frame
  // For each video frame, draw bounding boxes on the canvas
  if (!model) return requestAnimationFrame(detectFrame);

  model.detect(video).then(function(predictions) {

    if (!canvas_painted) {
      // var video_start = document.getElementById("camera");
      var video_start = document.getElementById("video1");
      canvas.style.width = video_start.width + "px";
      canvas.style.height = video_start.height + "px";
      canvas.width = video_start.width;
      canvas.height = video_start.height;
      // adjust top to margin position of video

      canvas.top = video_start.top;
      canvas.left = video_start.left;
      canvas.style.top = video_start.top + "px";
      canvas.style.left = video_start.left + "px";
      canvas.style.position = "absolute";
      video_start.style.display = "block";
      canvas.style.display = "absolute";
      canvas_painted = true;

      var loading = document.getElementById("loading");
      loading.style.display = "none";
    }
    requestAnimationFrame(detectFrame);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (video) {
      drawBoundingBoxes(predictions, ctx)
    }
  });
}

function drawBoundingBoxes(predictions, ctx) {
  // For each prediction, choose or assign a bounding box color choice,
  // then apply the requisite scaling so bounding boxes appear exactly
  // around a prediction.

  // If you want to do anything with predictions, start from this function.
  // For example, you could display them on the web page, check off items on a list,
  // or store predictions somewhere.

  displayBanner(predictions); //TODO could be refactored in a moved into the conditional below

  //to capture or not to capture?
  if(predictions.length > 0 && predictions[0].confidence > user_confidence && uploadPause != true){
    captureBtn.disabled = false;
  } else {
    captureBtn.disabled = true;
  }


  for (var i = 0; i < predictions.length; i++) {
    var confidence = predictions[i].confidence;

    // console.log(user_confidence)

    if (confidence < user_confidence) {
      continue
    }

    if (predictions[i].class in box_data) {
      ctx.strokeStyle = box_data[predictions[i].class][1];
    } else {
      var color =
        color_choices[Math.floor(Math.random() * color_choices.length)];
      ctx.strokeStyle = color;
      // remove color from choices
      color_choices.splice(color_choices.indexOf(color), 1);

      bounding_box_colors[predictions[i].class] = color;
    }

    var prediction = predictions[i];
    var x = prediction.bbox.x - prediction.bbox.width / 2;
    var y = prediction.bbox.y - prediction.bbox.height / 2;
    var width = prediction.bbox.width;
    var height = prediction.bbox.height;

    //update the capture coordinates
    //only save the first one
    if(i == 0){
      captureCoords.x = x;
      captureCoords.y = y;
      captureCoords.width = width;
      captureCoords.height = height;
      captureCoords.name = prediction.class;
      // console.log(captureCoords);
    }

    ctx.rect(x, y, width, height);


    ctx.fillStyle = "rgba(0, 0, 0, 0)";
    ctx.fill();

    ctx.fillStyle = ctx.strokeStyle;
    ctx.lineWidth = "4";
    ctx.strokeRect(x, y, width, height);
    ctx.font = "25px Arial";
    ctx.fillText(prediction.class + " " + Math.round(confidence * 100) + "%", x, y - 10);

  }
}

function webcamInference() {
  ////remove the old video, this is for the camera flip
  //let oldVideo = document.querySelector("#video1");
  //if(oldVideo) oldVideo.remove();

  // Ask for webcam permissions, then run main application.
  var loading = document.getElementById("loading");
  loading.style.display = "block";


  navigator.mediaDevices
    .getUserMedia({ video: { facingMode: fm } })
    .then(function(stream) {


      video = document.createElement("video");
      video.srcObject = stream;
      video.id = "video1";

      // hide video until the web stream is ready
      video.style.display = "none";
      video.setAttribute("playsinline", "");

      document.getElementById("video_canvas").after(video);

      video.onloadeddata = function() {
        video.play();
      }

      // on full load, set the video height and width
      video.onplay = function() {
        height = video.videoHeight;
        width = video.videoWidth;

        // scale down video by 0.75
        // TODO why?
        // height = height * 0.75;
        // width = width * 0.75;

        width = Math.round(width);
        height = Math.round(height);

        video.setAttribute("width", width);
        video.setAttribute("height", height);
        video.style.width = width + "px";
        video.style.height = height + "px";

        canvas.style.width = width + "px";
        canvas.style.height = height + "px";
        canvas.width = width;
        canvas.height = height;

        document.getElementById("video_canvas").style.display = "block";
        // loading.style.display = "none"; //clear the loading graphic
      };

      ctx.scale(1, 1);

      // Load the Roboflow model using the publishable_key set in index.html
      // and the model name and version set at the top of this file
      roboflow
        .auth({
          publishable_key: "rf_lfbBQ8iQcah2xz35QL5pnw1TDh13",

        })
        .load({
          model: "under_surveillance",
          version: 2,
        })
        .then(function(m) {
          model = m;
          // Images must have confidence > CONFIDENCE_THRESHOLD to be returned by the model
          m.configure({ threshold: 0.1 });
          // Start inference
          detectFrame();
        });
    })
    .catch(function(err) {
      console.log(err);
    });
}

function displayBanner(predictions){

  let banner = document.querySelector(".banner");

  if(predictions.length > 0 && predictions[0].confidence > user_confidence){
    // let param = predictions[0].class;
    let param = box_data[predictions[0].class][0];
    banner.style.visibility = "visible";
    // document.getElementById("abc").href="xyz.php";
    let baseUrl = window.location.origin;
    let anchor = banner.querySelector("a")
    // anchor.href = baseUrl + `/species/${predictions[0].class}.html`;

    let targetUrl =`${baseUrl}/species/single.html?id=${encodeURIComponent(param)}`;
    // console.log(targetUrl);
    // Construct the URL with query parameters
    anchor.href = targetUrl;

    //link to provocation


  } else {
    banner.style.visibility = "hidden";
  }
}

// function changeConfidence () {
//   user_confidence = document.getElementById("confidence").value / 100;
// }

// document.getElementById("confidence").addEventListener("input", changeConfidence);
//starts the web cam
webcamInference();

//save location...
//use airtable
function capture(){
  console.log("capture bro");

  // Create an image url
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  //help of chatgpt here

  const imageData = ctx.getImageData(captureCoords.x, captureCoords.y, captureCoords.width, captureCoords.height)
  // Create a new canvas element to hold the cropped portion
  const croppedCanvas = document.createElement('canvas');
  croppedCanvas.width = captureCoords.width;
  croppedCanvas.height = captureCoords.height;
  const croppedCtx = croppedCanvas.getContext('2d');

  // Put the extracted image data onto the new canvas
  croppedCtx.putImageData(imageData, 0, 0);

  // Step 3: Convert the cropped canvas to an image (base64)
  const croppedImageURL = croppedCanvas.toDataURL(); // Base64 string

  //
  let data = [];
  data.push({"fields": {}});

  // data[0].fields.img = [];
  // data[0].fields.img.push({url: croppedImageURL});
  // let timestamp = Date.now();
  data[0].fields.species = captureCoords.name;
  data[0].fields.base64 = croppedImageURL;

  //get location
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      data[0].fields.timestamp = String(position.timestamp);
      data[0].fields.longitude = String(position.coords.longitude);
      data[0].fields.latitude = String(position.coords.latitude);

      pushToAirtable(data); //has to be here because you are waiting for the data to get generated
    })
  } else {
    //no geolocation? magical kingdom then
    data[0].fields.timestamp = String(Date.now());
    data[0].fields.latitude = "28.385233";
    data[0].fields.longitude =  "-81.563873";

    pushToAirtable(data);
  }


  // debugger;
  // console.log(data);

  // debugger;
}

function pushToAirtable(data){
  //upload to airtable
  var Airtable = require('airtable');
  var base = new Airtable({ apiKey: 'patxeF8i4nhZP07q7.c5859ae986f18ab5b26786adee657598d3110ae493d921a44062fcc628e873c7' }).base('appkKVYgOCUz8gC1H');

  uploadPause = true;

  base('sightings').create(data, function(err, records) {
    uploadPause = false; //allow for more photos

    if (err) {
      console.error(err);
      return;
    }

    records.forEach(function (record) {
      console.log(record.getId());
    });

    document.querySelector("#confirm").classList.remove("hide");

    setTimeout(()=> {
      document.querySelector("#confirm").classList.add("hide");
    }, 3000);
  });

}

