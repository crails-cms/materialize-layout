const loremIpsum = "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad ninim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea comodo consequat. Duis aute irure dolor.";

Cms.PageEditor.GridComponentEditor.model = new class extends PageEditor.GridComponentEditor.Model {
  get minColumns() { return 1; }
  get maxColumns() { return 12; }
  get gridClassList() { return ["row"]; }
  get componentClassPattern() { return /^(col|xl[0-9]{1,2}|[sml][0-9]{1,2})$/; }
  widthFromSize(sizeId) { return [1201, 993, 601, 500][sizeId]; }
  mediaSizeName(value) { return ['xl', 'l', 'm', 's'][value]; }
  sizeFromMediaName(value) {
    return {
      'xl': this.sizes.VeryLarge, 'l': this.sizes.Large,
      'm': this.sizes.Medium, 's': this.sizes.Small
    }[value];
  }
  extractSizeAndSpanFromClassMatch(match) {
    if (match[0] == "col") return null;
    return {
      media: match[0].startsWith("xl") ? "xl" : match[0][0],
      span: parseInt(match[0].slice(1)) / 12
    };
  }
  updateElementSizes(element, sizes) {
    super.updateElementSizes(element, sizes);
    element.classList.add("col");
  }
  classNameForSpan(media, span) {
    const ratio = (span / this.maxColumns) * 12;
    return `${media}${ratio}`;
  }
};

function addAnimationClass(element, animation, delay = null) {
  const animationPrefix = "animate__";

  element.classList.add("wow", `${animationPrefix}${animation}`);
  if (delay)
    element.classList.add(`${animationPrefix}${delay}s`);
}

class InfoCardComponent extends Cms.PageEditor.GridComponentEditor() {
  initializeProperties() {
    this.properties.image = { type: "image", target: this.image, attribute: "src" };
    this.properties.tint = { type: "color", target: this, attribute: "tint" };
    super.initializeProperties();
  }

  get tint() {
    return this.root.dataset.tint || "blue";
  }

  set tint(value) {
    this.root.dataset.tint = value;
    this.card.style.borderBottomColor = value;
    this.header.style.setProperty("background-color", value, "important");
    this.updateStyle();
  }

  create() {
    const card = document.createElement("div");
    const header = document.createElement("div");
    const image = document.createElement("img");
    const content = document.createElement("div");
    const style = document.createElement("style");

    card.classList.add("card", "card-info");
    addAnimationClass(card, "zoomInUp");
    header.className = "bg-info";
    image.className = "img-avatar-circle";
    content.className = "card-block pt-4 text-center";
    content.dataset.editable = '';
    content.dataset.name = `${this.id}-content`;
    content.innerHTML = `<h4>Lorem ipsum !</h4>
    <p>Dolor sit amet consetitur.</p>
    `;
    header.appendChild(image);
    card.appendChild(header);
    card.appendChild(content);
    this.root.appendChild(style);
    this.root.appendChild(card);
    super.create();
  }

  bindElements() {
    this.image = this.root.querySelector(".bg-info > img");
    this.card = this.root.querySelector(":scope > .card");
    this.header = this.card.querySelector(":scope > .bg-info");
    this.css = this.root.querySelector(":scope > style");
    super.bindElements();
  }

  updateStyle() {
    this.css.innerHTML = `[data-id="${this.id}"] h4 { color: ${this.tint}; }`;
  }
}

class ContentComponent extends Cms.PageEditor.GridComponentEditor() {
  initializeProperties() {
    super.initializeProperties();
  }

  create() {
    const container = document.createElement("div");
    container.dataset.editable = '';
    container.dataset.name = `${this.id}-content`;
    container.innerHTML = `<p>${loremIpsum}</p>`;
    this.root.appendChild(container);
    super.create();
  }
}

class PictureComponent extends Cms.PageEditor.ImageComponentEditor {
  create() {
    super.create();
    this.image.classList.add("img-responsive", "center-block");
    addAnimationClass(this.image, "zoomIn", 2);
  }
}

class ScreenshotsComponent extends Cms.PageEditor.GridComponentEditor() {
  initializeProperties() {
    this.properties.images = { type: "images", target: this, attribute: "images" };
    this.properties.interval = { type: "number", target: this.root.dataset, attribute: "interval", min: 0 };
    super.initializeProperties();
  }

  create() {
    const wrapper = document.createElement("div");
    const slider = document.createElement("div");
    const screenFrame = document.createElement("img");

    screenFrame.src = "http://planed.es/assets/img/demo/mock-imac-material2.png";
    screenFrame.classList.add("img-responsive");
    addAnimationCard(wrapper, "zoomInUp");
    wrapper.classList.add("ms-hero-img");
    wrapper.appendChild(screenFrame);
    wrapper.appendChild(slider);
    this.root.appendChild(wrapper);
    super.create();
  }

