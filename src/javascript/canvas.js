import { controlsText, successText } from "./status.js";
import { image } from "./image.js";

const avatarCanvas = document.querySelector(".avatar-canvas");
const opacityCanvas = document.querySelector(".opacity-canvas");
const temporaryCanvas = document.querySelector(".temporary-canvas");
const canvasContainer = document.querySelector(".canvas-container");
const avatarContext = avatarCanvas.getContext("2d");
const opacityContext = opacityCanvas.getContext("2d");
const temporaryContext = temporaryCanvas.getContext("2d");

const status = document.querySelector(".status");

const avatarSize = {
  width: canvasContainer.offsetWidth,
  height: canvasContainer.offsetHeight,
};

// Make sure canvases HTML and CSS canvas are the same (avoids oval circle)
avatarCanvas.width = canvasContainer.offsetWidth;
avatarCanvas.height = canvasContainer.offsetHeight;
opacityCanvas.width = canvasContainer.offsetWidth;
opacityCanvas.height = canvasContainer.offsetHeight;
temporaryCanvas.width = canvasContainer.offsetWidth;
temporaryCanvas.height = canvasContainer.offsetHeight;

// Make sure users can not choose dimensions smaller than the minimum size of the avatar
let circleRadius = Math.max(
  avatarSize.width / 4,
  canvasContainer.offsetWidth / 10
);
let lastX = opacityCanvas.width / 2;
let lastY = opacityCanvas.height / 2;

opacityCanvas.addEventListener("mousemove", (event) => {
  if (canvasContainer.style.animationName === "expandCanvas") {
    revealImage(event);
  }
});

canvasContainer.addEventListener("click", () => {
  if (canvasContainer.style.animationName === "shrinkCanvas") {
    expandCanvasForEditing();
    drawImage(image);
    status.innerText = controlsText;
  } else {
    shrinkCanvasForResult();
    clipImage();
    status.innerText = successText;
  }
});

// Copies user's chosen image dimensions and draws it out on the canvas
function clipImage() {
  let imageData = avatarContext.getImageData(
    lastX - circleRadius,
    lastY - circleRadius,
    circleRadius * 2,
    circleRadius * 2
  );

  avatarContext.clearRect(0, 0, avatarCanvas.width, avatarCanvas.height);

  temporaryContext.putImageData(imageData, 0, 0);

  avatarContext.drawImage(temporaryCanvas, 0, 0, 400, 400);

  temporaryContext.clearRect(
    0,
    0,
    temporaryCanvas.width,
    temporaryCanvas.height
  );
}

function revealImage(event) {
  const rect = opacityCanvas.getBoundingClientRect();
  const x =
    ((event.clientX - rect.left) / (rect.right - rect.left)) *
    opacityCanvas.width;
  const y =
    ((event.clientY - rect.top) / (rect.bottom - rect.top)) *
    opacityCanvas.height;

  // Make sure we only update the y or x pos as long as we are inside the boundaries of the image
  if (y + circleRadius < opacityCanvas.height && y - circleRadius > 0) {
    lastY = y;
  }
  if (x + circleRadius < opacityCanvas.width && x - circleRadius > 0) {
    lastX = x;
  }

  opacityContext.clearRect(0, 0, opacityCanvas.width, opacityCanvas.height);

  // Draws a dark transparent shadow outside of the circle
  const gradient = opacityContext.createRadialGradient(
    lastX,
    lastY,
    circleRadius,
    lastX,
    lastY,
    circleRadius + 1000 // Adjust the shadow size
  );
  gradient.addColorStop(0, "rgba(0, 0, 0, 0.8)");
  gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
  opacityContext.globalCompositeOperation = "source-over";
  opacityContext.fillStyle = gradient;
  opacityContext.fillRect(0, 0, opacityCanvas.width, opacityCanvas.height);

  // Reveals image in a circle around the mouse when hovering the image
  opacityContext.globalCompositeOperation = "destination-out";
  opacityContext.beginPath();
  opacityContext.arc(lastX, lastY, circleRadius, 0, 2 * Math.PI);
  opacityContext.fill();
}

export function drawImage(image) {
  avatarContext.clearRect(0, 0, avatarCanvas.width, avatarCanvas.height);
  avatarContext.drawImage(image, 0, 0, avatarCanvas.width, avatarCanvas.height);
}

export function expandCanvasForEditing() {
  canvasContainer.style.animation = "";
  canvasContainer.offsetHeight;
  canvasContainer.style.animation = "expandCanvas 0.5s forwards ease-in-out";
  avatarCanvas.style.animation = "";
  avatarCanvas.offsetHeight;
  avatarCanvas.style.animation = "expandCanvas 0.5s forwards ease-in-out";
  opacityCanvas.style.visibility = "visible";
}

export function shrinkCanvasForResult() {
  if (canvasContainer.style.animationName === "expandCanvas") {
    canvasContainer.style.animation = "";
    canvasContainer.offsetHeight;
    canvasContainer.style.animation = "shrinkCanvas 0.5s forwards ease-in-out";
    avatarCanvas.style.animation = "";
    avatarCanvas.offsetHeight;
    avatarCanvas.style.animation = "shrinkCanvas 0.5s forwards ease-in-out";
    opacityCanvas.style.visibility = "hidden";
  }
}
