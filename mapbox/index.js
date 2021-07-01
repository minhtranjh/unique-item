const loadingElement = document.querySelector(".fa-spinner");
const suggestionsElement = document.querySelector(".suggestions");
const searchInputElement = document.getElementById("search-input");
const backToBtnElement = document.querySelector(".back-to-btn");

let map;
let currentLocation;
let isFetching = false;
let typingTimeout;
let fetchTimeout;

function configMapBox(center, zoom = 18) {
  map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/streets-v11",
    zoom: zoom,
    center: center,
  });
  map.on("load", () => {
    map.addSource("single-point", {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: [],
      },
    });
    map.on("click", (e) => {
      viewLocationInfoCard(e.lngLat.lng, e.lngLat.lat);
    });
  });
}
function onSetupMapBoxSuccess(position) {
  configMapBox([position.coords.longitude, position.coords.latitude]);
  currentLocation = [
    position.coords.longitude,
    position.coords.latitude,
    (type = "locality"),
  ];
}
function onSetupMapBoxFail(error) {
  setupMap([106.63333, 10.81667], 10);
}
function mapBoxSetUp() {
  mapboxgl.accessToken = `pk.eyJ1IjoibWludHRyYW45MDAxIiwiYSI6ImNrcGhwM2R2ZjA1ajQycG43dDc1Nmo5dGwifQ.xFeLkx7CYf2NbuU01uXt0g`;
  navigator.geolocation.getCurrentPosition(
    onSetupMapBoxSuccess,
    onSetupMapBoxFail,
    {
      enableHighAccuracy: true,
    }
  );
}
let marker = new mapboxgl.Marker({
  color: "#f21f22",
  draggable: true,
});
mapBoxSetUp();

async function viewLocationInfoCard(lng, lat) {
  const result = await getLocationByCoordinates(lng, lat);
  const popup = new mapboxgl.Popup({ closeButton: false });
  popup
    .setHTML(
      `
          <h3>
              ${result.features[0].context[1].text}
          </h3>
          <p>${result.features[0].place_name}</p>
          <p style="color:#2f2f2f;font-size:10px;">${lng + "," + lat}</p>
      `
    )
    .setLngLat([lng, lat])
    .addTo(map);
}
backToBtnElement.addEventListener("click", backToCurrentLocation);
function backToCurrentLocation() {
  if (currentLocation) {
    onFlyToLocation(currentLocation[0], currentLocation[1], currentLocation[2]);
  }
}
function getZoomByLocationType(type) {
  let zoom = 12;
  switch (type) {
    case "locality":
      zoom = 16;
      break;
    case "country":
      zoom = 5;
      break;
    case "region":
      zoom = 10;
      break;
    case "place":
      zoom = 12;
      break;
    case "poi":
      zoom = 17;
      break;
    default:
      break;
  }
  return zoom;
}
function onFlyToLocation(lng, lat, type) {
  const zoom = getZoomByLocationType(type);
  marker.setLngLat([lng, lat]).addTo(map);
  map.flyTo({
    center: [lng, lat],
    essential: true,
    zoom,
  });
  currentLocation = [lng, lat, type];
  setTimeout(() => {
    hideSuggestionBox();
  });
}

function debounceSuggest(callback) {
  if (typingTimeout) {
    clearTimeout(typingTimeout);
  }
  typingTimeout = setTimeout(callback, 500);
}
function delaySuggest(callback) {
  isFetching = true;
  fetchTimeout = setTimeout(callback, 1200);
}
function stopSuggestFixedTimeout() {
  if (isFetching) {
    isFetching = false;
    if (fetchTimeout) clearTimeout(fetchTimeout);
  }
}

function viewSuggestionBox() {
  suggestionsElement.classList.add("view");
}
function hideSuggestionBox() {
  suggestionsElement.classList.remove("view");
}
function viewLoadingIcon() {
  loadingElement.classList.add("loading");
}
function hideLoadingIcon() {
  loadingElement.classList.remove("loading");
}


async function onSuggestLocationFixedTimeout(query) {
  query ? viewSuggestionBox() : hideSuggestionBox();
  if (query) {
    const formattedQuery = query.replace(/\//g, "%2F").toLowerCase();
    const locations = await getLocationByName(formattedQuery);
    locations ? suggestLocation(locations) : onSuggestLocationFail();
  } else {
    stopSuggestFixedTimeout();
  }
  hideLoadingIcon();
}
async function onSuggestLocation(query) {
  query ? viewSuggestionBox() : hideSuggestionBox();
  stopSuggestFixedTimeout();
  if (query) {
    const formattedQuery = query.replace(/\//g, "%2F").toLowerCase();
    const locations = await getLocationByName(formattedQuery);
    locations && suggestLocation(locations);
    hideLoadingIcon();
  }
}
function checkInputValueIsValid(e) {
  return (e.which <= 90 && e.which >= 48) || e.which === 8;
}
searchInputElement.addEventListener("keyup", onSearchInputChange);
function onSearchInputChange(e) {
  if (checkInputValueIsValid()) {
    let query = e.target.value;
    if (!isFetching) {
      delaySuggest(onSuggestLocationFixedTimeout(query));
    }
    debounceSuggest(onSuggestLocation(query));
    query ? viewLoadingIcon() : hideLoadingIcon();
  }
}

async function getLocationByCoordinates(lng, lat) {
  try {
    const promise = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${mapboxgl.accessToken}`
    );
    return promise.json();
  } catch (error) {
    return error;
  }
}
function suggestLocation(data) {
  if (!data?.features || data.features.length === 0) {
    suggestionsElement.innerHTML = `
    <div class="sug">
        <span>No place found</span>
        </div>
    `;
  } else {
    const html = data.features
      .map(
        (item) =>
          `
      <div onclick="onFlyToLocation(${
        item.center[0] + "," + item.center[1] + "," + `'${item.place_type[0]}'`
      })" class="sug">
          <i class="fas fa-map-marker-alt"></i>
          <span>${item.place_name}</span>
        </div>
        
        `
      )
      .join("");
    suggestionsElement.innerHTML = html;
  }
}
async function getLocationByName(query) {
  try {
    const promise = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json?access_token=${mapboxgl.accessToken}`
    );
    if (!promise?.ok) {
      return;
    }
    const data = await promise.json();
    return data;
  } catch (error) {
    return undefined;
  }
}
function onSuggestLocationFail() {
  suggestionsElement.innerHTML = `
    <div class="sug">
      <i class="fas fa-map-marker-alt"></i>
      <span>Something went wrong</span>
    </div>
      `;
}
document.body.addEventListener("click", () => {
  viewSuggestionBox();
});
document.querySelector(".search-box").addEventListener("click", (e) => {
  hideSuggestionBox();
  e.stopPropagation();
});
