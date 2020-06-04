// Style the buttons
// Refactor the code - check
// set g rating - check
// Make a demo html file
// Present on demo / live google
// turn on / off
// cache some of the next gifs - check
// summarize technical challenges

const API_KEY = "EvYizmjo014uXrSegPAF4upg6cGGG4Gf"; // bad practice, but we're in dev and giphy isn't that secure
const DEBOUNCE_TIME = 1500;

const baseURL = "https://api.giphy.com/v1/gifs/search";

let index = 0;
let gifResponse;

let preloadedImages = [];

// caches the next number (default 5) pictures
function preloadImages(number = 5) {
  for (let i = 0; i < number; i++) {
    let image = gifResponse.data[index + i]?.images.fixed_width.url;
    if (!preloadedImages.includes(image)) {
      let img = document.createElement("img");
      img.setAttribute("src", image);
      preloadedImages.push(image);
    }
  }
}

// adds the functionality to the previous and the back buttons
// increments and decrements the index of the available gifs
function imageScroll(direction) {
  if (index + direction < 0 || index + direction > 20) return; // should remove the button when not clickable and return when clickable
  index += direction;
  let image = document.getElementById("gifit");
  image.setAttribute("src", gifResponse.data[index].images.fixed_width.url);
  preloadImages();
}

// inserts the gif url into the input element
function addGif(inputElement, imageURL) {
  inputElement.value = imageURL;
  inputElement.removeEventListener("change");
}

// creates a button with the name
// scrollDirection is either a positive or negative 1, indicating direction
function createButton(name, scrollDirection) {
  let button = document.createElement("button");
  button.innerText = name;
  button.setAttribute("id", name + "-button");
  button.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    imageScroll(scrollDirection);
  });
  return button;
}

function createImageElement(inputElement) {
  let imageElement = document.createElement("img");
  imageElement.addEventListener("click", (e) => {
    e.stopPropagation();
    addGif(inputElement, gifResponse.data[index].images.original.url);
  });
  imageElement.setAttribute("id", "gifit");
  imageElement.setAttribute(
    "src",
    gifResponse.data[index].images.fixed_width.url
  );
  imageElement.setAttribute("width", inputElement.clientWidth);
  return imageElement;
}

function createImageContainer(inputElement) {
  let imageContainer = document.createElement("div");
  imageContainer.setAttribute("id", "img-container");
  imageContainer.setAttribute("style", `width:${inputElement.clientWidth}px`);
  return imageContainer;
}

function attachImage(inputElement) {
  let imageElement = createImageElement(inputElement);
  let imageContainer = createImageContainer(inputElement);
  let backButton = createButton("back", -1);
  let nextButton = createButton("next", 1);
  imageContainer.appendChild(backButton);
  imageContainer.appendChild(imageElement);
  imageContainer.appendChild(nextButton);
  return imageContainer;
}

// fetch request for gifs
async function getGIF(inputElement) {
  let searchString = inputElement.value;
  let query = `api_key=${API_KEY}&q=${searchString}&rating=g`;
  let res = await fetch(baseURL + "?" + query);
  gifResponse = await res.json();
  let image = attachImage(inputElement);
  inputElement.after(image);
  preloadedImages = [];
  preloadImages();
  document.addEventListener("click", () => {
    document.getElementById("img-container")?.remove();
  });
}

// debounces the call to giphy to slow down the requests on the input event
function debounce(func) {
  let timeoutID;
  return (event) => {
    document.getElementById("img-container")?.remove();
    clearTimeout(timeoutID);
    timeoutID = setTimeout(() => func(event.target), DEBOUNCE_TIME);
  };
}

// attaches an event listener to every input on the page
let allInputsOnPage = document.getElementsByTagName("input");
for (let i = 0; i < allInputsOnPage.length; i++) {
  let handler = debounce(getGIF);
  allInputsOnPage.item(i).addEventListener("input", handler);
}
