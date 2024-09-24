console.log("working yo");

 // Classifier Variable
  let classifier;
  // Model URL
  let imageModelURL = 'https://teachablemachine.withgoogle.com/models/61x189yF0N/';
  
  // Video
  let video;
  let flippedVideo;
  // To store the classification
  let label = "";

  // Load the model first
  function preload() {
    classifier = ml5.imageClassifier(imageModelURL + 'model.json');
  }

  function setup() {
    
  container = select('#sketch-wrapper');
  createCanvas(container.width, container.height); //keep hd proportions

    // Create the video
    video = createCapture(VIDEO);
    video.size(width, height);
    // video.hide();

    //flippedVideo = ml5.flipImage(video); //do working with current version of ml5
    flippedVideo = video; //temporary hack
    // Start classifying
    classifyVideo();
  }

  function draw() {
    background(0);
    // ellipse(width/2, height/2, 100, 100);
    // Draw the video
    image(flippedVideo, 0, 0);

    // Draw the label
    fill(255);
    textSize(50);
    text(label, 100, 100);
  }

  // Get a prediction for the current video frame
  function classifyVideo() {
    // flippedVideo = ml5.flipImage(video)
    flippedVideo = video; //temporary hack
    classifier.classify(flippedVideo, gotResult);
    flippedVideo.remove();
  }

  // When we get a result
  function gotResult(results, error) {
    // debugger;
    // If there is an error
    if (error) {
      console.error(error);
      return;
    }
    // // The results are in an array ordered by confidence.
    // console.log(results[0]);
    label = results[0].label;
    // Classifiy again!
    classifyVideo();
  }
