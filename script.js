const weatherApiKey = "WHZHGFFHX45NCVTA4ANW5L5B6";
const gifApiKey = "EORY4aoYqfLPrEsJgOOVTrW9Btw69Hjr";
const weatherURL =
  "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline";

const locationInput = document.querySelector(".location-input");
const searchButton = document.querySelector(".search-button");
const cardContainer = document.querySelector(".card-container");

searchButton.addEventListener("click", async (e) => {
  handleSearch(e);
});

locationInput.addEventListener("keypress", async (e) => {
  if (e.key === "Enter") {
    handleSearch(e);
  }
});

initializeWebsite();

// Functions
async function initializeWebsite() {
  cardContainer.appendChild(await createWelcome());
}

async function handleSearch(e) {
  // Prevent the form from submitting
  e.preventDefault();

  // Show loading screen
  cardContainer.textContent = "";
  cardContainer.appendChild(createLoadingScreen());

  try {
    // Fetch weather data
    const weatherData = await getWeatherData(locationInput.value.toLowerCase());
    const weatherCard = createWeatherCard(weatherData);

    // Render weather data
    cardContainer.textContent = "";
    cardContainer.appendChild(weatherCard);
  } catch (error) {
    cardContainer.textContent = "";
    cardContainer.appendChild(createErrorScreen());
  }
}

async function getWeatherData(location) {
  const response = await fetch(
    `${weatherURL}/${location}?unitGroup=metric&key=${weatherApiKey}&contentType=json`
  );
  const weatherData = await response.json();
  const todayWeatherData = weatherData.days[0];

  return {
    address: weatherData.resolvedAddress,
    temp: todayWeatherData.temp,
    feelslike: todayWeatherData.feelslike,
    humidity: todayWeatherData.humidity,
    description: todayWeatherData.description,
    windspeed: todayWeatherData.windspeed,
  };
}

function createWeatherCard(weatherData) {
  const weatherCardDiv = document.createElement("div");
  weatherCardDiv.classList.add("weather-card");

  const locationH2 = document.createElement("h2");
  locationH2.classList.add("location");
  locationH2.textContent = `${weatherData.address}`;

  const tempDetailsDiv = document.createElement("div");
  const tempH1 = document.createElement("h1");
  const feelslikeP = document.createElement("p");
  tempDetailsDiv.classList.add("temp-details");
  tempH1.classList.add("temperature");
  feelslikeP.classList.add("feels-like");
  tempH1.textContent = `${weatherData.temp}°C`;
  feelslikeP.textContent = `Feels like: ${weatherData.feelslike}°C`;

  const weatherInfoDiv = document.createElement("div");
  const descriptionP = document.createElement("p");
  const humidityP = document.createElement("p");
  const windP = document.createElement("p");
  weatherInfoDiv.classList.add("weather-info");
  descriptionP.classList.add("description");
  humidityP.classList.add("humidity");
  windP.classList.add("wind");
  descriptionP.textContent = `${weatherData.description}`;
  humidityP.textContent = `Humidity: ${weatherData.humidity}%`;
  windP.textContent = `Wind: ${weatherData.windspeed} km/h`;

  tempDetailsDiv.appendChild(tempH1);
  tempDetailsDiv.appendChild(feelslikeP);

  weatherInfoDiv.appendChild(descriptionP);
  weatherInfoDiv.appendChild(humidityP);
  weatherInfoDiv.appendChild(windP);

  weatherCardDiv.appendChild(locationH2);
  weatherCardDiv.appendChild(tempDetailsDiv);
  weatherCardDiv.appendChild(weatherInfoDiv);

  return weatherCardDiv;
}

function createLoadingScreen() {
  const loadingScreenDiv = document.createElement("div");
  const spinnerDiv = document.createElement("div");
  const loadingP = document.createElement("p");
  loadingScreenDiv.classList.add("loading-screen");
  spinnerDiv.classList.add("spinner");
  loadingP.textContent = "Loading data, please wait...";

  loadingScreenDiv.appendChild(spinnerDiv);
  loadingScreenDiv.appendChild(loadingP);

  return loadingScreenDiv;
}

function createErrorScreen() {
  const errorScreenDiv = document.createElement("div");
  const errorImg = document.createElement("img");
  const errorH2 = document.createElement("h2");
  const errorP = document.createElement("p");

  errorScreenDiv.classList.add("error-screen");
  errorImg.src = "https://www.svgrepo.com/show/301170/error.svg";
  errorImg.alt = "Error icon";
  errorImg.classList.add("error-icon");
  errorH2.textContent = "Oops! Something went wrong";
  errorP.textContent = `We couldn't fetch the weather data. Please check your connection or try
    again later.`;

  errorScreenDiv.appendChild(errorImg);
  errorScreenDiv.appendChild(errorH2);
  errorScreenDiv.appendChild(errorP);

  return errorScreenDiv;
}

async function createWelcome() {
  const giphImg = document.createElement("img");
  const response = await fetch(
    `https://api.giphy.com/v1/gifs/translate?api_key=${gifApiKey}&s=welcome`,
    {
      mode: "cors",
    }
  );

  const json = await response.json();
  giphImg.src = json.data.images.original.url;

  return giphImg;
}