  bindElements() {
    this.wrapper = this.root.lastElementChild;
    this.frame = this.wrapper.children[0];
    this.slider = this.wrapper.children[1];
    super.bindElements();
  }

  get images() {
    const array = [];
    for (let child of this.slider.children) {
      array.push({
        url:           child.dataset.src,
        miniature_url: child.dataset.thumb,
        name:          child.dataset.name
      });
    }
    return JSON.stringify(array);
  }

  set images(value) {
    this.reset();
    value = JSON.parse(value);
    value.forEach(file => {
      const slide = document.createElement("img");

      slide.dataset.src   = slide.src = file.url;
      slide.dataset.thumb = file.miniature_url;
      slide.dataset.name  = file.name;
      this.slider.appendChild(slide);
    });
  }

  reset() {
    this.slider.innerHTML = "";
  }
}

const gridComponents = {
  card:        ContentComponent,
  picture:     PictureComponent,
  infoCard:    InfoCardComponent,
  slider:      Cms.PageEditor.SliderComponentEditor,
  screenshots: ScreenshotsComponent
};

class RibbonComponent extends Cms.PageEditor.NestedComponentEditor {
  constructor(parent, element) {
    const components = {};
    for (let component in gridComponents)
      components[component] = gridComponents[component];
    super(parent, element, components);
  }

  initializeProperties() {
    this.properties.textColor =
      { type: "color", target: this.root, style: "color" };
    this.properties.tint =
      { type: "color", target: this, attribute: "tint" };
    super.initializeProperties();
  }

  get container() {
    return this.row;
  }

  get tint() {
    return this.root.dataset.tint || "transparent";
  }

  set tint(color) {
    this.root.dataset.tint = color;
    this.updateStyle();
  }

  create() {
    const container = this.root;
    const content = document.createElement("div");
    const header = document.createElement("div");
    const row = document.createElement("div");
    const style = document.createElement("style");

    container.dataset.tint = "#4fc3f7";
    content.className = "container";
    header.classList.add("text-center", "text-light");
    addAnimationClass(header, "fadeInDown", 5);
    header.dataset.editable = '';
    header.dataset.name = `${this.id}-header`;
    header.innerHTML = `<h2>Lorem Ipsum Dolor Sit</h2><p>${loremIpsum}</p>`;
    row.className = "row";
    container.appendChild(style);
    container.appendChild(content);
    content.appendChild(header);
    content.appendChild(row);
    super.create();
    this.updateStyle();
  }

  bindElements() {
    this.row = this.root.querySelector(".row");
    this.css = this.root.querySelector("style");
    super.bindElements();
  }

  updateStyle() {
    this.css.innerHTML = "";
    this.css.innerHTML += `[data-id="${this.id}"] .container > div:first-child h2 { color: ${this.tint }; };`;
  }
}

class DecoratedRibbonComponent extends RibbonComponent {
  constructor(parent, element) {
    super(parent, element, gridComponents);
  }

  initializeProperties() {
    this.properties.background = { type: "image", target: this.root, style: "backgroundImage" };
    this.properties.fixedBackground =  { type: "bool", target: this, attribute: "fixedBackground" };
    super.initializeProperties();
  }

  get container() {
    return this.row;
  }

  get fixedBackground() {
    return this.root.classList.contains("ms-bg-fixed");
  }

  set fixedBackground(value) {
    const action = value ? 'add' : 'remove';
    this.root.classList[action]("ms-bg-fixed");
  }

  create() {
    super.create();
    this.root.classList.add("wrap");
  }

  updateStyle() {
    this.css.innerHTML = `[data-id="${this.id}"].wrap:before { background-color: ${this.tint}; opacity: 0.8; }`;
  }
}

class FooterSocialsComponent extends Cms.PageEditor.GridComponentEditor(PageEditor.SocialComponentEditor) {
  constructor(parent, element) {
    super(parent, element);
    this.socials = {
      facebook:  { icon: "zmdi zmdi-facebook",  property: "socialFacebook" },
      instagram: { icon: "zmdi zmdi-instagram", property: "socialInstagram" },
      linkedin:  { icon: "zmdi zmdi-linkedin",  property: "socialLinkedIn" },
      youtube:   { icon: "zmdi zmdi-youtube",   property: "socialYoutube" }
    };
  }

