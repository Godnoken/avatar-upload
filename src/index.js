import { drawImage, expandCanvasForEditing } from "./javascript/canvas.js";
import {
  readLocalFile,
  loadImage,
  isPng,
  is512x512,
  convertFormat,
} from "./javascript/image.js";
import {
  initText,
  controlsText,
  wrongFormatText,
} from "./javascript/status.js";

const localImage = document.querySelector(".local-image-input");
const status = document.querySelector(".status");
const canvasContainer = document.querySelector(".canvas-container");

window.onload = () => {
  status.innerText = initText;
};

// Fix mobile browser resizing
window.addEventListener("resize", () => {
  let vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty("--vh", `${vh}px`);
});

localImage.addEventListener("change", async function (event) {
  let imageData = await readLocalFile(event);
  let image = await loadImage(imageData);
  [image, imageData] = await convertFormat(image);

  if (isPng(imageData)) {
    if (canvasContainer.style.animationName === "shrinkCanvas") {
      expandCanvasForEditing();
    }
    drawImage(image);

    status.innerText = controlsText;
  } else {
    status.innerText = wrongFormatText;
  }
});
