import { controlsText, successText } from "./status.js";

const avatarCanvas = document.querySelector(".avatar-canvas");
const opacityCanvas = document.querySelector(".opacity-canvas");
const canvasContainer = document.querySelector(".canvas-container");
const avatarContext = avatarCanvas.getContext("2d");
const opacityContext = opacityCanvas.getContext("2d");

const status = document.querySelector(".status");

// Make sure canvases actual size is the same as the CSS canvas (avoids oval circle)
avatarCanvas.width = canvasContainer.offsetWidth;
avatarCanvas.height = canvasContainer.offsetHeight;
opacityCanvas.width = canvasContainer.offsetWidth;
opacityCanvas.height = canvasContainer.offsetHeight;

let circleRadius = canvasContainer.offsetWidth / 4;
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
    status.innerText = controlsText;
  } else {
    shrinkCanvasForResult();
    status.innerText = successText;
  }
});

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
