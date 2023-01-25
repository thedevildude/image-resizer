const form = document.querySelector('#img-form');
const img = document.querySelector('#img');
const outputPath = document.querySelector('#output-path');
const filename = document.querySelector('#filename');
const heightInput = document.querySelector('#height');
const widthInput = document.querySelector('#width');

const loadImage = (e) => {
  const file = e.target.files[0];
  if (!isFileImage(file)) {
    alertError("Please select an image");
    return;
  }

  // Get original dimension
  const image = new Image();
  image.src = URL.createObjectURL(file);
  image.onload = function () {
    widthInput.value = this.width;
    heightInput.value = this.height;
  }

  form.style.display = "block";
  filename.innerText = file.name;
  // eslint-disable-next-line no-undef
  outputPath.innerText = path.join(os.homedir(), "imageresizer");
}

// Send image data to main
const sendImage = (e) => {
  e.preventDefault();

  if (!img.files[0]) {
    alertError("Please upload an image");
    return;
  }
  if (widthInput.value === "" || heightInput.value === "") {
    alertError("Please fill in a height and width");
  }

  const width = widthInput.value;
  const height = heightInput.value;
  const imgPath = img.files[0].path;

  // Send to main using ipcRenderer
  // eslint-disable-next-line no-undef
  ipcRenderer.send("image:resize", {
    imgPath,
    width,
    height
  });

  // Catch the image done event
  // eslint-disable-next-line no-undef
  ipcRenderer.on("image:done", () => {
    alertSuccess(`Image resized to ${widthInput.value} x ${heightInput.value}`)
  });

};

// Make sure file is image
const isFileImage = (file) => {
  const acceptedImageTypes = ["image/gif", "image/png", "image/jpeg", "image/jpg"];
  return file && acceptedImageTypes.includes(file["type"]);
};

const alertError = (message) => {
  // eslint-disable-next-line no-undef
  Toastify.toast({
    text: message,
    duration: 5000,
    close: false,
    style: {
      background: "red",
      color: "white",
      textAlign: "center",
    }
  });
}

const alertSuccess = (message) => {
  // eslint-disable-next-line no-undef
  Toastify.toast({
    text: message,
    duration: 5000,
    close: false,
    style: {
      background: "green",
      color: "white",
      textAlign: "center",
    }
  });
}
img.addEventListener("change", loadImage);
form.addEventListener("submit", sendImage)