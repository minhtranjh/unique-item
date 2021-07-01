let currentSlideIndex = 1;
let sliderTranslateX = -100;

const sliderElement = document.querySelector(".slider");
const dotElementList = document.querySelectorAll(".dot");
let slideElementList = document.querySelectorAll(".slide");

const firstCloneSlideItem = slideElementList[0].cloneNode(true);
const lastCloneSlideItem = slideElementList[slideElementList.length - 1].cloneNode(true);

function createCloneSlideItem() {
  firstCloneSlideItem.id = "first-clone";
  lastCloneSlideItem.id = "last-clone";
  sliderElement.append(firstCloneSlideItem);
  sliderElement.prepend(lastCloneSlideItem);
}
createCloneSlideItem();

function setNonTransitionSliderTranslateX(x) {
  sliderElement.style.transition = "none";
  sliderElement.style.transform = `translateX(${x}%)`;
}
setNonTransitionSliderTranslateX(sliderTranslateX);

function setTransitionSliderTranslateX(x) {
  sliderElement.style.transition = ".7s";
  sliderElement.style.transform = `translateX(${x}%)`;
}

function switchDotButtonColor(oldIndex, newIndex) {
  dotElementList[oldIndex].classList.remove("is-active");
  dotElementList[newIndex].classList.add("is-active");
}

sliderElement.addEventListener("transitionend", onSliderTransitionEnded);

function onSliderTransitionEnded() {
  slideElementList = document.querySelectorAll(".slide");
  const currentSlideElementId = slideElementList[currentSlideIndex].id;
  if (currentSlideElementId === firstCloneSlideItem.id) {
    currentSlideIndex = 1;
    sliderTranslateX = -100;
    setNonTransitionSliderTranslateX(sliderTranslateX);
  }
  if (currentSlideElementId === lastCloneSlideItem.id) {
    currentSlideIndex = slideElementList.length - 2;
    sliderTranslateX = -(slideElementList.length - 2) * 100;
    setNonTransitionSliderTranslateX(sliderTranslateX);
  }
}

function nextSlideItem() {
  if (currentSlideIndex >= sliderElement.length - 1) return;
  if (currentSlideIndex >= dotElementList.length) {
    switchDotButtonColor(currentSlideIndex - 1, 0);
  } else {
    switchDotButtonColor(currentSlideIndex - 1, currentSlideIndex);
  }
  currentSlideIndex += 1;
  sliderTranslateX -= 100;
  setTransitionSliderTranslateX(sliderTranslateX);
}

function previousSlideItem() {
  if (currentSlideIndex <= 0) return;
  if (currentSlideIndex - 1 <= 0) {
    switchDotButtonColor(currentSlideIndex - 1, dotElementList.length - 1);
  } else {
    switchDotButtonColor(currentSlideIndex - 1, currentSlideIndex - 2);
  }
  currentSlideIndex -= 1;
  sliderTranslateX += 100;
  setTransitionSliderTranslateX(sliderTranslateX);
}

function changeSlideByIndex(slideIndex) {
  switchDotButtonColor(currentSlideIndex - 1, slideIndex - 1);
  currentSlideIndex = slideIndex;
  sliderTranslateX = -100 * slideIndex;
  setTransitionSliderTranslateX(sliderTranslateX);
}
