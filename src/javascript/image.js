export function readLocalFile(event) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject("Failed to upload image");
    reader.readAsDataURL(event.target.files[0]);
  });
}

export function loadImage(imageData) {
  let image = new Image();
  image.src = imageData;

  return new Promise((resolve, reject) => {
    image.onload = () => resolve(image);
    image.onerror = () => reject("Failed to load image");
  });
}

export function isPng() {
  return true;
}

export function is512x512() {
  return true;
}
