const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/mint-twitter-clone/upload `;
const CLOUDINARY_UPLOAD_PRESET = "xqntpxoh";
const wrap = document.querySelector(".cover-wrap");
const reposBtn = document.querySelector(".repos");
const wrapper = document.querySelector(".wrapper");
const cancelBtn = document.querySelector(".cancel-btn");
const uploadBtn = document.querySelector(".upload-btn");
const inputFile = document.querySelector(".input-file");
const saveBtn = document.querySelector(".save-btn");
const inputRange = document.querySelector(".input-range");
const resizeBtn = document.querySelector(".resize");
let localObj = {};
let startY = 0;
let startX = 0;
let scrollLeft = 0;
let scrollTop = 0;
let widthPercent = 100;
let customInputRange = 0;
const knob = document.getElementById("knob");
const leftSide = knob.previousElementSibling;
let x = 0;
let y = 0;
let leftWidth = 0;
function fetchFromLocal() {
  const wrap = document.querySelector(".cover-wrap");
  localObj = JSON.parse(localStorage.getItem("position"));
  if (localObj) {
    wrap.innerHTML = `
            <img src='${localObj.src}' class="cover">
          `;
  }
}
fetchFromLocal();

const cover = document.querySelector(".cover");
cover && cover.addEventListener("load", onLoadCover);
function onLoadCover() {
  cover.style.width = localObj.width + "%";
  wrap.scrollTop = localObj.scrollTop;
  wrap.scrollLeft = localObj.scrollLeft;
  widthPercent = localObj.width;
  leftSide.style.width = `${localObj.resizeValue}%`;
}
//Customize input range
knob.addEventListener("mousedown", mouseDownHandler);
function mouseUpHandler() {
  document.removeEventListener("mousemove", mouseMoveHandler);
  document.removeEventListener("mouseup", mouseUpHandler);
}

function mouseDownHandler(e) {
  x = e.clientX;
  y = e.clientY;
  leftWidth = leftSide.getBoundingClientRect().width;
  document.addEventListener("mousemove", mouseMoveHandler);
  document.addEventListener("mouseup", mouseUpHandler);
}
function mouseMoveHandler(e) {
  const dx = e.clientX - x;
  const dy = e.clientY - y;

  const containerWidth = knob.parentNode.getBoundingClientRect().width;
  let newLeftWidth = ((leftWidth + dx) * 100) / containerWidth;
  newLeftWidth = Math.max(newLeftWidth, 0);
  newLeftWidth = Math.min(newLeftWidth, 100);

  leftSide.style.width = `${newLeftWidth}%`;
  inputChange(Math.round(parseInt(newLeftWidth)));
}
function inputChange(value) {
  const cover = document.querySelector(".cover");
  cover.style.width = 100 + value * 2 + "%";
  widthPercent = 100 + value * 2;
  customInputRange = value;
}
//Customize input range

////

reposBtn.addEventListener("click", reposition);
function reposition() {
  wrap.addEventListener("mousedown", mousedown);
  wrapper.classList.add("is-reposing");
  resizeBtn.style.display = "flex";
  wrap.style.overflow = "auto";
}
////

cancelBtn.addEventListener("click", cancelRepose);
function cancelRepose() {
  const cover = document.querySelector(".cover");
  localObj = JSON.parse(localStorage.getItem("position"));
  inputFile.value = "";
  if (localObj) {
    cover.src = localObj.src;
    cover.style.width = localObj.width + "%";
    wrap.scrollTop = localObj.scrollTop;
    wrap.scrollLeft = localObj.scrollLeft;
    leftSide.style.width = `${localObj.resizeValue}%`;
    customInputRange = localObj.resizeValue;
  } else {
    const cover = document.querySelector(".cover");
    cover.remove();
    wrap.scrollTop = 0;
    wrap.scrollLeft = 0;
    leftSide.style.width = `0%`;
    customInputRange = 0;
  }

  wrap.style.overflow = "hidden";
  resizeBtn.style.display = "none";
  wrapper.classList.remove("is-reposing");
  wrap.removeEventListener("mousedown", mousedown);
}
//////

uploadBtn.addEventListener("click", () => {
  inputFile.click();
});

inputFile.addEventListener("change", onPickFile, false);
function onPickFile(e) {
  if (e.target.files.length > 0) {
    leftSide.style.width = `${0}%`;
    customInputRange = 0;
    widthPercent = 100;
    const src = URL.createObjectURL(e.target.files[0]);
    wrap.innerHTML = `
            <img src='${src}' class="cover">
          `;
    reposition();
  }
}
saveBtn.addEventListener("click", onSave);
let isLoading = false;
function onSave(e) {
  if (!isLoading) {
    isLoading = true;
    saveBtn.classList.add("is-loading");
    const file = inputFile.files[0];
    resizeBtn.style.display = "none";
    wrap.removeEventListener("mousedown", mousedown);
    console.log(file);
    if (file) {
      cancelBtn.style.display = "none";
      wrap.style.overflow = "hidden";
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
      fetch(CLOUDINARY_URL, {
        method: "POST",
        body: formData,
      })
        .then((response) => {
          const url = response.json();
          return url;
        })
        .then((url) => {
          inputFile.files.length = 0;
          const obj = {
            src: url.secure_url,
            scrollTop: wrap.scrollTop,
            scrollLeft: wrap.scrollLeft,
            width: widthPercent,
            resizeValue: customInputRange,
          };
          saveToLocal(obj);
          isLoading = false;
          inputFile.value = "";
          wrapper.classList.remove("is-reposing");
          cancelBtn.style.display = "initial";
          saveBtn.classList.remove("is-loading");
        })
        .catch((err) => console.log(err));
    } else {
      const obj = {
        src: localObj.src,
        scrollTop: wrap.scrollTop,
        scrollLeft: wrap.scrollLeft,
        width: widthPercent,
        resizeValue: customInputRange,
      };
      saveToLocal(obj);
      isLoading = false;
      inputFile.value = "";
      wrapper.classList.remove("is-reposing");
      wrap.style.overflow = "hidden";
      saveBtn.classList.remove("is-loading");
    }
  }
}
function mousedown(e) {
  e.preventDefault();
  window.addEventListener("mousemove", mousemove);
  window.addEventListener("mouseup", mouseup);
  scrollTop = wrap.scrollTop;
  scrollLeft = wrap.scrollLeft;
  startY = e.clientY;
  startX = e.clientX;
}
function mousemove(e) {
  e.preventDefault();
  const dy = e.clientY - startY;
  const dx = e.clientX - startX;
  wrap.scrollTop = scrollTop - dy;
  wrap.scrollLeft = scrollLeft - dx;
}
function mouseup(e) {
  e.preventDefault();
  window.removeEventListener("mousemove", mousemove);
}
function saveToLocal(obj) {
  localStorage.setItem("position", JSON.stringify(obj));
}