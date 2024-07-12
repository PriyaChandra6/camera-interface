const videoElement = document.getElementById('video');
const switchCamButton = document.getElementById('switchCam');
const takePhotoButton = document.getElementById('takePhoto');
const loadingElement = document.getElementById('loading');
const canvas = document.getElementById('canvas');
const capturedImage = document.getElementById('capturedImage');

let currentStream;
let isUsingFrontCamera = true;

function stopCurrentStream() {
    if (currentStream) {
        currentStream.getTracks().forEach(track => track.stop());
    }
}

async function startCamera(facingMode) {
    loadingElement.style.display = 'block'; // Show loading indicator
    stopCurrentStream();

    const constraints = {
        video: {
            facingMode: facingMode
        }
    };

    try {
        currentStream = await navigator.mediaDevices.getUserMedia(constraints);
        videoElement.srcObject = currentStream;
    } catch (error) {
        console.error('Error accessing camera: ', error);
    } finally {
        loadingElement.style.display = 'none'; // Hide loading indicator
    }
}

switchCamButton.addEventListener('click', () => {
    isUsingFrontCamera = !isUsingFrontCamera;
    startCamera(isUsingFrontCamera ? 'user' : 'environment');
});

takePhotoButton.addEventListener('click', () => {
    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;
    const context = canvas.getContext('2d');
    context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
    const imageDataURL = canvas.toDataURL('image/png');
    capturedImage.src = imageDataURL;
    capturedImage.style.display = 'block';
});

// Start with the front camera by default
startCamera('user');
