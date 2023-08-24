import { drawImage, expandCanvasForEditing } from "./javascript/canvas.js";
import { readLocalFile, loadImage } from "./javascript/loadImage.js";

const localImage = document.querySelector(".local-image-input");

// Fix mobile browser resizing
window.addEventListener("resize", () => {
  let vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty("--vh", `${vh}px`);
});

localImage.addEventListener("change", async function (event) {
  const imageData = await readLocalFile(event);
  const image = await loadImage(imageData);
  drawImage(image);
  expandCanvasForEditing();
});
