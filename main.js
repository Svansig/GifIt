//xx Find an input element on the page
//xx attach an event listener
//xx onChange => implement debounce
//xx after debounce,
//xx [hit giphy endpoint]x
//xx append an img element to the input element
//xx img element should load the giphy image
//xx prepend previous button (if any previous, otherwise grey)
//xx append next button (if any, otherwise grey)
// include 'add gif' button - which will replace the input with the giphy link

let API_KEY = "EvYizmjo014uXrSegPAF4upg6cGGG4Gf";

let baseURL = "https://api.giphy.com/v1/gifs/search";

let index = 0;
let gifResponse;

function imageScroll(direction) {
  index += direction;
  let image = document.getElementById("gifit");
  image.setAttribute("src", gifResponse.data[index].images.fixed_width.url);
}

function addGif(inputElement, imageURL) {
  inputElement.value = imageURL;
  inputElement.removeEventListener("change");
}

// take in the array of images and create the image element, with two buttons
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
    imageScroll(-1);
  });
  nextButton.addEventListener("click", (e) => {
    e.preventDefault();
    imageScroll(1);
  });

  imageElement.addEventListener("click", () =>
    addGif(inputElement, gifResponse.data[index].images.fixed_width.url)
  );
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

async function goGeddit(inputElement, searchString) {
  let query = `api_key=${API_KEY}&q=${searchString}`;
  let res = await fetch(baseURL + "?" + query);
  gifResponse = await res.json();
  let img = document.createElement("img");
  let image = createImage(img, inputElement);
  inputElement.after(image);
}

function changeHandler() {
  let timeoutID;
  return (event) => {
    let value = event.target.value;
    document.getElementById("img-container")?.remove();
    clearTimeout(timeoutID);
    timeoutID = setTimeout(() => goGeddit(event.target, value), 1500);
  };
}

// when you call a setTimeout, it returns the id of the timeout
// then you can call clearTimeout on the id

let inputs = document.getElementsByTagName("input");
for (let i = 0; i < inputs.length; i++) {
  let handler = changeHandler();
  inputs.item(i).addEventListener("input", handler);
}

/*
giphy response object:
 {
      type: 'gif',
      id: '1PgPvWLfXGkCY',
      url: 'https://giphy.com/gifs/reactiongifs-1PgPvWLfXGkCY',
      slug: 'reactiongifs-1PgPvWLfXGkCY',
      bitly_gif_url: 'https://gph.is/1mt6nnw',
      bitly_url: 'https://gph.is/1mt6nnw',
      embed_url: 'https://giphy.com/embed/1PgPvWLfXGkCY',
      username: '',
      source: 'https://www.reddit.com/r/reactiongifs/comments/27mifk/mr_after_i_tell_a_bad_joke_to_my_friends/',
      title: 'laugh lol GIF',
      rating: 'g',
      content_url: '',
      source_tld: 'www.reddit.com',
      source_post_url: 'https://www.reddit.com/r/reactiongifs/comments/27mifk/mr_after_i_tell_a_bad_joke_to_my_friends/',
      is_sticker: 0,
      import_datetime: '2014-06-08 17:54:12',
      trending_datetime: '2014-10-18 10:36:38',
      images: [Object],
      analytics_response_payload: 'e=Z2lmX2lkPTFQZ1B2V0xmWEdrQ1kmZXZlbnRfdHlwZT1HSUZfU0VBUkNIJmNpZD1jNDZlNTRkODZhMzI0MDkwODU0YzliNTI2Y2QyYjhmYzI3MjBiN2I0ZDdiMWVjYjY',
      analytics: [Object]
    }
  ],
  pagination: { total_count: 28266, count: 25, offset: 0 },
  meta: {
    status: 200,
    msg: 'OK',
    response_id: '6a324090854c9b526cd2b8fc2720b7b4d7b1ecb6'
  }
*/
