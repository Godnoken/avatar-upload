import { drawImage, expandCanvasForEditing } from "./javascript/canvas.js";
import {
  readLocalFile,
  loadImage,
  isPng,
  is512x512,
} from "./javascript/image.js";
import {
  initText,
  controlsText,
  wrongFormatText,
} from "./javascript/status.js";

const localImage = document.querySelector(".local-image-input");
const status = document.querySelector(".status");

window.onload = () => {
  status.innerText = initText;
};

// Fix mobile browser resizing
window.addEventListener("resize", () => {
  let vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty("--vh", `${vh}px`);
});

localImage.addEventListener("change", async function (event) {
  const imageData = await readLocalFile(event);
  const image = await loadImage(imageData);

  if (isPng() && is512x512()) {
    drawImage(image);
    expandCanvasForEditing();
    status.innerText = controlsText;
  } else {
    status.innerText = wrongFormatText;
  }
});
