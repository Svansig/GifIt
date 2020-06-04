let API_KEY = "EvYizmjo014uXrSegPAF4upg6cGGG4Gf";

let baseURL = "https://api.giphy.com/v1/gifs/search";

let index = 0;
let gifResponse;

// adds the functionality to the previous and the back buttons
// increments and decrements the index of the available gifs
function imageScroll(direction) {
  index += direction;
  let image = document.getElementById("gifit");
  image.setAttribute("src", gifResponse.data[index].images.fixed_width.url);
}

// inserts the gif url into the input element
function addGif(inputElement, imageURL) {
  inputElement.value = imageURL;
  inputElement.removeEventListener("change");
}

// creates the image container, image element, buttons
// and packages them up
function createImage(imageElement, inputElement) {
  let imageContainer = document.createElement("div");
  imageContainer.setAttribute("id", "img-container");
  let backButton = document.createElement("button");
  backButton.innerText = "back";
  backButton.setAttribute("id", "back-button");
  let nextButton = document.createElement("button");
  nextButton.innerText = "next";
  nextButton.setAttribute("id", "next-button");
  backButton.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    imageScroll(-1);
  });
  nextButton.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    imageScroll(1);
  });

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
  imageContainer.setAttribute("style", `width:${inputElement.clientWidth}px`);
  imageContainer.appendChild(backButton);
  imageContainer.appendChild(imageElement);
  imageContainer.appendChild(nextButton);
  return imageContainer;
}

// fetch request for gifs
async function goGeddit(inputElement, searchString) {
  let query = `api_key=${API_KEY}&q=${searchString}`;
  let res = await fetch(baseURL + "?" + query);
  gifResponse = await res.json();
  let img = document.createElement("img");
  let image = createImage(img, inputElement);
  inputElement.after(image);
  document.addEventListener("click", (event) => {
    document.getElementById("img-container")?.remove();
  });
}

// debounces the call to giphy to slow down the requests on the input event
function changeHandler() {
  let timeoutID;
  return (event) => {
    let value = event.target.value;
    document.getElementById("img-container")?.remove();
    clearTimeout(timeoutID);
    timeoutID = setTimeout(() => goGeddit(event.target, value), 1500);
  };
}

// attaches an event listener to every input on the page
let inputs = document.getElementsByTagName("input");
for (let i = 0; i < inputs.length; i++) {
  let handler = changeHandler();
  inputs.item(i).addEventListener("input", handler);
}
