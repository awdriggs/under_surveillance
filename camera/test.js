console.log("working yo")


//get the page-wrapper width
// let pageContain = document.querySelector("#page-container");
// let width = pageContain.offsetWidth;



//set the canvas size to the page width and height
// var canvas = document.getElementById("video_canvas");
// canvas.width = 
// var ctx = canvas.getContext("2d");
// ctx.fillStyle = "blue";
// ctx.fillRect(0, 0, canvas.width, canvas.height);

window.onload = setupCamera();

////from chatgpt, 
async function setupCamera() {
        try {
            // Access the user's camera
            const stream = await navigator.mediaDevices.getUserMedia({
                video: true
            });
            
            const video = document.getElementById('camera');
            video.srcObject = stream;

            // Wait for the video to load its metadata (dimensions)
            video.onloadedmetadata = () => {
                const width = video.videoWidth;
                const height = video.videoHeight;
                
                // Get the canvas element and set its width/height to match the video
                const canvas = document.getElementById('video_canvas');
                canvas.width = width;
                canvas.height = height;

                // Optional: Draw the video frame to the canvas (if desired)
                const context = canvas.getContext('2d');
                context.drawImage(video, 0, 0, width, height);
            };

        } catch (error) {
            console.error("Error accessing the camera: ", error);
        }
    }
