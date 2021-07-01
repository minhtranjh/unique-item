const CLOUDINARY_API_URL = `https://api.cloudinary.com/v1_1/mint-twitter-clone/upload `;
const CLOUDINARY_API_UPLOAD_PRESET = "xqntpxoh";
const coverWrapElement = document.querySelector(".cover-wrap");
const reposBtnElement = document.querySelector(".repos");
const wrapperElement = document.querySelector(".wrapper");
const cancelBtnElement = document.querySelector(".cancel-btn");
const uploadBtnElement = document.querySelector(".upload-btn");
const inputFileElement = document.querySelector(".input-file");
const saveBtnElement = document.querySelector(".save-btn");
const resizeBtnElement = document.querySelector(".resize");
const knobElement = document.getElementById("knob");
const knobLeftSide = knobElement.previousElementSibling;
let coverElement;
let positionFromLocal = {};
let positionYOnMouseDown = 0;
let positionXOnMouseDown = 0;
let scrollLeft = 0;
let scrollTop = 0;
let widthPercent = 100;
let inputRangeValue = 0;
let knobClientX = 0;
let knobPassedWidth = 0;
let isSavingCover = false;

function getPositionFromLocal() {
  const position = JSON.parse(localStorage.getItem("position"));
  positionFromLocal = position;
  return positionFromLocal;
}
getPositionFromLocal();
function renderCover() {
  if (positionFromLocal) {
    coverWrapElement.innerHTML = `
            <img src='${positionFromLocal.src}' class="cover">
          `;
  }
  coverElement = document.querySelector(".cover");
}
renderCover();

coverElement && coverElement.addEventListener("load", onLoadCover);
function onLoadCover() {
  coverElement.style.width = positionFromLocal.width + "%";
  coverWrapElement.scrollTop = positionFromLocal.scrollTop;
  coverWrapElement.scrollLeft = positionFromLocal.scrollLeft;
  widthPercent = positionFromLocal.width;
  knobLeftSide.style.width = `${positionFromLocal.resizeValue}%`;
}
knobElement.addEventListener("mousedown", onKnobMouseDown);
function onKnobMouseDown(e) {
  knobClientX = e.clientX;
  knobPassedWidth = knobLeftSide.getBoundingClientRect().width;
  document.addEventListener("mousemove", onKnobMouseMove);
  document.addEventListener("mouseup", onKnobMouseUp);
}
function onKnobMouseMove(e) {
  const dx = e.clientX - knobClientX;
  const containerWidth = knobElement.parentNode.getBoundingClientRect().width;
  let newLeftWidth = ((knobPassedWidth + dx) * 100) / containerWidth;
  newLeftWidth = Math.max(newLeftWidth, 0);
  newLeftWidth = Math.min(newLeftWidth, 100);
  knobLeftSide.style.width = `${newLeftWidth}%`;
  onChangeKnobValue(Math.round(parseInt(newLeftWidth)));
}
function onKnobMouseUp() {
  document.removeEventListener("mousemove", onKnobMouseMove);
  document.removeEventListener("mouseup", onKnobMouseUp);
}
function onChangeKnobValue(value) {
  coverElement.style.width = 100 + value * 2 + "%";
  widthPercent = 100 + value * 2;
  inputRangeValue = value;
}

reposBtnElement.addEventListener("click", openRepositionInput);
function openRepositionInput() {
  coverWrapElement.addEventListener("mousedown", onCoverWrapMouseDown);
  wrapperElement.classList.add("is-reposing");
  resizeBtnElement.style.display = "flex";
  coverWrapElement.style.overflow = "auto";
}

