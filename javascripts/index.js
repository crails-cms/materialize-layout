console.log("Mais tant d'eau dans ton ciboulot, ça aurait pu etre beau");

import {tns} from "tiny-slider/src/tiny-slider.js";
import wowjs from "wowjs";

const wow = new wowjs.WOW({
  animateClass: "animate__animated",
  live:         false
});

function loadOptionsFrom(element, wrapper) {
  const interval = parseFloat(element.dataset.interval) || 0;
  return {
    container:       wrapper || element,
    controls:        false,
    nav:             false,
    autoplayButtonOutput: false,
    mode:            element.dataset.mode || "carousel",
    items:           element.dataset.items || 1,
    autoplay:        interval > 0,
    autoplayTimeout: interval * 1000,
    responsive:      window.cmsSliderResponsiveOptions || false,
    lazyload:        true,
    mouseDrag:       true,
    fixedHeight:     element.dataset.height || 0
  };
}

function loadSlider(element) {
  const wrapper = element.lastElementChild;
  const options = loadOptionsFrom(element, wrapper.lastElementChild);

  for (let slide of options.container.children)
    options.fixedHeight = Math.max(options.fixedHeight, slide.offsetHeight);
  for (let slide of options.container.children)
    slide.style.height = options.fixedHeight;
  element.$slider = tns(options);
}

function loadScreenshots(element) {
  const wrapper = element.lastElementChild.lastElementChild;
  const options = loadOptionsFrom(element, wrapper);

  element.$slider = tns(options);
}

function hidePreloader() {
  const overlay = document.querySelector(".ms-preload");

  overlay.style.opacity = 0;
  overlay.style.pointerEvents = "none";
}

export function loadSliders() {
  for (let element of document.querySelectorAll("[data-component=slider]")) {
    loadSlider(element);
  }
  for (let element of document.querySelectorAll("[data-component=screenshots]")) {
    loadScreenshots(element);
  }
  setTimeout(hidePreloader, 350);
  wow.init();
}

document.addEventListener("DOMContentLoaded", loadSliders);

window.loadSliders = loadSliders;
window.tns = tns;

console.log("Mais tant d'eau dans ton ciboulot");