  get socialFacebook() { return this.getSocialButtonValue("facebook"); }
  set socialFacebook(value) { this.updateSocialButton("facebook", value); }
  get socialInstagram() { return this.getSocialButtonValue("instagram"); }
  set socialInstagram(value) { this.updateSocialButton("instagram", value); }
  get socialLinkedIn() { return this.getSocialButtonValue("linkedin"); }
  set socialLinkedIn(value) { this.updateSocialButton("linkedin", value); }
  get socialYoutube() { return this.getSocialButtonValue("youtube"); }
  set socialYoutube(value) { this.updateSocialButton("youtube", value); }

  create() {
    const socialContainer = document.createElement("div");
    const title = document.createElement("div");

    socialContainer.classList.add("ms-footbar-social");
    title.classList.add("ms-footbar-title");
    title.dataset.editable = "";
    title.innerHTML = "<h3>Social medias</h3>";
    this.root.appendChild(title);
    this.root.appendChild(socialContainer);
    super.create();
  }

  get socialContainer() {
    return this.root.querySelector(".ms-footbar-social");
  }

  createSocialButton(type) {
    const link = document.createElement("a");
    const icon = document.createElement("i");

    icon.className = this.socials[type].icon;
    link.classList.add(type, "btn-circle");
    link.appendChild(icon);
    this.socialContainer.appendChild(link);
    return link;
  }
}

class FooterAddressComponent extends Cms.PageEditor.GridComponentEditor() {
  initializeProperties() {
    this.properties.phone = { type: "phone", target: this.phone, attribute: "textContent" };
    this.properties.address = { type: "text", target: this.address, attribute: "textContent" };
    this.properties.city = { type: "text", target: this.city, attribute: "textContent" };
    this.properties.email = { type: "mail", target: this.email, attribute: "textContent" };
    super.initializeProperties();
  }

  createLine(icon, type) {
    const p = document.createElement("p");
    const iconElement = document.createElement("i");
    const content = document.createElement("span");

    iconElement.classList.add("zmdi", `zmdi-${icon}`);
    p.dataset.type = type;
    p.appendChild(iconElement);
    p.appendChild(content);
    return p;
  }

  create() {
    const company = document.createElement("div");
    const container = document.createElement("address");
    const logo = document.createElement("span");
    const companyText = document.createElement("span");

    companyText.dataset.editable = "";
    companyText.innerHTML = "<h3>Your company</h3>";
    logo.classList.add("ms-logo", "ms-logo-sm");
    company.classList.add("ms-footbar-title");
    company.appendChild(logo);
    company.appendChild(companyText);
    container.appendChild(this.createLine("pin", "address"));
    container.appendChild(this.createLine("map", "city"));
    container.appendChild(this.createLine("email", "email"));
    container.appendChild(this.createLine("phone", "phone"));
    this.root.appendChild(company);
    this.root.appendChild(container);
    super.create();
  }

  bindElements() {
    this.address = this.root.querySelector("[data-type=address] > span");
    this.city    = this.root.querySelector("[data-type=city] > span");
    this.email   = this.root.querySelector("[data-type=email] > span");
    this.phone   = this.root.querySelector("[data-type=phone] > span");
    super.bindElements();
  }
}

class FooterCardComponent extends Cms.PageEditor.GridComponentEditor() {
  create() {
    const content = document.createElement("div");

    content.innerHTML = "<h3>Lorem ipsum</h3><p>Lorem ipsum dolor sit ahmet.";
    content.dataset.editable = "";
    this.root.appendChild(content);
  }
}

class FooterComponent extends Cms.PageEditor.FooterComponentEditor {
  constructor(parent, element) {
    super(parent, element, {
      card:    FooterCardComponent,
      address: FooterAddressComponent,
      socials: FooterSocialsComponent
    });
  }

  create() {
    const aside = document.createElement("aside");
    const container = document.createElement("div");
    const row = document.createElement("div");
    const footer = document.createElement("footer");

    footer.classList.add("ms-footer");
    aside.classList.add("ms-footbar");
    container.classList.add("container");
    row.classList.add("row");
    footer.dataset.editable = "";
    footer.innerHTML = "<p>Copyright © Your Company 1970</p>";
    aside.appendChild(container);
    container.appendChild(row);
    this.root.appendChild(aside);
    this.root.appendChild(footer);
    super.create();
  }

  get container() {
    return this.root.querySelector(":scope > .ms-footbar > .container > .row");
  }
}

class MaterialLandingLayoutEditor extends Cms.PageEditor.LayoutEditor {
  constructor(element) {
    super(element, {
      ribbon: RibbonComponent,
      decoratedRibbon: DecoratedRibbonComponent,
      footer: FooterComponent
    });
  }
}