cancelBtnElement.addEventListener("click", cancelRepositioning);
function cancelRepositioning() {
  const prevSavedPosition = getPositionFromLocal();
  if (prevSavedPosition) {
    addPositionToCover(prevSavedPosition);
  } else {
    deleteCover();
  }
  setAllElementToDefault();
}
function setAllElementToDefault() {
  isSavingCover = false;
  inputFileElement.value = "";
  coverWrapElement.style.overflow = "hidden";
  resizeBtnElement.style.display = "none";
  wrapperElement.classList.remove("is-reposing");
  saveBtnElement.classList.remove("is-loading");
  coverWrapElement.removeEventListener("mousedown", onCoverWrapMouseDown);
}
function deleteCover() {
  coverElement.remove();
  coverWrapElement.scrollTop = 0;
  coverWrapElement.scrollLeft = 0;
  knobLeftSide.style.width = `0%`;
  inputRangeValue = 0;
}
function addPositionToCover(position) {
  coverElement.src = position.src;
  coverElement.style.width = position.width + "%";
  coverWrapElement.scrollTop = position.scrollTop;
  coverWrapElement.scrollLeft = position.scrollLeft;
  knobLeftSide.style.width = `${position.resizeValue}%`;
  inputRangeValue = position.resizeValue;
}

uploadBtnElement.addEventListener("click", onClickFileInput);
function onClickFileInput() {
  inputFileElement.click();
}

inputFileElement.addEventListener("change", onInputFileChange, false);
function onInputFileChange(e) {
  const listFiles = e.target.files;
  if (listFiles.length > 0) {
    knobLeftSide.style.width = `${0}%`;
    inputRangeValue = 0;
    widthPercent = 100;
    const src = URL.createObjectURL(listFiles[0]);
    coverWrapElement.innerHTML = `
            <img src='${src}' class="cover">
          `;
    coverElement = document.querySelector(".cover");
    openRepositionInput();
  }
}
async function pushToCloudinary(data) {
  try {
    const result = await fetch(CLOUDINARY_API_URL, {
      method: "POST",
      body: data,
    });
    const url = await result.json();
    inputFileElement.files.length = 0;
    const obj = {
      src: url.secure_url,
      scrollTop: coverWrapElement.scrollTop,
      scrollLeft: coverWrapElement.scrollLeft,
      width: widthPercent,
      resizeValue: inputRangeValue,
    };
    saveToLocal(obj);
    setAllElementToDefault();
  } catch (error) {
    console.log(error);
  }
}
saveBtnElement.addEventListener("click", onSaveCover);
function onSaveCover() {
  if (!isSavingCover) {
    isSavingCover = true;
    saveBtnElement.classList.add("is-loading");
    const file = inputFileElement.files[0];
    resizeBtnElement.style.display = "none";
    coverWrapElement.removeEventListener("mousedown", onCoverWrapMouseDown);
    if (file) {
      cancelBtnElement.style.display = "none";
      coverWrapElement.style.overflow = "hidden";
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", CLOUDINARY_API_UPLOAD_PRESET);
      pushToCloudinary(formData);
    } else {
      const obj = {
        src: positionFromLocal.src,
        scrollTop: coverWrapElement.scrollTop,
        scrollLeft: coverWrapElement.scrollLeft,
        width: widthPercent,
        resizeValue: inputRangeValue,
      };
      saveToLocal(obj);
      setAllElementToDefault();
    }
  }
}
function onCoverWrapMouseDown(e) {
  e.preventDefault();
  window.addEventListener("mousemove", onWindowMouseMove);
  window.addEventListener("mouseup", onWindowMouseUp);
  scrollTop = coverWrapElement.scrollTop;
  scrollLeft = coverWrapElement.scrollLeft;
  positionYOnMouseDown = e.clientY;
  positionxOnMouseDown = e.clientX;
}
function onWindowMouseMove(e) {
  e.preventDefault();
  const dy = e.clientY - positionYOnMouseDown;
  const dx = e.clientX - positionxOnMouseDown;
  coverWrapElement.scrollTop = scrollTop - dy;
  coverWrapElement.scrollLeft = scrollLeft - dx;
}
function onWindowMouseUp(e) {
  e.preventDefault();
  window.removeEventListener("mousemove", onWindowMouseMove);
}
function saveToLocal(obj) {
  localStorage.setItem("position", JSON.stringify(obj));
}
