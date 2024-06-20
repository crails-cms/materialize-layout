console.log("Mais tant d'eau dans ton ciboulot, ça aurait pu etre beau");

import {tns} from "tiny-slider/src/tiny-slider.js";
import wowjs from "wowjs";
import materialize from "../node_modules/@materializecss/materialize/dist/js/materialize.js";

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

function hidePreloader(forced) {
  const overlay = document.querySelector(".ms-preload");

  if (forced)
    overlay.style.transition = "initial";
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
  if (document.referrer.startsWith(window.origin))
    hidePreloader(1);
  else
    setTimeout(hidePreloader, 350);
}

export function loadMaterialize() {
  document.querySelectorAll("input[type='checkbox']").forEach(input => {
    const next = input.nextElementSibling;
    if (next.classList.contains("helper")) {
      next.addEventListener("click", function() { input.checked = !input.checked; });
    }
  });
}

document.addEventListener("DOMContentLoaded", loadSliders);
document.addEventListener("DOMContentLoaded", loadMaterialize);
document.addEventListener("DOMContentLoaded", wow.init.bind(wow));

window.loadSliders = loadSliders;
window.loadMaterialize = loadMaterialize;
window.tns = tns;

console.log("Mais tant d'eau dans ton ciboulot");
