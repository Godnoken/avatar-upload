import { drawImage, expandCanvasForEditing } from "./javascript/canvas.js";
import {
  readLocalFile,
  loadImage,
  convertExpectedFormatAndSize,
  isPng,
  is512x512,
} from "./javascript/image.js";
import {
  initText,
  controlsText,
  wrongFormatText,
  unexpectedError,
} from "./javascript/status.js";

const uploadButton = document.querySelector(".upload-button");
const status = document.querySelector(".status");
const canvasContainer = document.querySelector(".canvas-container");
const convertButton = document.querySelector(".convert-button");

export let image = new Image();
export let isAcceptableImage = false;

window.onload = () => {
  status.innerText = initText;
  changeConvertButtonVisiblity(false);
};

// Fix mobile browser resizing
window.addEventListener("resize", () => {
  let vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty("--vh", `${vh}px`);
});

uploadButton.addEventListener("change", async (event) => {
  let imageData = await readLocalFile(event);
  image = await loadImage(imageData);

  if (isPng(imageData) && is512x512(image)) {
    isAcceptableImage = true;
    if (canvasContainer.style.animationName === "shrinkCanvas") {
      expandCanvasForEditing();
    }
    drawImage(image);
    changeConvertButtonVisiblity(false);

    status.innerText = controlsText;
  } else {
    changeConvertButtonVisiblity(true);

    status.innerText = wrongFormatText;
    isAcceptableImage = false;
  }
});

convertButton.addEventListener("click", async () => {
  let imageData;
  [image, imageData] = await convertExpectedFormatAndSize(image);

  if (isPng(imageData) && is512x512(image)) {
    isAcceptableImage = true;
    if (canvasContainer.style.animationName === "shrinkCanvas") {
      expandCanvasForEditing();
    }
    drawImage(image);
    changeConvertButtonVisiblity(false);

    status.innerText = controlsText;
  } else {
    changeConvertButtonVisiblity(true);

    status.innerText = unexpectedError;
    isAcceptableImage = false;
  }
});

function changeConvertButtonVisiblity(visible) {
  let convertButton = document.querySelector(".convert-button");
  if (visible) {
    convertButton.classList.remove("disabled");
  } else {
    convertButton.classList.add("disabled");
  }
}
