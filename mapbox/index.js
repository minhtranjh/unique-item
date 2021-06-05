let map;
const loading = document.querySelector(".fa-spinner");
const suggestions = document.querySelector(".suggestions");
const input = document.getElementById("search-input");
let typingTimeout;

mapboxgl.accessToken = `pk.eyJ1IjoibWludHRyYW45MDAxIiwiYSI6ImNrcGhwM2R2ZjA1ajQycG43dDc1Nmo5dGwifQ.xFeLkx7CYf2NbuU01uXt0g`;
navigator.geolocation.getCurrentPosition(successCb, errorCb, {
  enableHighAccuracy: true,
});
function successCb(position) {
  setupMap([position.coords.longitude, position.coords.latitude]);
}
function errorCb(error) {
  alert(error);
}
let marker = new mapboxgl.Marker({
  color: "#f21f22",
  draggable: true,
});
function setupMap(center) {
  map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/streets-v11",
    zoom: 18,
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
  console.log(result);
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
function moveToPlace(lng, lat, type) {
  marker.setLngLat([lng, lat]).addTo(map);
  let zoom = 12;
  console.log(type);
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
}

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

input.addEventListener("keyup", (e) => {
  let query = e.target.value;
  query
    ? loading.classList.add("loading")
    : loading.classList.remove("loading");
  delay(query);
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
async function fetchData(query) {
  try {
    const promise = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json?access_token=${mapboxgl.accessToken}`
    );
    if (!promise?.ok) return;
    const data = await promise.json();

    loading.classList.remove("loading");

    if (!data?.features) {
      return;
    }
    if (data.features.length === 0) {
      suggestions.innerHTML = `
      <div class="sug">
          <span>No place found</span>
          </div>
      `;

      return;
    }

    suggestions.innerHTML = "";

    data.features.forEach((item, index) => {
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
    suggestions.innerHTML = `
    <div class="sug">
      <i class="fas fa-map-marker-alt"></i>
          <span>${error.message}</span>
          </div>
      `;
  }
}
