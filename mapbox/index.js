let map;
const loading = document.querySelector(".fa-spinner");
const suggestions = document.querySelector(".suggestions");
const input = document.getElementById("search-input");
const backToBtn = document.querySelector(".back-to-btn");
let typingTimeout;
let currentLocation;
mapboxgl.accessToken = `pk.eyJ1IjoibWludHRyYW45MDAxIiwiYSI6ImNrcGhwM2R2ZjA1ajQycG43dDc1Nmo5dGwifQ.xFeLkx7CYf2NbuU01uXt0g`;
navigator.geolocation.getCurrentPosition(successCb, errorCb, {
  enableHighAccuracy: true,
});
function successCb(position) {
  setupMap([position.coords.longitude, position.coords.latitude]);
  currentLocation = [
    position.coords.longitude,
    position.coords.latitude,
    (type = "locality"),
  ];
}
function errorCb(error) {
  console.log(error);
  setupMap([106.63333, 10.81667], 10);
}
let marker = new mapboxgl.Marker({
  color: "#f21f22",
  draggable: true,
});
function setupMap(center, zoom = 18) {
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
      viewInfoCard(e.lngLat.lng, e.lngLat.lat);
    });
  });
}
async function viewInfoCard(lng, lat) {
  const result = await fetchByCoordinates(lng, lat);
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
backToBtn.addEventListener("click", (e) => {
  currentLocation &&
    moveToPlace(currentLocation[0], currentLocation[1], currentLocation[2]);
});
function moveToPlace(lng, lat, type) {
  marker.setLngLat([lng, lat]).addTo(map);
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
  map.flyTo({
    center: [lng, lat],
    essential: true,
    zoom,
  });
  currentLocation = [lng, lat, type];
  suggestions.style.display = "none"
}

let isCounting = false;
let queryTimeout;
function delay(query) {
  if (typingTimeout) {
    clearTimeout(typingTimeout);
  }
  typingTimeout = setTimeout(() => {
    suggestions.style.display = query ? "block" : "none";
    query = query.replace(/\//g, "%2F");
    query && fetchData(query.toLowerCase());
  }, 500);
}
 function delayFixedFetch(query) {
  isCounting = true;
  queryTimeout = setTimeout(() => {
    console.log(query);
    suggestions.style.display = "block"
    query = query.replace(/\//g, "%2F");
    query
      ? fetchData(query.toLowerCase(), "delayed")
      : clearTimeoutFixedFetch("delayed");
  }, 1500);
}
input.addEventListener("keyup", (e) => {
  if (e.which <= 90 && e.which >= 48 || e.which===8)
  {
    const query = e.target.value;
    !isCounting && delayFixedFetch(query);
    delay(query);
    query
      ? loading.classList.add("loading")
      : loading.classList.remove("loading");
  }
});

//Stop bubbling
document.body.addEventListener("click", () => {
  suggestions.style.display = "none";
});
document.querySelector(".search-box").addEventListener("click", (e) => {
  suggestions.style.display = "block";
  e.stopPropagation();
});
//Stop bubbling
async function fetchByCoordinates(lng, lat) {
  try {
    const promise = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${mapboxgl.accessToken}`
    );
    return promise.json();
  } catch (error) {
    console.log(error);
  }
}
function clearTimeoutFixedFetch(type) {
  if (type && isCounting) {
    isCounting = false;
    if (queryTimeout) clearTimeout(queryTimeout);
  }
}
async function fetchData(query, type) {
  try {
    const promise = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json?access_token=${mapboxgl.accessToken}`
    );
    if (!promise?.ok) {
      clearTimeoutFixedFetch(type)
      return;
    }
    const data = await promise.json();

    loading.classList.remove("loading");

    if (!data?.features) {
      return;
    }
    if (data.features.length === 0) {
      clearTimeoutFixedFetch(type)
      suggestions.innerHTML = `
      <div class="sug">
          <span>No place found</span>
          </div>
      `;
      return;
    }

    suggestions.innerHTML = "";

    data.features.forEach((item, index) => {
      clearTimeoutFixedFetch(type)
      suggestions.innerHTML += `
      <div onclick="moveToPlace(${
        item.center[0] + "," + item.center[1] + "," + `'${item.place_type[0]}'`
      })" class="sug">
      <i class="fas fa-map-marker-alt"></i>
          <span>${item.place_name}</span>
          </div>
        
        `;
    });
  } catch (error) {
    loading.classList.add("remove");
    clearTimeoutFixedFetch(type)
    suggestions.innerHTML = `
    <div class="sug">
      <i class="fas fa-map-marker-alt"></i>
          <span>${error.message}</span>
          </div>
      `;
  }
}
